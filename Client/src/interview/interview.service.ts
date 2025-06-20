import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Interview } from './models/Interview';
import { User } from './models/Users'; // 👈 Import the User model

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(Interview)
    private interviewModel: typeof Interview,

    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async getInterviewList(): Promise<Interview[]> {
    return this.interviewModel.findAll({ include: { all: true } });
  }

  async createInterview(data: Partial<Interview>): Promise<Interview> {
    if (!data.user_id) {
      throw new NotFoundException('Missing user_id');
    }

    const user = await this.userModel.findByPk(data.user_id);
    if (!user) {
      throw new NotFoundException(`User with id ${data.user_id} does not exist`);
    }

    return await this.interviewModel.create(data);
  }

  async updateInterview(id: number, data: Partial<Interview>): Promise<[number]> {
    return await this.interviewModel.update(data, { where: { id } });
  }

  async deleteInterview(id: number): Promise<number> {
    return await this.interviewModel.destroy({ where: { id } });
  }
}
