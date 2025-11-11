import cloudinary from '../config/cloudinary'
import Property, { IProperty } from "../models/property.model"
import mongoose from 'mongoose'
import Agent from "../models/agent.model"
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middlewares/error.middlewere"

interface CloudinaryImage {
  url: string
  cloudinary_id: string
}

export class PropertyService {
  async createProperty(agentId: string, data: Partial<IProperty>, files?: Express.Multer.File[]): Promise<IProperty> {
    if (!agentId) throw new UnauthorizedError("Unauthorized agent")

    if (!files || files.length === 0) throw new BadRequestError("At least one image is required")


    const uploadedImages: CloudinaryImage[] = []

  
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path,{ resource_type: "image"})
        uploadedImages.push({
          url: result.secure_url,
          cloudinary_id: result.public_id
        })
      }
    

    const newProperty = await Property.create({
      ...data,
      images: uploadedImages,
      agentId
    })

    await Agent.findByIdAndUpdate(agentId, {
      $push: { properties: newProperty._id }
    })

    return newProperty
  }

  async getAllProperties(): Promise<IProperty[]> {
    const properties = await Property.find().populate("agentId", "-password")
    if (!properties.length) throw new NotFoundError("No properties found")
    return properties
  }

  async getPropertyById(id: string): Promise<IProperty> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new NotFoundError("Invalid property ID")
    const property = await Property.findById(id).populate("agentId", "-password")
    if (!property) throw new NotFoundError("Property not found")
    return property
  }

  async getPropertiesByAgent(agentId: string, page = 1, limit = 10): Promise<{ properties: IProperty[], total: number, page: number, limit: number }> {
  if (!mongoose.Types.ObjectId.isValid(agentId)) throw new NotFoundError("Invalid agent ID")

  const skip = (page - 1) * limit
  const total = await Property.countDocuments({ agentId })

  if (total === 0) throw new NotFoundError("No properties found for this agent")

  const properties = await Property.find({ agentId })
    .skip(skip)
    .limit(limit)
    .populate("agentId", "-password")

  return { properties, total, page, limit }
}

  async updateProperty(
    id: string,
    data: Partial<IProperty> & { replaceImages?: boolean },
    files?: Express.Multer.File[]
  ): Promise<IProperty> {
    const property = await Property.findById(id)
    if (!property) throw new NotFoundError("Property not found")

    if (files && files.length > 0) {
      const uploadedImages: CloudinaryImage[] = []

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path)
        uploadedImages.push({
          url: result.secure_url,
          cloudinary_id: result.public_id
        })
      }

      if (data.replaceImages) {
        property.images = uploadedImages
      } else {
        property.images.push(...uploadedImages)
      }
    }

    Object.assign(property, data)
    await property.save()
    return property
  }

  async deleteProperty(id: string): Promise<void> {
    const property = await Property.findById(id)
    if (!property) throw new NotFoundError("Property not found")

    for (const img of property.images) {
      await cloudinary.uploader.destroy(img.cloudinary_id)
    }

    await Property.findByIdAndDelete(id)
  }

  async deleteSingleImage(propertyId: string, cloudinaryId: string): Promise<IProperty> {
    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) throw new NotFoundError("Property not found");

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(cloudinaryId);

    // Remove the image from property.images array
    property.images = property.images.filter(img => img.cloudinary_id !== cloudinaryId);

    // Save the property
    await property.save();

    return property;
  }
}
