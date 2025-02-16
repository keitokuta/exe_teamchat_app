import { Server, Socket } from 'socket.io';
import { MessageService } from '../services/message.service';

export class ChatSocket {
  private io: Server;
  private messageService: MessageService;

  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });
    this.messageService = new MessageService();
    this.initialize();
  }

  private initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('join-channel', (channelId: string) => {
        socket.join(channelId);
      });

      socket.on('leave-channel', (channelId: string) => {
        socket.leave(channelId);
      });

      socket.on('send-message', async (data: {
        channelId: string;
        content: string;
        userId: string;
      }) => {
        const message = await this.messageService.createMessage({
          channelId: data.channelId,
          content: data.content,
          userId: data.userId
        });

        this.io.to(data.channelId).emit('new-message', message);
      });

      socket.on('typing-start', (data: { channelId: string; username: string }) => {
        socket.to(data.channelId).emit('user-typing', {
          username: data.username,
          isTyping: true
        });
      });

      socket.on('typing-end', (data: { channelId: string; username: string }) => {
        socket.to(data.channelId).emit('user-typing', {
          username: data.username,
          isTyping: false
        });
      });

      socket.on('disconnect', () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
          socket.to(room).emit('user-offline', socket.id);
        });
      });
    });
  }

  public broadcastToChannel(channelId: string, event: string, data: any): void {
    this.io.to(channelId).emit(event, data);
  }

  public getConnectedClients(channelId: string): string[] {
    const room = this.io.sockets.adapter.rooms.get(channelId);
    return room ? Array.from(room) : [];
  }
}