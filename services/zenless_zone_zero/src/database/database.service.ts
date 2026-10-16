import { Injectable } from '@nestjs/common';
import knex from 'knex';
// @ts-ignore
import * as config from '../../knexfile.mjs'

@Injectable()
export class DatabaseService {
    private db

    constructor(){
        const environtment = process.env.NODE_ENV || 'development'
        const conf = config.default || config

        this.db = knex(conf[environtment])
    }

    get connection(){
        return this.db
    }   
}
