import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CharacterService } from './character.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  getAllCharacter(){
    return this.characterService.getAllCharacter()
  }

  @Get('/:id')
  getCharacterById(
    @Param('id', ParseIntPipe) id: number
  ){
    return this.characterService.getCharacterById(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createChar(
    @Body() data: {
      name: string,
      base_hp: number,
      base_atk: number,
      base_def: number,
    }, 
    @UploadedFile() file: Express.Multer.File
  ){
    if(!file) throw new BadRequestException("Gambar nya mana")
    return this.characterService.createCharacter(data, file, 'honkai-star-rail')
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('file'))
  updateCharacter(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: {
      name?: string,
      base_hp?: number,
      base_atk?: number,
      base_def?: number,
    },
    @UploadedFile() file?: Express.Multer.File
  ){
    return this.characterService.updateCharacter(id, data, file, 'honkai-star-rail')
  }

  @HttpCode(204)
  @Delete('/:id')
  deleteCharacter(
    @Param('id', ParseIntPipe) id: number
  ){
    this.characterService.deleteCharacter(id)
  }

}
