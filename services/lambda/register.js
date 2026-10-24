import { pool } from "./config.js"
import express from "express"
import bcrypt from "bcrypt"
import cors from "cors"
import serverless from "serverless-http"
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

const stepFunctionsClient = new SFNClient({})
const snsClient = new SNSClient({})

async function startAuthExecution(user) {
    const stateMachineArn = process.env.STEP_FUNCTION_ARN
    if (!stateMachineArn) {
        throw new Error("STEP_FUNCTION_ARN belum dikonfigurasi")
    }

    const result = await stepFunctionsClient.send(new StartExecutionCommand({
        stateMachineArn,
        input: JSON.stringify({
            action: "register",
            userId: user.id,
            username: user.username
        })
    }))

    if (!result.executionArn) {
        throw new Error("Step Functions tidak mengembalikan execution ARN")
    }

    return result.executionArn
}

async function sendFailureMessage(error) {
    const topicArn = process.env.SNS_TOPIC_ARN
    if (!topicArn) {
        throw new Error("SNS_TOPIC_ARN belum dikonfigurasi")
    }

    await snsClient.send(new PublishCommand({
        TopicArn: topicArn,
        Subject: "Library game register gagal",
        Message: [
            "Library game register endpoint gagal.",
            `Waktu: ${new Date().toISOString()}`,
            `Error: ${error.name || "Error"}: ${error.message || "Unknown error"}`
        ].join("\n")
    }))
}

const app = express()
app.use(cors({
    origin: process.env.FE_DOMAIN || "https://main.di4ydu272hbea.amplifyapp.com"
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
        const executionArn = await startAuthExecution(insertData.rows[0])

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
            await sendFailureMessage(err)
        }
        catch(notificationError) {
            console.error("Gagal mengirim notifikasi SNS untuk register", notificationError)
            response.notificationError = notificationError.message
        }

        return res.status(500).json(response)
    }
})

export const handler = serverless(app)