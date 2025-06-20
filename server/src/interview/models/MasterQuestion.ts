// models/MasterQuestion.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'master_questions', timestamps: false })
export class MasterQuestion extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  language: string;

  @Column
  question_text: string;
}
