import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username?: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 255 })
  password?: string;

  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt?: Date;
}
