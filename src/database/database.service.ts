import {Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {Pool} from 'pg';

@Injectable()
export  class DatabaseService implements OnModuleInit{
    private pool: Pool;

    constructor(){
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT as string),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    }

    async onModuleInit(){
            await this.createTables();
    }

    private async createTables(){
        const createUserTable = `CREATE TABLE IF NOT EXITS users(
            id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            fname   VARCHAR(255) NOT NULL,
            lname   VARCHAR(255) NOT NULL,
            email   VARCHAR(255) VARCHAR(255) UNIQUE,
            mobile_number   VARCHAR(20) UNIQUE,
            password    VARCHAR(255) NOT NULL,
            role    VARCHAR(50) DEFAULT 'player',
            is_email_verified   BOOLEAN DEFAULT FALSE,
            is_mobile_verified  BOOLEAN DEFAULT FALSE,
            email_verification_otp  VARCHAR(10),
            mobile_verification_otp VARCHAR(10),
            otp_expires_at  TIMESTAMP,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`;

            await this.pool.query(createUserTable);
    }

    getPool(): Pool {
        return this.pool;
    }

    async query(text:string, params?: any[]){
        return await this.pool.query(text, params);
    }
    
}
