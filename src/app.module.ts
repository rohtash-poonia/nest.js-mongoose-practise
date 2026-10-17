import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module.js';
import { EventsGateway } from './events/events.gateway.js';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://poonia22704_db_user:admin@firstproject.urna8iv.mongodb.net/?appName=FirstProject',
    ),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
