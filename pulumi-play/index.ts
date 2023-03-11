import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsnative from "@pulumi/aws-native";

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

const helloFunction = new awsnative.lambda.Function("helloFunction", {
  role: lambdaRole.arn,
  runtime: "nodejs14.x",
  handler: "index.handler",
  code: {
    zipFile: `exports.handler = function(event, context, callback){ callback(null, {"response": "Hello "}); };`,
  },
});

const lambdaUrl = new awsnative.lambda.Url("test", {
  targetFunctionArn: helloFunction.arn,
  authType: awsnative.lambda.UrlAuthType.None,
});

export const url = lambdaUrl.functionUrl;
