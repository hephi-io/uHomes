import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { PropertyService } from '../service/property.service';
import { ResponseHelper } from '../utils/response';

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  async createProperty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const agentId = req.user.id;
      const files = req.files as Express.Multer.File[] | undefined;
      const property = await this.propertyService.createProperty(agentId, req.body, files);
      return ResponseHelper.created(res, { message: 'Property created successfully', property });
    } catch (err) {
      next(err);
    }
  }

  async updateProperty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const { id } = req.params;
      const files = req.files as Express.Multer.File[] | undefined;
      const updated = await this.propertyService.updateProperty(id, req.body, files);
      return ResponseHelper.success(res, {
        message: 'Property updated successfully',
        property: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllProperties(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract query parameters
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string | undefined;
      const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
      const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
      const location = req.query.location as string | undefined;
      const agentId = req.query.agentId as string | undefined;
      const sortBy = (req.query.sortBy as string) || 'createdAt';

      // Handle amenities - can be comma-separated string or array
      let amenities: string[] | undefined;
      if (req.query.amenities) {
        if (Array.isArray(req.query.amenities)) {
          amenities = req.query.amenities as string[];
        } else {
          amenities = (req.query.amenities as string).split(',').filter((a) => a.trim());
        }
      }

      const result = await this.propertyService.getAllProperties({
        page,
        limit,
        search,
        minPrice,
        maxPrice,
        location,
        amenities,
        agentId,
        sortBy,
      });

      return ResponseHelper.success(res, {
        message: 'Properties fetched successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPropertyById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return ResponseHelper.error(res, 'Invalid property ID', 404);
      }

      const property = await this.propertyService.getPropertyById(id);
      if (!property) {
        return ResponseHelper.error(res, 'Property not found', 404);
      }

      return ResponseHelper.success(res, { message: 'Property fetched successfully', property });
    } catch (err) {
      next(err);
    }
  }

  async getPropertiesByAgent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const agentId = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.propertyService.getPropertiesByAgent(agentId, page, limit);

      return ResponseHelper.success(res, {
        message: 'Agent properties fetched successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProperty(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.propertyService.deleteProperty(id);

      return ResponseHelper.success(res, { messge: 'Property deleted successfully' });
    } catch (error) {
      return next(error);
    }
  }

  async deleteSingleImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { cloudinaryId } = req.body;

      await this.propertyService.deleteSingleImage(id, cloudinaryId);

      return ResponseHelper.success(res, { message: 'Image deleted successfully' });
    } catch (error) {
      return next(error);
    }
  }

  async getSavedProperties(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const userId = req.user.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.propertyService.getSavedProperties(userId, page, limit);

      return ResponseHelper.success(res, {
        message: 'Saved properties fetched successfully',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async saveProperty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const userId = req.user.id;
      const { id } = req.params;

      await this.propertyService.saveProperty(userId, id);

      return ResponseHelper.success(res, { message: 'Property saved successfully' });
    } catch (err) {
      next(err);
    }
  }

  async unsaveProperty(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) return ResponseHelper.unauthorized(res, 'Unauthorized');

      const userId = req.user.id;
      const { id } = req.params;

      await this.propertyService.unsaveProperty(userId, id);

      return ResponseHelper.success(res, { message: 'Property unsaved successfully' });
    } catch (err) {
      next(err);
    }
  }
}

export default new PropertyController();
