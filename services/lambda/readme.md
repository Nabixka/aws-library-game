# Auth Lambda configuration

Set `STEP_FUNCTION_ARN` on both the register and login Lambda functions to the
ARN of the Step Functions state machine. The Lambda execution role also needs
`states:StartExecution` permission for that state machine. Configure the Lambda
and state machine in the same AWS Region.

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

## Email alerts for failed executions

Deploy `step-functions-failure-alerts.yaml` as a CloudFormation stack, providing
the auth state machine ARN and the email address that should receive alerts.
The stack creates an SNS topic and an EventBridge rule that forwards
`FAILED`, `TIMED_OUT`, and `ABORTED` execution events for that state machine.
Confirm the SNS subscription using the confirmation email before expecting
notifications. The alert contains the Step Functions execution status event.
