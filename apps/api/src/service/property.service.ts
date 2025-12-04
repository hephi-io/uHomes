import mongoose from 'mongoose';

import Property, { IProperty } from '../models/property.model';
import User from '../models/user.model';
import UserType from '../models/user-type.model';

import { BadRequestError, NotFoundError, UnauthorizedError } from '../middlewares/error.middlewere';

import cloudinary from '../config/cloudinary';

interface CloudinaryImage {
  url: string;
  cloudinary_id: string;
}

export class PropertyService {
  async createProperty(
    agentId: string,
    data: Partial<IProperty>,
    files?: Express.Multer.File[]
  ): Promise<IProperty> {
    if (!agentId) throw new UnauthorizedError('Unauthorized agent');

    // Validate agent type
    const agentType = await UserType.findOne({ userId: agentId });
    if (!agentType || agentType.type !== 'agent') {
      throw new UnauthorizedError('Only agents can create properties');
    }

    if (!files || files.length === 0) throw new BadRequestError('At least one image is required');

    const uploadedImages: CloudinaryImage[] = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
      uploadedImages.push({
        url: result.secure_url,
        cloudinary_id: result.public_id,
      });
    }

    const newProperty = await Property.create({
      ...data,
      images: uploadedImages,
      agentId: [agentId],
    });

    // Update user's properties array
    await User.findByIdAndUpdate(agentId, {
      $push: { properties: newProperty._id },
    });

    return newProperty;
  }

  async getAllProperties(filters: {
    page?: number;
    limit?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    amenities?: string[];
    agentId?: string;
    sortBy?: string;
  }): Promise<{
    properties: IProperty[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      location,
      amenities,
      agentId,
      sortBy = 'createdAt',
    } = filters;

    // Build query object
    const query: any = { isAvailable: true };

    // Search filter (title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) {
        query.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        query.price.$lte = maxPrice;
      }
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Amenities filter (must contain all specified amenities)
    if (amenities && amenities.length > 0) {
      query.amenities = { $all: amenities };
    }

    // Agent filter
    if (agentId && mongoose.Types.ObjectId.isValid(agentId)) {
      query.agentId = { $in: [new mongoose.Types.ObjectId(agentId)] };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Property.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Build sort object
    let sort: any = { [sortBy]: -1 };
    if (sortBy === 'price') {
      sort = { price: 1 }; // Ascending for price
    } else if (sortBy === 'rating') {
      sort = { rating: -1 }; // Descending for rating
    }

    // Execute query with pagination
    const properties = await Property.find(query)
      .populate('agentId', 'fullName email phoneNumber')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    return { properties, total, page, limit, totalPages };
  }

  async getPropertyById(id: string): Promise<IProperty> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError('Invalid property ID');
    const property = await Property.findById(id).populate('agentId', '-password');
    if (!property) throw new NotFoundError('Property not found');
    return property;
  }

  async getPropertiesByAgent(
    agentId: string,
    page = 1,
    limit = 10
  ): Promise<{ properties: IProperty[]; total: number; page: number; limit: number }> {
    if (!mongoose.Types.ObjectId.isValid(agentId)) throw new NotFoundError('Invalid agent ID');

    // Validate agent type
    const agentType = await UserType.findOne({ userId: agentId });
    if (!agentType || agentType.type !== 'agent') {
      throw new BadRequestError('Invalid agent ID');
    }

    const skip = (page - 1) * limit;
    const total = await Property.countDocuments({ agentId });

    if (total === 0) throw new NotFoundError('No properties found for this agent');

    const properties = await Property.find({ agentId })
      .skip(skip)
      .limit(limit)
      .populate('agentId', '-password');

    return { properties, total, page, limit };
  }

  async updateProperty(
    id: string,
    data: Partial<IProperty> & { replaceImages?: boolean },
    files?: Express.Multer.File[]
  ): Promise<IProperty> {
    const property = await Property.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    // Parse JSON strings if they exist (for multipart/form-data)
    if (data.roomTypes && typeof data.roomTypes === 'string') {
      try {
        data.roomTypes = JSON.parse(data.roomTypes);
      } catch {
        throw new BadRequestError('Invalid roomTypes format');
      }
    }

    if (data.amenities && typeof data.amenities === 'string') {
      try {
        data.amenities = JSON.parse(data.amenities);
      } catch {
        throw new BadRequestError('Invalid amenities JSON');
      }
    }

    if (files && files.length > 0) {
      const uploadedImages: CloudinaryImage[] = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push({
          url: result.secure_url,
          cloudinary_id: result.public_id,
        });
      }

      if (data.replaceImages) {
        property.images = uploadedImages;
      } else {
        property.images.push(...uploadedImages);
      }
    }

    if (data.images && Array.isArray(data.images)) {
      property.images = data.images.map((img) => {
        if (typeof img === 'string') return { url: img, cloudinary_id: '' };
        return img;
      });
    }

    Object.assign(property, data);
    await property.save();
    return property;
  }

  async deleteProperty(id: string): Promise<void> {
    const property = await Property.findById(id);
    if (!property) throw new NotFoundError('Property not found');

    for (const img of property.images) {
      await cloudinary.uploader.destroy(img.cloudinary_id);
    }

    await Property.findByIdAndDelete(id);
  }

  async deleteSingleImage(propertyId: string, cloudinaryId: string): Promise<IProperty> {
    const property = await Property.findById(propertyId);
    if (!property) throw new NotFoundError('Property not found');

    await cloudinary.uploader.destroy(cloudinaryId);
    property.images = property.images.filter((img) => img.cloudinary_id !== cloudinaryId);
    await property.save();
    return property;
  }

  async getSavedProperties(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<{
    properties: IProperty[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Validate user type
    const userType = await UserType.findOne({ userId });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can access saved properties');
    }

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const savedPropertyIds = user.savedProperties || [];
    const skip = (page - 1) * limit;
    const total = savedPropertyIds.length;
    const totalPages = Math.ceil(total / limit);

    // Get paginated property IDs
    const paginatedIds = savedPropertyIds.slice(skip, skip + limit);

    const properties = await Property.find({ _id: { $in: paginatedIds } })
      .populate('agentId', 'fullName email phoneNumber')
      .sort({ createdAt: -1 });

    return { properties, total, page, limit, totalPages };
  }

  async saveProperty(userId: string, propertyId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new BadRequestError('Invalid property ID');
    }

    // Validate user type
    const userType = await UserType.findOne({ userId });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can save properties');
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) throw new NotFoundError('Property not found');

    // Add property to user's saved properties if not already saved
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedProperties: propertyId },
    });
  }

  async unsaveProperty(userId: string, propertyId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new BadRequestError('Invalid property ID');
    }

    // Validate user type
    const userType = await UserType.findOne({ userId });
    if (!userType) throw new NotFoundError('User type not found');
    if (userType.type !== 'student') {
      throw new UnauthorizedError('Only students can unsave properties');
    }

    // Remove property from user's saved properties
    await User.findByIdAndUpdate(userId, {
      $pull: { savedProperties: propertyId },
    });
  }
}
