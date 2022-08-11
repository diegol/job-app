import { Metrics } from "@aws-lambda-powertools/metrics";
import { injectable } from "inversify";
import { ApplicationMetricsInterface } from "../interfaces";

let metricsInstance: Metrics;

@injectable()
export class ApplicationMetrics implements ApplicationMetricsInterface {
  getInstance = (): Metrics => {
    if (metricsInstance == null) {
      metricsInstance = new Metrics({
        namespace: "JobApplication",
        serviceName: "jobs",
      });
    }
    return metricsInstance;
  };
}
