import { Logger } from "@aws-lambda-powertools/logger";
import { injectable } from "inversify";

let loggerInstance: Logger;

@injectable()
export class ApplicationLogger {
  getInstance = (): Logger => {
    const loggerInstance = new Logger({ serviceName: "JobCreation" });
    return loggerInstance;
  };
}
