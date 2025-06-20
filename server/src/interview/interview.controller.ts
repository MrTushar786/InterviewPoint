import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { Interview } from './models/Interview';

@Controller('interview')
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Get()
  async getAll(): Promise<Interview[]> {
    return this.interviewService.getInterviewList();
  }

  @Post()
  async create(@Body() data: Partial<Interview>): Promise<Interview> {
    return this.interviewService.createInterview(data);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Interview>): Promise<[number]> {
    console.log(data)
    return this.interviewService.updateInterview(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<number> {
    return this.interviewService.deleteInterview(id);
  }
}
