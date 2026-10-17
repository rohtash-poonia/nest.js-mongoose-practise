import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';

interface ChatMessage {
  roomId: string;
  message: string;
  senderId: string;
  sentAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(EventsGateway.name);

  // NestJS ke Socket.IO server instance ko yahan provide karta hai.
  @WebSocketServer()
  server!: Server;

  // Naya client connect hone par uski socket ID log karte hain.
  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // Disconnect ke baad Socket.IO client ko uske rooms se khud hata deta hai.
  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Client ko chat room join karne ke liye 'join-room' event bhejna hoga.
  @SubscribeMessage('join-room')
  async handleJoinRoom(client: Socket, payload: unknown): Promise<void> {
    const roomId = this.getRoomId(payload);

    await client.join(roomId);
    client.emit('room-joined', { roomId });
  }

  // Room ke members 'send-message' event se message bhej sakte hain.
  @SubscribeMessage('send-message')
  handleSendMessage(client: Socket, payload: unknown): void {
    const roomId = this.getRoomId(payload);

    if (!isRecord(payload) || typeof payload.message !== 'string') {
      throw new WsException('message field string hona chahiye.');
    }

    const messageText = payload.message.trim();
    if (messageText.length === 0 || messageText.length > 2000) {
      throw new WsException('message 1 se 2000 characters ke beech hona chahiye.');
    }

    // Client ko pehle us room ka member hona zaroori hai.
    if (!client.rooms.has(roomId)) {
      throw new WsException('Message bhejne se pehle room join karein.');
    }

    const chatMessage: ChatMessage = {
      roomId,
      message: messageText,
      senderId: client.id,
      sentAt: new Date().toISOString(),
    };

    // Room ke sabhi connected clients ko message broadcast karte hain.
    this.server.to(roomId).emit('new-message', chatMessage);
  }

  private getRoomId(payload: unknown): string {
    if (!isRecord(payload) || typeof payload.roomId !== 'string') {
      throw new WsException('roomId string ke roop mein dena zaroori hai.');
    }

    const roomId = payload.roomId.trim();
    if (roomId.length === 0 || roomId.length > 100) {
      throw new WsException('roomId 1 se 100 characters ke beech hona chahiye.');
    }

    return roomId;
  }
}
