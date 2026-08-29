import mongoose, { Schema, Document } from 'mongoose';
import type { JSONContent } from '@tiptap/core';

export interface IContributor {
  userId: mongoose.Types.ObjectId;
  joinedAt: Date;
}

export interface IDocument extends Document {
  title: string;
  content: JSONContent;
  createdAt: Date;
  orgId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  updatedAt: Date;
  contributors: IContributor[];
}

const contributorSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
  }
);

const docSchema = new Schema(
  {
    title: { type: String, required: true },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    contributors: { type: [contributorSchema], default: [] },
  },
  { timestamps: true }
);

const Doc = mongoose.models.Doc || mongoose.model<IDocument>('Doc', docSchema);
export default Doc;
