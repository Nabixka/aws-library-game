const { pool } = require("./config")
const express = require("express")
const bcrypt = require("bcrypt")
const serverless = require("serverless-http")

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

        const getExist = await pool.query(`SELECT * FROM user WHERE username = $1`, [username])
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

        return res.json({
            message: "Berhasil Login"
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