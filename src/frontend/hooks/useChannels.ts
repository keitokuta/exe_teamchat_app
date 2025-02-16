import { useState, useEffect, useCallback } from 'react';
import { Channel } from '../types/channel';
import { channelService } from '../services/channel.service';

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchChannels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await channelService.getChannels();
      setChannels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch channels');
    } finally {
      setLoading(false);
    }
  }, []);

  const createChannel = async (channelData: Partial<Channel>) => {
    try {
      setLoading(true);
      const response = await channelService.createChannel(channelData);
      setChannels(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create channel');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchChannels = useCallback(async (query: string) => {
    try {
      setSearchQuery(query);
      setLoading(true);
      const response = await channelService.searchChannels(query);
      setChannels(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to search channels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  return {
    channels,
    loading,
    error,
    searchQuery,
    createChannel,
    searchChannels,
    refreshChannels: fetchChannels
  };
};