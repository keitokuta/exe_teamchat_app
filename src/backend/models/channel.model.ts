import { Schema, model, Document } from 'mongoose';

interface IMessage {
  content: string;
  sender: Schema.Types.ObjectId;
  timestamp: Date;
  attachments?: string[];
}

interface IChannel extends Document {
  name: string;
  description: string;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  isPrivate: boolean;
  members: Schema.Types.ObjectId[];
  messages: IMessage[];
  lastActivity: Date;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  attachments: [{ type: String }]
});

const channelSchema = new Schema<IChannel>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 500
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [messageSchema],
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

channelSchema.index({ name: 'text', description: 'text' });
channelSchema.index({ lastActivity: -1 });

export const Channel = model<IChannel>('Channel', channelSchema);