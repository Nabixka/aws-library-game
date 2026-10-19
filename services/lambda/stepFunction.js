const { SFNClient, StartExecutionCommand } = require("@aws-sdk/client-sfn")

const client = new SFNClient({})

async function startAuthExecution(action, user) {
    const stateMachineArn = process.env.STEP_FUNCTION_ARN
    if (!stateMachineArn) {
        throw new Error("STEP_FUNCTION_ARN belum dikonfigurasi")
    }

    const result = await client.send(new StartExecutionCommand({
        stateMachineArn,
        input: JSON.stringify({
            action,
            userId: user.id,
            username: user.username
        })
    }))

    if (!result.executionArn) {
        throw new Error("Step Functions tidak mengembalikan execution ARN")
    }

    return result.executionArn
}

module.exports = { startAuthExecution }
