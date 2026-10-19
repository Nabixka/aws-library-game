import { pool } from "./config.js"
import express from "express"
import bcrypt from "bcrypt"
import cors from "cors"
import serverless from "serverless-http"
import { startAuthExecution } from "./stepFunction.js"
import { sendFailureMessage } from "./message.js"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN || "https://main.di4ydu272hbea.amplifyapp.com"
}))
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
        const response = {
            message: "Gagal membuat user",
            error: err.message
        }

        try {
            await sendFailureMessage("register", err)
        }
        catch(notificationError) {
            console.error("Gagal mengirim notifikasi SNS untuk register", notificationError)
            response.notificationError = notificationError.message
        }

        return res.status(500).json(response)
    }
})

export const handler = serverless(app)