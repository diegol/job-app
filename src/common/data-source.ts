import "reflect-metadata";
import { Job } from "../entity/Job";
import { Note } from "../entity/Note";
import { DataSource } from "typeorm";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import TYPES from "../types";

const CONNECTION_NAME = "default";
const CONNECTION_TYPE = "mysql";

let dataSource: DataSource;

@injectable()
export class CreateDataSource {
  /*
  constructor(@inject(COMMON.Logger) private logger: Logger) {
    this.logger.debug(MySqlDatabaseConnection.name, "start");
  }
*/
  getDataSource = async (): Promise<DataSource> => {
    if (dataSource == null) {
      dataSource = await new DataSource({
        type: "aurora-mysql",
        database: process.env.DATABASE!,
        secretArn: process.env.SECRET_ARN!,
        resourceArn: process.env.CLUSTER_ARN!,
        region: "us-east-1",
        serviceConfigOptions: {},
        synchronize: true,
        logging: false,
        entities: [Job, Note],
        migrations: ["src/migrations/*.ts"],
      }).initialize();
    }

    return dataSource;
  };
}
