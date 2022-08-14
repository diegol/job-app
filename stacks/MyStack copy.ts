import * as sst from "@serverless-stack/resources";
import { Tags } from "aws-cdk-lib";
import {
  Vpc,
  IVpc,
  ISecurityGroup,
  SecurityGroup,
  DefaultInstanceTenancy,
  SubnetType,
  NatProvider,
  InstanceType,
  Peer,
  Port,
} from "aws-cdk-lib/aws-ec2";
import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  AuroraMysqlEngineVersion,
  DatabaseCluster,
  DatabaseClusterEngine,
  ParameterGroup,
  SubnetGroup,
} from "aws-cdk-lib/aws-rds";

const MYSQL_ENGINE = "mysql5.7";
const DEFAULT_DATABASE_NAME = "acme";

export default class MyStack extends sst.Stack {
  /**
   * prefix for the resources names, it should use env [TODO]
   */
  private readonly fullPrefix: string = "job-app";

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const vpc = this.createVpc();

    const defaultDatabaseName = DEFAULT_DATABASE_NAME;

    const cluster = new sst.RDS(this, "Database", {
      engine: MYSQL_ENGINE,
      defaultDatabaseName,
      migrations: "src/migrations",
      cdk: {
        cluster: {
          vpc,
          vpcSubnets: {
            subnetType: SubnetType.PRIVATE_WITH_NAT,
          },

          subnetGroup: this.createSubnetGroup(vpc),
        },
      },

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
          logRetention: "one_day",
          //permissions: ["ses", bucket],
          reservedConcurrentExecutions: 2,
          environment: {
            DATABASE: defaultDatabaseName,
            CLUSTER_ARN: cluster.clusterArn,
            SECRET_ARN: cluster.secretArn,
          },
          permissions: [cluster],
          vpc,
          vpcSubnets: {
            subnetType: SubnetType.PRIVATE_WITH_NAT,
          },
        },
      },
      //One Lambda function for each route
      routes: {
        /*** Jobs ***/
        "GET /jobs": {
          function: {
            handler: "src/jobs/functions/lambda-get-job-list.handler",
            timeout: 10,
            memorySize: 128,
          },
        },
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

  private createSubnetGroup(vpc: IVpc) {
    return new SubnetGroup(this, "aurora-rds-subnet-group", {
      description: `Aurora RDS Subnet Group for database ${this.fullPrefix}`,
      subnetGroupName: `${this.fullPrefix}-mysql-subnetg`,
      vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      vpcSubnets: {
        subnets: vpc.privateSubnets,
      },
    });
  }

  /**
   *  Create a new VPC
   */
  private createVpc(): IVpc {
    return new Vpc(this, "YabbleVpc", {
      vpcName: `${this.fullPrefix}-vpc`,
      cidr: "10.2.0.0/16",
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 1,
      maxAzs: 3,
      defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
      subnetConfiguration: [
        {
          name: "private-subnet-1",
          subnetType: SubnetType.PRIVATE_WITH_NAT,
          cidrMask: 24,
        },
        {
          name: "public-subnet-1",
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "isolated-subnet-1",
          subnetType: SubnetType.PRIVATE_ISOLATED,
          cidrMask: 28,
        },
      ],
      natGatewayProvider: NatProvider.instance({
        instanceType: new InstanceType("t2.micro"),
      }),
    });
  }

  private createPublicSecurityGroup(vpc: IVpc): ISecurityGroup {
    return new SecurityGroup(this, "PublicSecurityGroup", {
      vpc,
      securityGroupName: `${this.fullPrefix}-publicSg`,
    });
  }

  private createPrivateSecurityGroup(vpc: IVpc): ISecurityGroup {
    const sg = new SecurityGroup(this, "PrivateSecurityGroup", {
      vpc,
      securityGroupName: `${this.fullPrefix}-privateSg`,
    });

    return sg;
  }
}
