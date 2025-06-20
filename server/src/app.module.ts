import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { InterviewModule } from './interview/interview.module';
import { Interview } from './interview/models/Interview';
import { Question } from './interview/models/Question';
import { User } from './interview/models/Users';

@Module({
  imports: [
    InterviewModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'postgres',
      models: [Interview, Question, User],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
