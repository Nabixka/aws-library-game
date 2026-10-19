const { pool } = require("./config")
const express = require("express")
const bcrypt = require("bcrypt")
const serverless = require("serverless-http")
const { startAuthExecution } = require("./stepFunction")

const app = express()
app.use(express.json())

app.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                message: "Isi yang benar wok"
            })
        }

        const getExist = await pool.query(`SELECT id, username, password FROM users WHERE username = $1`, [username])
        if(!getExist.rows[0] || getExist.rows.length === 0){
            return res.status(404).json({
                message: "Tidak ada user tersebut"
            })
        }

        const hashPassword = await bcrypt.compare(password, getExist.rows[0].password)
        if(!hashPassword){
            return res.status(400).json({
                message: "Password Salah"
            })
        }

        const executionArn = await startAuthExecution("login", getExist.rows[0])

        return res.json({
            message: "Berhasil Login",
            executionArn
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Gagal memproses login",
            error: err.message
        })
    }
})

module.exports.handler = serverless(app)