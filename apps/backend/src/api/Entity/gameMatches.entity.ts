import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ResultReason } from "./type/gameMatches";

@Entity({
  name: 'game_matches',
})
export class GameMatches extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    name: 'creat_player_id',
    comment: "对局创建者id"
  })
  creatPlayerId?: number

  @Column({
    name: 'player_black_id',
    comment: "黑子玩家id"
  })
  playerBlackId?: number

  @Column({
    name: 'player_white_id',
    comment: "白子玩家id"
  })
  playerWhiteId?: number

  @Column({
    name: 'creat_time',
    comment: "对局创建时间"
  })
  creatTime?: Date

  @Column({
    name: 'start_time',
    comment: "开局时间"
  })
  startTime?: Date

  @Column({
    name: 'end_time',
    comment: "对局结束时间"
  })
  endTime?: Date

  @Column({
    name: 'winner_id',
    comment: "获胜玩家id"
  })
  winnerId?: number

  @Column({
    type: 'enum',
    name: 'result_reason',
    enum: ResultReason,
    comment: "对局结束原因，五连、认输、平局"
  })
  resultReason?: ResultReason
}
