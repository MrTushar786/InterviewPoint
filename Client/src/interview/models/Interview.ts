import {Table,Column,Model,PrimaryKey,AutoIncrement,CreatedAt,UpdatedAt,ForeignKey,BelongsTo,} from 'sequelize-typescript';
import { User } from './Users';

@Table({ tableName: 'interview', timestamps: true })
export class Interview extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  company_name: string;

  @Column
  duration: string;

  @Column({ field: 'programming_language' })
  p_language: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}
