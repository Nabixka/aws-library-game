import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { pool, hsr, gi, zzz } from "./config.js"

const snsClient = new SNSClient({})
const databases = Object.entries({
    primary: pool,
    honkai_star_rail: hsr,
    genshin_impact: gi,
    zenless_zone_zero: zzz
})

export const handler = async () => {
    const results = await Promise.allSettled(
        databases.map(async ([database, client]) => {
            await client.query("SELECT 1")
            return database
        })
    )

    const databaseStatuses = results.map((result, index) => {
        const [database] = databases[index]
        return result.status === "fulfilled"
            ? { database, status: "HEALTHY" }
            : {
                database,
                status: "UNHEALTHY",
                error: result.reason instanceof Error ? result.reason.message : String(result.reason)
            }
    })
    const failed = databaseStatuses.filter(({ status }) => status === "UNHEALTHY")
    const status = failed.length === 0 ? "HEALTHY" : "UNHEALTHY"
    const topicArn = process.env.SNS_TOPIC_ARN

    if (!topicArn) {
        throw new Error("SNS_TOPIC_ARN belum dikonfigurasi")
    }

    const message = [
        `Database health: ${status}`,
        `Waktu: ${new Date().toISOString()}`,
        "",
        ...databaseStatuses.map(({ database, status: databaseStatus, error }) =>
            `${database}: ${databaseStatus}${error ? ` - ${error}` : ""}`
        )
    ].join("\n")

    console.info(JSON.stringify({ event: "database-health-check-completed", status, databases: databaseStatuses }))

    try {
        await snsClient.send(new PublishCommand({
            TopicArn: topicArn,
            Subject: `Database health: ${status}`,
            Message: message
        }))
    } catch (notificationError) {
        console.error(JSON.stringify({
            event: "database-health-notification-failed",
            message: notificationError instanceof Error ? notificationError.message : String(notificationError)
        }))
        if (failed.length > 0) {
            throw new Error(
                `Database health check failed for: ${failed.map(({ database }) => database).join(", ")}; SNS notification failed`,
                { cause: notificationError }
            )
        }
        throw notificationError
    }

    if (failed.length > 0) {
        throw new Error(`Database health check failed for: ${failed.map(({ database }) => database).join(", ")}`)
    }

    return { status: "healthy", databases: databaseStatuses.map(({ database }) => database) }
}
