import {
  APIGatewayProxyEvent,
  middy,
  MutableContext,
} from "./common-middleware";

import { APIGatewayProxyResult } from "aws-lambda";

import { Logger } from "@aws-lambda-powertools/logger";
import { ApplicationLoggerInterface } from "../../interfaces";

import TYPES from "../../types";

export const loggerMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Error,
  MutableContext
> => {
  const before: middy.MiddlewareFn<
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Error,
    MutableContext
  > = async (request): Promise<void> => {
    const logger = request.context.container
      ?.get<ApplicationLoggerInterface>(TYPES.ApplicationLogger)
      .getInstance();

    request.context.logger = logger;
  };

  return {
    before,
  };
};
