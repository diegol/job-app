import * as sst from "@serverless-stack/resources";
import { Tags } from "aws-cdk-lib";

const MYSQL_ENGINE = "mysql5.7";
const DEFAULT_DATABASE_NAME = "acme";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const defaultDatabaseName = DEFAULT_DATABASE_NAME;

    const cluster = new sst.RDS(this, "Database", {
      engine: MYSQL_ENGINE,
      defaultDatabaseName,
      migrations: "src/migrations",
      //serverless RDS
      scaling: {
        autoPause: true,
        minCapacity: "ACU_2",
        maxCapacity: "ACU_2",
      },
    });

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      defaults: {
        function: {
          timeout: 20,
          runtime: "nodejs16.x",
          environment: {
            DATABASE: defaultDatabaseName,
            CLUSTER_ARN: cluster.clusterArn,
            SECRET_ARN: cluster.secretArn,
          },
          permissions: [cluster],
        },
      },
      //One Lambda function for each route
      routes: {
        /*** Jobs ***/
        "GET /jobs": "src/jobs/functions/lambda-get-job-list.handler",
        "POST /jobs": "src/jobs/functions/lambda-post-job.handler",
        "GET /jobs/{jobId}": "src/jobs/functions/lambda-get-job.handler",
        "PATCH /jobs/{jobId}/status":
          "src/jobs/functions/lambda-update-status-job.handler",
        /*** Notes ***/
        "GET /jobs/{jobId}/notes":
          "src/notes/functions/lambda-get-note-list.handler",
        "POST /jobs/{jobId}/notes":
          "src/notes/functions/lambda-post-note.handler",
        "PATCH /jobs/{jobId}/notes/{noteId}":
          "src/notes/functions/lambda-update-note.handler",
      },
    });

    //Tags to be used by Lumigo in integrated with AWS account
    Tags.of(api).add("lumigo:auto-trace", `true`);

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
