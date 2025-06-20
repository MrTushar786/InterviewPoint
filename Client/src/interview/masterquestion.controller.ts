import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MasterQuestion } from './models/MasterQuestion';

@Controller('master-question')
export class MasterQuestionController {
    constructor(
        @InjectModel(MasterQuestion)
        private masterQuestionModel: typeof MasterQuestion,
    ) { }

    @Get()
    async getAllQuestions() {
        return await this.masterQuestionModel.findAll({ order: [['id', 'ASC']] });
    }

    @Post()
    async createQuestion(@Body() body: { language: string; question_text: string }) {
        return await this.masterQuestionModel.create(body);
    }

    @Delete(':id')
    async deleteQuestion(@Param('id') id: number) {
        return await this.masterQuestionModel.destroy({ where: { id } });
    }
    @Get(':language')
    async getByLanguage(@Param('language') language: string) {
        return await this.masterQuestionModel.findAll({
            where: { language },
            order: [['id', 'ASC']],
        });
    }

}
