import mongoose, { Document, Schema } from 'mongoose';
import { OrgRole } from '@/lib/permission';

interface IOrgMember extends Document {
  userId: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  role: OrgRole;
}

const orgMemberSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'viewer',
    },
  },
  { timestamps: true }
);
const OrgMember =
  mongoose.models.OrgMember ||
  mongoose.model<IOrgMember>('OrgMember', orgMemberSchema);
export default OrgMember;
