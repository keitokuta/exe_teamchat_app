import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, TextField, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useChannels } from '../../hooks/useChannels';
import ChannelCreateModal from './channel-create-modal';

const ChannelList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { channels, searchChannels, createChannel } = useChannels();

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      searchChannels(searchQuery);
    }, 300);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const handleCreateChannel = async (channelData) => {
    await createChannel(channelData);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Channels
        </Typography>
        <IconButton onClick={() => setIsModalOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search channels"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
      </Box>

      <List>
        {channels.map((channel) => (
          <ListItem
            key={channel.id}
            button
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemText
              primary={channel.name}
              secondary={`${channel.memberCount} members`}
            />
          </ListItem>
        ))}
      </List>

      <ChannelCreateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChannel}
      />
    </Box>
  );
};

export default ChannelList;