import middy from "@middy/core";

import { Container } from "inversify";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  APIGatewayProxyResult,
  EventBridgeEvent,
  SNSEvent,
  SQSEvent,
  S3Event,
  ScheduledEvent,
  APIGatewayEvent,
  Context,
} from "aws-lambda";

import { Logger } from "@aws-lambda-powertools/logger";
export {
  middy,
  Container,
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
  EventBridgeEvent,
  SNSEvent,
  SQSEvent,
  S3Event,
  ScheduledEvent,
  APIGatewayProxyResult,
};

export type CommonEvent =
  | APIGatewayProxyEvent
  | EventBridgeEvent<string, unknown>
  | SQSEvent
  | ScheduledEvent
  | S3Event
  | SNSEvent
  | any;

export type CommonRequest = middy.Request<
  CommonEvent,
  CommonResult,
  Error,
  MutableContext
>;

export type CommonResult = APIGatewayProxyResultV2 | unknown | void;

export interface MutableContext extends Context {
  container?: Container;
  logger?: Logger;
}
