import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


@Injectable()
export class CharacterService {
    private s3Client = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
        }
      })
    constructor(
        private databaseService: DatabaseService) {}

    async getAllCharacter(){
        const getAll = await this.databaseService.connection("character").select({ 
            id: "id", 
            name: "name",
            image: "image"
        })

        return {
            message: "Berhasil Mendapatkan Semua Character",
            data: getAll
        }
    }

    async getCharacterById(id: number){
        const getOne = await this.databaseService.connection("character").select("*").where("id", id).first()

        if(!getOne) throw new NotFoundException("Character Tidak Ada")
        return {
            message: "Berhasil Mendapatkan Character",
            data: getOne
        }
    }

    async createCharacter(
        data: {
            name: string,
            base_hp: number,
            base_atk: number,
            base_def: number,
        }, 
        file: Express.Multer.File, 
        folder: string = 'uploads'
    ){
        const fileName = `${folder}/${Date.now()}-${file.originalname}`
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype
        })  

        await this.s3Client.send(command)

        const [createChar] = await this.databaseService.connection("character")
        .insert({
            ...data, 
            image: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
        })
        .returning("*")

        return {
            message: "Berhasil membuat character",
            data: createChar
        }
    }

    async updateCharacter(
        id: number,
        data: {
            name?: string,
            base_hp?: number,
            base_atk?: number,
            base_def?: number,
        },
        file?: Express.Multer.File,
        folder: string = 'uploads'
    ){
        const existingCharacter = await this.getCharacterById(id)
        if(!existingCharacter) throw new NotFoundException("Character Tidak Ada")

        let imageUrl = existingCharacter.data.image;

        if (file) {
            const fileName = `${folder}/${Date.now()}-${file.originalname}`
            
            const uploadCommand = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype
            })  
            await this.s3Client.send(uploadCommand)

            imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

            if (existingCharacter.data.image) {
                try {
                    const oldKey = existingCharacter.data.image.split('.amazonaws.com/')[1];
                    if (oldKey) {
                        const deleteCommand = new DeleteObjectCommand({
                            Bucket: process.env.S3_BUCKET_NAME,
                            Key: oldKey,
                        });
                        await this.s3Client.send(deleteCommand);
                    }
                } catch (err: any) {
                    console.error("Gagal menghapus file lama di S3:", err.message);
                }
            }
        }

        const formattedData: any = { ...data };
        ['base_hp', 'base_atk', 'base_def', 'base_spd', 'max_energy'].forEach(field => {
            if (formattedData[field] !== undefined) {
                formattedData[field] = Number(formattedData[field]);
            }
        });

        const [updatedChar] = await this.databaseService.connection("character")
        .where("id", id)
        .update({
            ...formattedData,
            image: imageUrl
        })
        .returning("*")

        return {
            message: "Berhasil mengupdate character",
            data: updatedChar
        }
    }

    async deleteCharacter(id: number){
        const del = await this.databaseService.connection("character").delete().where("id", id)
    }
}
