import React, { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { useMessages } from '../hooks/useMessages';
import MessageItem from './message-item';

const MessageList: React.FC<{ channelId: string }> = ({ channelId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();
  const {
    messages,
    loading,
    hasMore,
    loadMoreMessages,
    newMessage,
  } = useMessages(channelId);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreMessages();
    }
  }, [inView, hasMore]);

  useEffect(() => {
    if (newMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [newMessage]);

  return (
    <Box
      sx={{
        height: 'calc(100vh - 200px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: 2,
      }}
    >
      {loading && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      )}
      
      <div ref={ref} />
      
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isOwn={message.userId === currentUser.id}
        />
      ))}
      
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;