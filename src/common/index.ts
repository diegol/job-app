import "reflect-metadata";
import middy from "@middy/core";
import { injectable } from "inversify";
import validator from "@middy/validator";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import cloudwatchMetrics from "@middy/cloudwatch-metrics";
import { LambdaInterface } from "@aws-lambda-powertools/commons";
import {
  Metrics,
  MetricUnits,
  logMetrics,
} from "@aws-lambda-powertools/metrics";

import { Tracer, captureLambdaHandler } from "@aws-lambda-powertools/tracer";

import { Logger, injectLambdaContext } from "@aws-lambda-powertools/logger";

import container from "./../inversify.config";
import TYPES from "./../types";
export {
  middy,
  validator,
  httpErrorHandler,
  jsonBodyParser,
  cloudwatchMetrics,
  Metrics,
  MetricUnits,
  logMetrics,
  Tracer,
  captureLambdaHandler,
  Logger,
  injectLambdaContext,
  LambdaInterface,
  container,
  TYPES,
  injectable,
};
