#!/usr/bin/env node

import { fileURLToPath } from "node:url";

import * as cdk from "aws-cdk-lib";

import * as ecra from "aws-cdk-lib/aws-ecr-assets";
import * as apprunner from "@aws-cdk/aws-apprunner-alpha";
import { CfnAutoScalingConfiguration, CfnService } from "aws-cdk-lib/aws-apprunner";

const app = new cdk.App();
const stack = new cdk.Stack(app, "NthOfPrimeStack", {
  tags: {
    Owner: process.env["USER"],
  },
});


const image = new ecra.DockerImageAsset(stack, "Image", {
  directory: fileURLToPath(new URL(".", import.meta.url)),
  ignoreMode: cdk.IgnoreMode.DOCKER,
  exclude: [
    ".eslint-rc.json",
    ".git/",
    ".gitignore",
    ".next",
    ".tool-versions",
    "cdk-app.js",
    "node_modules/",
    "README.md",
    "tsconfig.tsbuildinfo",
  ],
});

const scale = new CfnAutoScalingConfiguration(stack, "AppScale", {
  maxSize: 1,
});

const service = new apprunner.Service(stack, "App", {
  source: apprunner.Source.fromAsset({
    asset: image,
    imageConfiguration: {
      port: 3000,
      environmentVariables: {
        // https://github.com/vercel/next.js/issues/49777
        HOSTNAME: "0.0.0.0",
      },
    },
  }),
  autoDeploymentsEnabled: true,
  cpu: apprunner.Cpu.HALF_VCPU,
  memory: apprunner.Memory.ONE_GB,
});
cdk.Aspects.of(service).add({
  visit(node) {
    if (!(node instanceof CfnService)) {
      return;
    }

    node.autoScalingConfigurationArn = scale.attrAutoScalingConfigurationArn;
  }
});

new cdk.CfnOutput(stack, "AppUrl", {
  value: service.serviceUrl,
});
