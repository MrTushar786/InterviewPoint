import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MasterQuestion } from './models/MasterQuestion';

@Injectable()
export class MasterQuestionService {
  constructor(
    @InjectModel(MasterQuestion)
    private masterQuestionModel: typeof MasterQuestion,
  ) {}

  async getRandomQuestionByLanguage(language: string): Promise<MasterQuestion> {
    const questions = await this.masterQuestionModel.findAll({
      where: { language }
    });

    if (!questions.length) throw new Error("No questions available for this language");

    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  async addBulk(questions: { language: string; question_text: string }[]) {
    return this.masterQuestionModel.bulkCreate(questions);
  }
}
