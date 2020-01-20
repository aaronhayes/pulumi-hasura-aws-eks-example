import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { kubeconfig, urn as clusterUrn } from "./cluster";
import { urn as postgresUrn } from "./postgres";
import { urn as redisUrn } from "./redis";
import { url as hasuraUrl } from "./hasura";
import { url as nginxUrl } from "./nginx";

// Export the URL for the load balanced service
export {
  nginxUrl,
  hasuraUrl,
  postgresUrn,
  clusterUrn,
  redisUrn,
  kubeconfig
};

// export const namespace = ns.metadata.name;