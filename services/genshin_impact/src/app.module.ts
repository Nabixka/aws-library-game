import { Module } from '@nestjs/common';
import { CharacterModule } from './character/character.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [CharacterModule, DatabaseModule]
})
export class AppModule {}
