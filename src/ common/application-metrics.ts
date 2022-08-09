import { Metrics } from "@aws-lambda-powertools/metrics";
import { injectable } from "inversify";

@injectable()
export class ApplicationMetrics {
  getInstance = (): Metrics => {
    return new Metrics({
      namespace: "JobApplication",
      serviceName: "jobs",
    });
  };
}
