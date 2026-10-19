import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

const client = new SNSClient({})

async function sendFailureMessage(action, error) {
    const topicArn = process.env.SNS_TOPIC_ARN
    if (!topicArn) {
        throw new Error("SNS_TOPIC_ARN belum dikonfigurasi")
    }

    const message = [
        `Library game ${action} endpoint gagal.`,
        `Waktu: ${new Date().toISOString()}`,
        `Error: ${error.name || "Error"}: ${error.message || "Unknown error"}`
    ].join("\n")

    await client.send(new PublishCommand({
        TopicArn: topicArn,
        Subject: `Library game ${action} gagal`,
        Message: message
    }))
}

export { sendFailureMessage }
