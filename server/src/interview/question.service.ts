import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './models/question';
import { CreateQuestionDto } from '../question.dto';
import { Op } from 'sequelize';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private readonly questionModel: typeof Question,
  ) {}

  async create(data: CreateQuestionDto) {
    const existing = await this.questionModel.findOne({
      where: {
        interview_id: data.interview_id,
        question_text: data.question_text,
      },
    });

    if (existing) {
      return { message: 'Duplicate question already exists', id: existing.id };
    }

    return await this.questionModel.create(data);
  }

  async findAll() {
    return this.questionModel.findAll();
  }

  async findById(id: number) {
    return this.questionModel.findByPk(id);
  }

  async update(id: number, data: Partial<Question>) {
    const [count] = await this.questionModel.update(data, { where: { id } });
    return count > 0 ? this.findById(id) : null;
  }

  async delete(id: number) {
    return this.questionModel.destroy({ where: { id } });
  }

  async removeDuplicates() {
    const all = await this.questionModel.findAll({ order: [['created_at', 'ASC']] });
    const seen = new Set<string>();
    const duplicateIds: number[] = [];

    for (const q of all) {
      const key = `${q.interview_id}-${q.question_text}`;
      if (seen.has(key)) {
        duplicateIds.push(q.id);
      } else {
        seen.add(key);
      }
    }

    await this.questionModel.destroy({ where: { id: { [Op.in]: duplicateIds } } });

    return {
      message: 'Duplicate questions removed',
      count: duplicateIds.length,
      removed_ids: duplicateIds,
    };
  }

  async findByInterviewAndText(interview_id: number, question_text: string) {
    return this.questionModel.findOne({ where: { interview_id, question_text } });
  }
}
