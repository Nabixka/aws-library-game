const { pool } = require("./config")

async function migrateDB(){
    try{
        await pool.query(`
            CREATE DATABASE genshin_impact
        `)

        await pool.query(`
            CREATE DATABASE honkai_star_rail
        `)

        await pool.query(`
            CREATE DATABASE zenless_zone_zerro`)
    }
    catch(err){
        console.log("message: ", err.message),
        console.log("stack: " , err.stack)
    }
    finally{
        process.exit(0)
    }
}

migrateDB()