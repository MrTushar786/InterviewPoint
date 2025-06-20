// src/interview/models/question.model.ts

import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  DataType,
} from 'sequelize-typescript';
import { Interview } from './interview';

@Table({ tableName: 'question', timestamps: true })
export class Question extends Model<Question> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Interview)
  @Column
  interview_id: number;

  @BelongsTo(() => Interview)
  interview: Interview;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  question_text: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  answer_text: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 50,
    },
  })
  score: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  created_at: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updated_at: Date;
}
