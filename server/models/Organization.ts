import mongoose, { Schema, Document } from 'mongoose';
interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  createdBy: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'team';
}
const orgSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    logo: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: { type: String, enum: ['free', 'pro', 'team'], default: 'free' },
  },
  { timestamps: true }
);
const Organization =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>('Organization', orgSchema);
export default Organization;
