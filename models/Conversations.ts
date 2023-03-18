import { Schema, model, Document } from 'mongoose';

interface IMessage {
  message: string;
  user: string;
  createdAt: Date;
}

interface IConversation extends Document {
  users: string[];
  messages: IMessage[];
}

const MessageSchema = new Schema({
  message: String,
  user: String,
  createdAt: { type: Date, default: Date.now }
});

const ConversationSchema = new Schema({
  users: [String],
  messages: [MessageSchema]
});

export default model<IConversation>('Conversation', ConversationSchema);