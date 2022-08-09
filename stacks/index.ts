import "reflect-metadata";

import MyStack from "./MyStack";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    bundle: { nodeModules: ["typeorm"] },
    runtime: "nodejs14.x",
  });

  new MyStack(app, "my-stack");

  // Add more stacks
}
