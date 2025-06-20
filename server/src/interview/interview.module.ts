import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

// Models
import { Interview } from './models/Interview';
import { Question } from './models/Question';
import { User } from './models/Users';
import { MasterQuestion } from './models/Masterquestion';

// Controllers
import { InterviewController } from './interview.controller';
import { QuestionController } from './question.controller';
import { UserController } from './user.controller';

// Services
import { InterviewService } from './interview.service';
import { QuestionService } from './question.service';
import { UserService } from './user.service';
import { MasterQuestionController } from './masterquestion.controller';
import { MasterQuestionService } from './masterquestion.service';

@Module({
  imports: [SequelizeModule.forFeature([Interview, Question, User,MasterQuestion])],
  controllers: [InterviewController, QuestionController, UserController, MasterQuestionController],
  providers: [InterviewService, QuestionService, UserService,MasterQuestionService],
})
export class InterviewModule {}
