import pg from "pg"
import dotenv from "dotenv"

const { Pool } = pg
dotenv.config()

const pool = new Pool({
    database: process.env.DB_NAME || 'postgres',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    ssl: {
        rejectUnauthorized: false
    }
})

const hsr = new Pool({
    database: 'honkai_star_rail',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    ssl: {
        rejectUnauthorized: false
    }
})

const gi = new Pool({
    database: 'genshin_impact',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    ssl: {
        rejectUnauthorized: false
    }
})

const zzz = new Pool({
    database: 'zenless_zone_zero',
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    ssl: {
        rejectUnauthorized: false
    }
})

export { pool, hsr, gi, zzz }