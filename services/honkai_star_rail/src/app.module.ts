import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { CharacterModule } from './character/character.module.js';

@Module({
  imports: [DatabaseModule, CharacterModule]
})
export class AppModule {}
