import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GameMatches } from "../Entity/gameMatches.entity";

@Injectable()
export class GameService {
  constructor(@InjectRepository(GameMatches) private readonly gameRepository: Repository<GameMatches>) {
  }

  createGame(userId: number): Promise<GameMatches> {
    return this.gameRepository.save({
      creatPlayerId: userId,
      creatTime: new Date(),
    })
  }
}
