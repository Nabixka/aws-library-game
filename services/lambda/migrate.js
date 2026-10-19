const { pool, hsr, gi, zzz } = require("./config")

async function migrateDB(){
    try{
        try {
            await pool.query(`CREATE DATABASE genshin_impact`)
            console.log("Berhasil membuat database genshin_impact")
        } catch (e) { console.log("Info: Database genshin_impact mungkin sudah ada.") }

        try {
            await pool.query(`CREATE DATABASE honkai_star_rail`)
            console.log("Berhasil membuat database honkai_star_rail")
        } catch (e) { console.log("Info: Database honkai_star_rail mungkin sudah ada.") }

        try {
            await pool.query(`CREATE DATABASE zenless_zone_zero`)
            console.log("Berhasil membuat database zenless_zone_zero")
        } catch (e) { console.log("Info: Database zenless_zone_zero mungkin sudah ada.") }

        // =========================================================== //

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR,
            password TEXT
            )
        `)

        console.log("Berhasil membuat table users")

        await hsr.query(`
            CREATE TABLE IF NOT EXISTS character(
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            image TEXT,
            base_hp INTEGER,
            base_atk INTEGER,
            base_def INTEGER,
            base_spd INTEGER,
            max_energy INTEGER
            )
        `)

        console.log("Berhaisl membuat table Character Honkai Star")

        await gi.query(`
            CREATE TABLE IF NOT EXISTS character(
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            image TEXT,
            base_hp INTEGER,
            base_atk INTEGER,
            base_def INTEGER,
            max_energy INTEGER
            )
        `)

        console.log("Berhasil membuat table Character Genshin Impact")

        await zzz.query(`
            CREATE TABLE IF NOT EXISTS character(
            id SERIAL PRIMARY KEY,
            name VARCHAR,
            image TEXT,
            base_hp INTEGER,
            base_atk INTEGER,
            base_def INTEGER
            )
        `)

        console.log("Berhasil membuat table Character Zenless Zone Zero")
    }
    catch(err){
        console.log("message: ", err.message),
        console.log("stack: " , err.stack)
        throw err
    }
}

exports.handler = async (event, context) =>{
    await migrateDB()

    return{
        statusCode: 200,
        message: "Migration Success"
    }
}  