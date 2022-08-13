import container from "../../inversify.config";
import { APIGatewayProxyEvent, middy, MutableContext } from "./common";

import { APIGatewayProxyResult } from "aws-lambda";

export const containerMiddleware = (): middy.MiddlewareObj<
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
    request.context.container = container;
  };

  return {
    before,
  };
};
