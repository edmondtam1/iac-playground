import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
export const bucketName = bucket.id;

/*


ca () {
  if [[ $# == '0' ]]; then
    command git add -A && git commit -m "Quick commit"
  elif [[ $# == '1' ]]; then
    command git add -A && git commit -m "$1"
  else
    command git add -A && git commit -m "$1" -m "$2"
  fi
}

cap () {
  ca "$@" && git push
}


*/
