import User from '../models/user.model';
import UserType from '../models/user-type.model';
import Property from '../models/property.model';
import { Payment } from '../models/payment.model';
import { Transaction } from '../models/transaction.model';
import { NotFoundError } from '../middlewares/error.middlewere';

export class AdminService {
  // Verify or Reject an Agent's NIN

  async verifyAgent(userId: string, status: 'verified' | 'rejected') {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Optional: Check if user is actually an agent
    // if (user.type !== 'agent') throw new BadRequestError('User is not an agent');

    user.ninVerificationStatus = status;
    await user.save();

    return {
      id: user._id,
      email: user.email,
      status: user.ninVerificationStatus,
    };
  }

  //Get all users (excluding passwords)

  async getAllUsers() {
    // Return all users sorted by newest first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
  }

  // Dashboard Statistics
  async getDashboardStats() {
    // Total revenue from all completed payments
    const revenueResult = await Payment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Total agents
    const totalAgents = await UserType.countDocuments({ type: 'agent' });

    // Total clients/students
    const totalClients = await UserType.countDocuments({ type: 'student' });

    // Active listings
    const activeListings = await Property.countDocuments({ isAvailable: true });

    return {
      totalRevenue,
      totalAgents,
      totalClients,
      activeListings,
    };
  }

  // Payment Statistics for Escrow
  async getPaymentStats() {
    // Total revenue
    const totalRevenueResult = await Payment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Platform fees (5% of completed payments)
    const platformFees = totalRevenue * 0.05;

    // In escrow (pending payments)
    const inEscrowResult = await Payment.aggregate([
      {
        $match: { status: 'pending' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const inEscrow = inEscrowResult.length > 0 ? inEscrowResult[0].total : 0;

    // Released payments (completed)
    const releasedPayments = totalRevenue;

    // Declined payments (failed + refunded)
    const declinedResult = await Payment.aggregate([
      {
        $match: { status: { $in: ['failed', 'refunded'] } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);
    const declined = declinedResult.length > 0 ? declinedResult[0].total : 0;

    return {
      totalRevenue,
      platformFees,
      inEscrow,
      releasedPayments,
      declined,
    };
  }

  // Get all transactions (admin view - no userId filter)
  async getAllTransactionsAdmin(filters: Record<string, unknown> = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) query.status = filters.status;
    if (filters.fromDate && filters.toDate) {
      query.createdAt = {
        $gte: new Date(filters.fromDate as string),
        $lte: new Date(filters.toDate as string),
      };
    }
    if (filters.minAmount || filters.maxAmount) {
      const amountFilter: Record<string, unknown> = {};
      if (filters.minAmount) amountFilter.$gte = Number(filters.minAmount);
      if (filters.maxAmount) amountFilter.$lte = Number(filters.maxAmount);
      query.amount = amountFilter;
    }
    if (filters.search) {
      query.$or = [
        { reference: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate('userId', 'fullName email phoneNumber')
        .populate('paymentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(query),
    ]);

    return {
      transactions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get all payments (admin view - no userId filter)
  async getAllPaymentsAdmin(filters: Record<string, unknown> = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      const dateFilter: Record<string, unknown> = {};
      if (filters.startDate) dateFilter.$gte = new Date(filters.startDate as string);
      if (filters.endDate) dateFilter.$lte = new Date(filters.endDate as string);
      query.createdAt = dateFilter;
    }
    if (filters.minAmount || filters.maxAmount) {
      const amountFilter: Record<string, unknown> = {};
      if (filters.minAmount) amountFilter.$gte = Number(filters.minAmount);
      if (filters.maxAmount) amountFilter.$lte = Number(filters.maxAmount);
      query.amount = amountFilter;
    }
    if (filters.search) {
      query.$or = [
        { reference: { $regex: filters.search, $options: 'i' } },
        { user_email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('userId', 'fullName email phoneNumber')
        .populate('bookingId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Payment.countDocuments(query),
    ]);

    return {
      payments,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get all properties (admin view - no isAvailable filter)
  async getAllPropertiesAdmin(filters: Record<string, unknown> = {}) {
    const query: Record<string, unknown> = {};

    // Remove isAvailable filter for admin - show all properties
    if (filters.status) {
      // If status filter exists, map it appropriately
      if (filters.status === 'approved' || filters.status === 'active') {
        query.isAvailable = true;
      } else if (filters.status === 'rejected' || filters.status === 'inactive') {
        query.isAvailable = false;
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { location: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Record<string, unknown> = {};
      if (filters.minPrice !== undefined) priceFilter.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) priceFilter.$lte = Number(filters.maxPrice);
      query.price = priceFilter;
    }

    if (filters.location) {
      query.location = { $regex: filters.location as string, $options: 'i' };
    }

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('agentId', 'fullName email phoneNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(query),
    ]);

    return {
      properties,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Get agent applications with NIN verification status
  async getAgentApplications(filters: Record<string, unknown> = {}) {
    const query: Record<string, unknown> = { type: 'agent' };

    // Get all agent user types
    const agentUserTypes = await UserType.find(query);
    const agentUserIds = agentUserTypes.map((ut) => ut.userId);

    // Build user query
    const userQuery: Record<string, unknown> = { _id: { $in: agentUserIds } };

    if (filters.status) {
      if (filters.status === 'pending') {
        userQuery.ninVerificationStatus = { $in: ['pending', null, undefined] };
      } else {
        userQuery.ninVerificationStatus = filters.status;
      }
    }

    if (filters.search) {
      userQuery.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(userQuery).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(userQuery),
    ]);

    // Map users to include document status
    const applications = users.map((user) => ({
      id: user._id,
      name: user.fullName,
      email: user.email,
      phone: user.phoneNumber,
      document: !!user.ninDocumentUrl,
      documentName: user.ninDocumentUrl ? 'NIN_Document' : null,
      status: user.ninVerificationStatus || 'pending',
      date: user.createdAt,
    }));

    return {
      applications,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Enhanced user list with search and filters
  async getAllUsersAdmin(filters: Record<string, unknown> = {}) {
    const query: Record<string, unknown> = {};

    if (filters.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { phoneNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.type) {
      // Get user IDs by type
      const userTypes = await UserType.find({ type: filters.type });
      const userIds = userTypes.map((ut) => ut.userId);
      query._id = { $in: userIds };
    }

    if (filters.status) {
      if (filters.status === 'active') {
        query.isVerified = true;
      } else if (filters.status === 'inactive') {
        query.isVerified = false;
      }
    }

    const limit = parseInt(String(filters.limit || '10'));
    const page = parseInt(String(filters.page || '1'));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .populate({
          path: '_id',
          model: 'UserType',
          select: 'type',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    // Enrich users with their type
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const userType = await UserType.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          userType: userType?.type || null,
        };
      })
    );

    return {
      users: enrichedUsers,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    };
  }

  // Update property status (approve/reject)
  async updatePropertyStatus(propertyId: string, status: 'approved' | 'rejected') {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property not found');
    }

    // Map status to isAvailable
    if (status === 'approved') {
      property.isAvailable = true;
    } else if (status === 'rejected') {
      property.isAvailable = false;
    }

    await property.save();
    return property;
  }
}
