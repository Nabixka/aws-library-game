const { pool } = require("./config")

async function drop(){
    try{
        await pool.query(`
            DROP DATABASE honkai_star_rail WITH (FORCE)
        `)

        await pool.query(`
            DROP DATABASE genshin_impact WITH (FORCE)
        `)

        await pool.query(`
            DROP DATABASE zenless_zone_zero WITH (FORCE)
        `)
    }
    catch(err){

    }
    finally{
        process.exit(0)
    }
}

drop()