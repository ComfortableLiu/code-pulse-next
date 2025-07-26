import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { GameService } from "../api/Game/game.service";

@WebSocketGateway({
  cors: {
    origin: `${process.env.CLIENT_HOST}:${process.env.CLIENT_PORT}` || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
export class GameGateway {
  @WebSocketServer()
  server!: Server

  constructor(private readonly gameService: GameService) {
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
    this.server.to(client.id).emit('connection', {
      status: 'connected',
      clientId: client.id
    });
    this.gameService.createGame(123).then()
  }

  // @SubscribeMessage('join')
  // async handleJoin(
  //   @MessageBody() data: { roomId: string; userId: string }
  // ) {
  //   const { roomId, userId } = data;
  //   const success = await this.gameService.joinRoom(roomId, userId);
  //
  //   if (success) {
  //     this.server.to(roomId).emit('player_joined', {
  //       userId,
  //       timestamp: Date.now()
  //     });
  //     return { status: 'success' };
  //   }
  //   return { status: 'failed', reason: 'Room full or game started' };
  // }
  //
  // @SubscribeMessage('move')
  // handleMove(
  //   @MessageBody() data: {
  //     roomId: string;
  //     userId: string;
  //     x: number;
  //     y: number
  //   }
  // ) {
  //   const { roomId, userId, x, y } = data;
  //   const validMove = this.gameService.validateMove(roomId, userId, x, y);
  //
  //   if (validMove) {
  //     // 广播给房间内所有玩家（包括当前玩家）
  //     this.server.to(roomId).emit('move_made', {
  //       userId,
  //       position: { x, y },
  //       timestamp: Date.now()
  //     });
  //
  //     const winner = this.gameService.checkWin(roomId, x, y);
  //     if (winner) {
  //       this.server.to(roomId).emit('game_over', {
  //         winnerId: winner.userId,
  //         winPositions: winner.positions
  //       });
  //     }
  //     return { status: 'valid' };
  //   }
  //   return { status: 'invalid', reason: 'Invalid move' };
  // }
}
