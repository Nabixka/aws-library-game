# Auth Lambda configuration

Set `STEP_FUNCTION_ARN` on both the register and login Lambda functions to the
ARN of the Step Functions state machine. Set `SNS_TOPIC_ARN` on both functions
to the SNS topic ARN that receives endpoint error alerts. The Lambda execution
role needs `states:StartExecution` permission for the state machine and
`sns:Publish` permission for the topic. Configure the Lambda, state machine,
and SNS topic in the same AWS Region.
The auth handlers send CORS headers for
`https://main.di4ydu272hbea.amplifyapp.com` by default. Set `CORS_ORIGIN` on
both functions if the frontend uses a different origin.

The Lambda deployment ZIP must contain `package.json`, `node_modules/`, and
the handler and helper files directly at its root. Set the Lambda handler to
`login.handler` for the login function or `register.handler` for the register
function; do not point it into `node_modules`. From this directory, create a
fresh deployment ZIP with:

```sh
zip -r /tmp/auth-lambda-esm.zip package.json login.js register.js config.js node_modules/
```

Upload that ZIP to both functions and select the appropriate handler name for
each one. The existing `library.zip` does not include the login or register
handler files.

## Scheduled database health check

Deploy `database-health-check.js` as a Lambda using the Node.js runtime and set
the handler to `database-health-check.handler`. Package it with its shared
config and dependencies:

```sh
zip -r /tmp/database-health-check.zip package.json database-health-check.js config.js node_modules/
```

Set the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, and
`SNS_TOPIC_ARN` environment variables on the function. The SNS topic must have
an email subscription that has been confirmed. Grant the Lambda execution role
`sns:Publish` permission for that topic. Configure a timeout (for example, 10
seconds) and network access so the function can reach the PostgreSQL server.
The handler runs `SELECT 1` against the primary database, Honkai: Star Rail,
Genshin Impact, and Zenless Zone Zero databases, then publishes the health
status of all four databases through SNS on every invocation. A failed
database check is included in the email and causes the Lambda invocation to
fail after SNS publish.

In EventBridge, configure the schedule expression as `rate(1 hour)`, set this
Lambda as the target, and enable the schedule. Ensure the Lambda resource
policy allows EventBridge to invoke it.

After credentials are verified and the database operation succeeds, each
endpoint starts an execution with this JSON input:

```json
{
  "action": "register",
  "userId": 1,
  "username": "example"
}
```

For login, `action` is `"login"`. Passwords are not included in the state
machine input. A successful endpoint response includes the execution ARN. If
the state machine cannot be started, the endpoint returns an error. For
registration, the account may already have been created before that error is
returned.

## Auth state machine definition

Use `auth-state-machine.asl.json` as the state machine definition in the
Step Functions console. It routes `register` and `login` events to separate
successful terminal states and fails executions with any other `action`.
Authentication and database operations have already completed in the Lambda
functions before the state machine starts.

## Email alerts for failed executions

Deploy `step-functions-failure-alerts.yaml` as a CloudFormation stack, providing
the auth state machine ARN and the email address that should receive alerts.
The stack creates an SNS topic and an EventBridge rule that forwards
`FAILED`, `TIMED_OUT`, and `ABORTED` execution events for that state machine.
Confirm the SNS subscription using the confirmation email before expecting
notifications. The template outputs the topic ARN to use as `SNS_TOPIC_ARN`.
Register and login endpoint errors are published by their respective Lambda
handlers to the same topic. Normal validation responses and incorrect
credentials do not trigger these endpoint error alerts. If publishing the
notification fails, the endpoint still returns its original error and includes
a `notificationError` detail.
