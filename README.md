## Introduction

This is a RestfulApi developed folowing a event-driven/microservices architecture using these AWS services:

- Lambda Functions
- Api Gateway
- RDS (serverless with autpause set to true)
- Secret Manager (to store RDS credentials)
- Cloud Watch:
- Logs
- Metrics
- X-Traces

## Infrastructure

`npm run deploy` will create the aws infrstructure, API Gateway, Lambdas and DataBase, for this I have used SST Framework that is based on CDK.
SST will create and deploy a Cloud Formation stack.

Also if you run `npm run start` this will run the lambda localy but using the AWS resources (using Lamndas as a Proxy), also a local console.

- [Live Lambda](https://docs.sst.dev/live-lambda-development)
- [SST console](https://docs.sst.dev/console)

`npm run remove` will remove the stack.

The code for the Stack is in /stacks/MyStacks.ts

- [SST Docs](https://docs.serverless-stack.com)

## Monitor/ Observability

For monitor and observabilit we are using

- Cloud Watch:
- Logs
- Metrics
- X-Traces

Using `aws-lambda-powertools` we can generate CloudWatch metrics, tracing and loggging
We can generate our metrics from `Latency` to `Jobs created` and from those Metrics we can easily can generate Alerts

Also if you check in stacks.MyStacks.ts it is a line

```typescript
Tags.of(api).add("lumigo:auto-trace", `true`);
```

Then if the AWS account is integrated with [Lumigo](https://lumigo.io) we will be able to see all requests from there. This tool and others like Epsagon
are great for montiroing distibuted/event driven systems

## RestApi

Although usually I use swaggers/openapi spec for time limitation I will add it here

Get a list of jobs, it has filter and sorting capabilities and it is paginated, also has a metadata that brings the total amount of jobs
[GET] /jobs?firstName=test&lastName=test&sortBy=asc&orderBy=mobileNumber&pageSize=1
Output example

```json
{
  "metadata": {
    "totalRecordsCount": 45,
    "pageSize": 1,
    "offset": 0
  },
  "jobs": [
    {
      "id": "06984b1b-f61c-451e-950f-003773a26eb1",
      "firstName": "diego",
      "lastName": "asdsa",
      "mobileNumber": "12-32324234234234234",
      "address": "ASdasd",
      "status": "invoicing",
      "created_at": "2022-08-08T05:40:38.376Z",
      "updated_at": "2022-08-08T11:12:45.000Z"
    }
  ]
}
```

Get a specific job if exist (otherwise reeturn 404) and an array of notes associated if they exist
[GET] /jobs/{jobId}

```json
[
  {
    "id": "06984b1b-f61c-451e-950f-003773a26eb1",
    "firstName": "diego",
    "lastName": "asdsa",
    "mobileNumber": "12-32324234234234234",
    "address": "ASdasd",
    "status": "invoicing",
    "created_at": "2022-08-08T05:40:38.376Z",
    "updated_at": "2022-08-08T11:12:45.000Z"
  }
]
```

Create a Job
[POST] /jobs
Body example:

```json
{
  "firstName": "diego",
  "lastName": "lewin",
  "mobileNumber": "12-32324234234234234",
  "address": "123 Quuen St"
}
```

Update Status for a specific Job
[GET] /jobs/{jobId}/status

```json
{
  "status": "active"
}
```

Get all the notes for a specific Job
[GET] /jobs/{jobId}/notes

Get a specific note
[GET] /jobs/{jobId}/notes/{noteId}

Creat a note for a specific Job
[POST] /jobs/{jobId}/notes

```json
{
  "description": "description text"
}
```

Update a specific note
[PATCH] /jobs/{jobId}/notes/{noteId}

```json
{
  "description": "description text"
}
```

## Framework and Libraries:

Instead of Nestjs for instance, I chosed a lightweight framework specifically design for Lamnda functions called
[Middy](http://middy.js.org)
Also I used other libraries like:

- ajv to validate inputs
- TypeOrm
- aws-lambda-powertools to generate CloudWatch metrics, tracing and loggging
- inversify for dependenccy injection

## Testing

- vitest
- Faker

Just did one quick test that is in src/jobs/test/job-service.test.ts, but usually I do `unit tests` and `integration test`. The command to run it is `npm run test`

## Directory structure

├── src
│ ├── common
│ ├── entities
│ │ ├── task.ts
│ │ ├── job.ts
│ ├── repositories
│ ├── jobs <---- All related to jobs
│ │ ├── dto
│ │ ├── functions <---- One Lamda function for each api call
│ │ └── schemas <---- To validate all the user input
│ │ └── job.service.ts <---- Where the business logic goes
│ ├── notes <---- All related to notes (similar structure than jobs
│ └── migrations <-- DB migrationss
│
├── stacks <---- Where all SST/CDK infrastructure code is defined
├── test
├── other configuration files...
└── README.md

Basically each route is associated with a lambda function in stacks/MyStack.js, then in thee handler function
using the different schemas we validate all input data coming from the user and throw a validation error if is an issue.

If the validation passes generally we call a service function (job.service.ts or note.service.ts) using the inversify container. There we implment some business logic and call the repositories to get the data from the DB.

For the Database I used TypeOrm defined the entities and one to many relationship and use the decorators @UpdateDateColumn() @CreateDateColumn() to update the created_at and updated_at fields.

Also we havce a folder for DB migrations.

One intersing feature is the use aws-lambda-powertools that allow to create cloud watch metrics and a tracer, that allow us to track each lambda invocation in cloud watch.
