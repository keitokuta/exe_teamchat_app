import { Types } from 'mongoose';
import Channel from '../models/channel.model';

export class ChannelService {
  async createChannel(name: string, description: string, createdBy: Types.ObjectId) {
    const channel = new Channel({
      name,
      description,
      createdBy,
      members: [createdBy],
      isPrivate: false,
    });
    return await channel.save();
  }

  async searchChannels(query: string, userId: Types.ObjectId) {
    const searchRegex = new RegExp(query, 'i');
    return await Channel.find({
      $and: [
        { $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]},
        { $or: [
          { isPrivate: false },
          { members: userId }
        ]}
      ]
    }).populate('members', 'username avatar');
  }

  async addMember(channelId: Types.ObjectId, userId: Types.ObjectId) {
    return await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: userId }},
      { new: true }
    ).populate('members', 'username avatar');
  }

  async removeMember(channelId: Types.ObjectId, userId: Types.ObjectId) {
    return await Channel.findByIdAndUpdate(
      channelId,
      { $pull: { members: userId }},
      { new: true }
    ).populate('members', 'username avatar');
  }

  async getChannelMembers(channelId: Types.ObjectId) {
    const channel = await Channel.findById(channelId)
      .populate('members', 'username avatar status');
    return channel?.members || [];
  }

  async updateChannel(channelId: Types.ObjectId, updates: Partial<typeof Channel>) {
    return await Channel.findByIdAndUpdate(
      channelId,
      updates,
      { new: true }
    ).populate('members', 'username avatar');
  }
}

export default new ChannelService();