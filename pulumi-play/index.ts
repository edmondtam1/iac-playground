import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsnative from "@pulumi/aws-native";
import * as fs from "fs";

const lambdaRole = new awsnative.iam.Role("lambdaRole", {
  assumeRolePolicyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  },
});

const lambdaRoleAttachment = new aws.iam.RolePolicyAttachment(
  "lambdaRoleAttachment",
  {
    role: pulumi.interpolate`${lambdaRole.roleName}`,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
  }
);

// Run `npx tsc` before deploying the code

const helloFunction = new awsnative.lambda.Function("helloFunction", {
  role: lambdaRole.arn,
  runtime: "nodejs14.x",
  handler: "index.handler",
  code: {
    zipFile: fs.readFileSync("./bin/lambda.js").toString(),
  },
});

const lambdaUrl = new awsnative.lambda.Url("test", {
  targetFunctionArn: helloFunction.arn,
  authType: awsnative.lambda.UrlAuthType.None,
});

export const url = lambdaUrl.functionUrl;
