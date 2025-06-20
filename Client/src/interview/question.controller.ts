import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from '../question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  async getAll() {
    return await this.questionService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const q = await this.questionService.findById(id);
    if (!q) throw new NotFoundException(`Question ID ${id} not found`);
    return q;
  }

  @Post()
  async create(@Body() data: CreateQuestionDto) {
    return await this.questionService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<CreateQuestionDto>,
  ) {
    const updated = await this.questionService.update(id, data);
    if (!updated) throw new NotFoundException(`Question ID ${id} not found`);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.questionService.delete(id);
    if (deleted === 0) throw new NotFoundException(`Question ID ${id} not found`);
    return { message: `Deleted question ID ${id}` };
  }

  @Get('/remove/duplicates')
  async removeDuplicates() {
    return await this.questionService.removeDuplicates();
  }

  @Get('by-interview-and-text/:interview_id/:question_text')
  async getByInterviewAndText(
    @Param('interview_id') interview_id: number,
    @Param('question_text') question_text: string,
  ) {
    const q = await this.questionService.findByInterviewAndText(interview_id, question_text);
    if (!q) throw new NotFoundException('Question not found');
    return q;
  }
}
