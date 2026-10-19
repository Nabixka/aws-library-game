const { pool } = require("./config")
const express = require("express")
const bcrypt = require("bcrypt")
const serverless = require("serverless-http")
const { startAuthExecution } = require("./stepFunction")

const app = express()
app.use(express.json())

app.post('/register', async (req, res) => {
    try{
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                message: "Isi yang benar wok"
            })
        }

        const getExist = await pool.query(`SELECT id FROM users WHERE username = $1`, [username])
        if(getExist.rows[0]){
            return res.status(409).json({
                message: "Sudah ada user dengan username tersebut"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const insertData = await pool.query(
            `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username`,
            [username, hashPassword]
        )
        const executionArn = await startAuthExecution("register", insertData.rows[0])

        return res.json({
            message: "Berhasil membuat akun",
            executionArn
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Gagal membuat user",
            error: err.message
        })
    }
})

module.exports.handler = serverless(app)