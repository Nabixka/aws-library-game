const { pool } = require("./config")
const express = require("express")
const bcrypt = require("bcrypt")
const serverless = require("serverless-http")

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

        const getExist = await pool.query(`SELECT id FROM user WHERE username = $1`, [username])
        if(getExist.rows[0]){
            return res.status(409).json({
                message: "Sudah ada user dengan username tersebut"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const insertData = await pool.query(`INSERT INTO user (username, password) VALUES ($1, $2)`, [username, hashPassword])

        return res.json({
            message: "Berhasil membuat akun"
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