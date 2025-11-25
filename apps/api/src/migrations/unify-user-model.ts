import mongoose from 'mongoose';

import User from '../models/user.model';
import UserType from '../models/user-type.model';
import Agent from '../models/agent.model';
import Student from '../models/student.model';
import Booking from '../models/booking.model';
import Property from '../models/property.model';
import Token from '../models/token.model';

interface MigrationStats {
  agentsMigrated: number;
  studentsMigrated: number;
  userTypesCreated: number;
  bookingsUpdated: number;
  propertiesUpdated: number;
  tokensUpdated: number;
  errors: string[];
}

/**
 * Main migration function to unify Agent and Student models into User model
 */
export async function migrateToUnifiedUserModel(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    agentsMigrated: 0,
    studentsMigrated: 0,
    userTypesCreated: 0,
    bookingsUpdated: 0,
    propertiesUpdated: 0,
    tokensUpdated: 0,
    errors: [],
  };

  try {
    console.log('Starting migration to unified User model...');

    // Step 1: Migrate all Agent documents to User
    console.log('Migrating Agent documents...');
    const agents = await Agent.find();
    for (const agent of agents) {
      try {
        // Check if user already exists (in case of re-run)
        let user = await User.findOne({ email: agent.email });

        if (!user) {
          // Create User document
          user = new User({
            fullName: agent.fullName,
            email: agent.email,
            phoneNumber: agent.phoneNumber,
            password: agent.password,
            isVerified: agent.isVerified,
            properties: agent.properties || [],
            totalRevenue: agent.totalRevenue || 0,
          });
          await user.save();
          stats.agentsMigrated++;
        }

        // Create or update UserType
        let userType = await UserType.findOne({ userId: user._id });
        if (!userType) {
          userType = new UserType({
            userId: user._id,
            type: 'agent',
          });
          await userType.save();
          stats.userTypesCreated++;
        }

        // Update Property.agentId references
        await Property.updateMany({ agentId: agent._id }, { $set: { 'agentId.$': user._id } });
        const propertiesCount = await Property.countDocuments({ agentId: agent._id });
        if (propertiesCount > 0) {
          // Update array references
          await Property.updateMany(
            { agentId: { $in: [agent._id] } },
            { $set: { agentId: [user._id] } }
          );
        }
        stats.propertiesUpdated += await Property.countDocuments({ agentId: user._id });

        // Update Booking.agent references
        const bookingsUpdated = await Booking.updateMany(
          { agent: agent._id },
          { $set: { agent: user._id } }
        );
        stats.bookingsUpdated += bookingsUpdated.modifiedCount;

        // Update Token.userId references
        const tokensUpdated = await Token.updateMany(
          { userId: agent._id },
          { $set: { userId: user._id } }
        );
        stats.tokensUpdated += tokensUpdated.modifiedCount;
      } catch (error: any) {
        stats.errors.push(`Error migrating agent ${agent._id}: ${error.message}`);
        console.error(`Error migrating agent ${agent._id}:`, error);
      }
    }

    // Step 2: Migrate all Student documents to User
    console.log('Migrating Student documents...');
    const students = await Student.find();
    for (const student of students) {
      try {
        // Check if user already exists (in case of re-run)
        let user = await User.findOne({ email: student.email });

        if (!user) {
          // Create User document
          user = new User({
            fullName: student.fullName,
            email: student.email,
            phoneNumber: student.phoneNumber,
            password: student.password,
            isVerified: student.isVerified,
            university: student.university,
            yearOfStudy: student.yearOfStudy,
          });
          await user.save();
          stats.studentsMigrated++;
        }

        // Create or update UserType
        let userType = await UserType.findOne({ userId: user._id });
        if (!userType) {
          userType = new UserType({
            userId: user._id,
            type: 'student',
          });
          await userType.save();
          stats.userTypesCreated++;
        }

        // Update Booking.tenant references
        const bookingsUpdated = await Booking.updateMany(
          { tenant: student._id },
          { $set: { tenant: user._id } }
        );
        stats.bookingsUpdated += bookingsUpdated.modifiedCount;

        // Update Token.userId references
        const tokensUpdated = await Token.updateMany(
          { userId: student._id },
          { $set: { userId: user._id } }
        );
        stats.tokensUpdated += tokensUpdated.modifiedCount;
      } catch (error: any) {
        stats.errors.push(`Error migrating student ${student._id}: ${error.message}`);
        console.error(`Error migrating student ${student._id}:`, error);
      }
    }

    // Step 3: Verify data integrity
    console.log('Verifying data integrity...');
    const totalUsers = await User.countDocuments();
    const totalUserTypes = await UserType.countDocuments();

    console.log(`Migration Summary:
      - Users created: ${totalUsers}
      - UserTypes created: ${totalUserTypes}
      - Agents migrated: ${stats.agentsMigrated}
      - Students migrated: ${stats.studentsMigrated}
      - Bookings updated: ${stats.bookingsUpdated}
      - Properties updated: ${stats.propertiesUpdated}
      - Tokens updated: ${stats.tokensUpdated}
      - Errors: ${stats.errors.length}
    `);

    if (stats.errors.length > 0) {
      console.error('Migration completed with errors:');
      stats.errors.forEach((error) => console.error(`  - ${error}`));
    } else {
      console.log('Migration completed successfully!');
    }

    return stats;
  } catch (error: any) {
    console.error('Migration failed:', error);
    stats.errors.push(`Migration failed: ${error.message}`);
    throw error;
  }
}

/**
 * Rollback function to restore Agent and Student collections
 * Note: This requires a database backup to fully restore
 */
export async function rollbackMigration(): Promise<void> {
  console.log('Rollback not implemented. Please restore from database backup.');
  console.log('To rollback, you would need to:');
  console.log('1. Restore Agent and Student collections from backup');
  console.log('2. Update all references back to Agent/Student');
  console.log('3. Delete User and UserType collections');
  throw new Error('Rollback requires database backup restoration');
}

/**
 * Verify migration integrity
 */
export async function verifyMigrationIntegrity(): Promise<{
  isValid: boolean;
  issues: string[];
}> {
  const issues: string[] = [];

  // Check that all users have user types
  const usersWithoutTypes = await User.aggregate([
    {
      $lookup: {
        from: 'usertypes',
        localField: '_id',
        foreignField: 'userId',
        as: 'userType',
      },
    },
    {
      $match: {
        userType: { $size: 0 },
      },
    },
  ]);

  if (usersWithoutTypes.length > 0) {
    issues.push(`${usersWithoutTypes.length} users without user types`);
  }

  // Check that all bookings reference valid users
  const bookingsWithInvalidUsers = await Booking.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'agent',
        foreignField: '_id',
        as: 'agentUser',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'tenant',
        foreignField: '_id',
        as: 'tenantUser',
      },
    },
    {
      $match: {
        $or: [{ agentUser: { $size: 0 } }, { tenantUser: { $size: 0 } }],
      },
    },
  ]);

  if (bookingsWithInvalidUsers.length > 0) {
    issues.push(`${bookingsWithInvalidUsers.length} bookings with invalid user references`);
  }

  // Check that all properties reference valid users
  const propertiesWithInvalidUsers = await Property.aggregate([
    {
      $unwind: '$agentId',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'agentId',
        foreignField: '_id',
        as: 'agentUser',
      },
    },
    {
      $match: {
        agentUser: { $size: 0 },
      },
    },
  ]);

  if (propertiesWithInvalidUsers.length > 0) {
    issues.push(`${propertiesWithInvalidUsers.length} properties with invalid user references`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

// If running directly (not imported)
if (require.main === module) {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uhomes')
    .then(async () => {
      console.log('Connected to MongoDB');
      try {
        const stats = await migrateToUnifiedUserModel();
        console.log('Migration stats:', stats);
        const verification = await verifyMigrationIntegrity();
        console.log('Verification result:', verification);
        process.exit(verification.isValid ? 0 : 1);
      } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      process.exit(1);
    });
}
