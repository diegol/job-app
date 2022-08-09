import { Logger } from "@aws-lambda-powertools/logger";
import { injectable } from "inversify";

@injectable()
export class ApplicationLogger {
  getInstance = (): Logger => {
    const logger = new Logger({ serviceName: "JobCreation" });
    return logger;
  };
}
