import { Module } from '@nestjs/common';
import { CharacterService } from './character.service.js';
import { CharacterController } from './character.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
