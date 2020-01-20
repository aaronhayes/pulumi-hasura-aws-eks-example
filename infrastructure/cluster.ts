import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { SecurityGroupRule } from "@pulumi/aws/ec2";

export const vpc = new awsx.ec2.Vpc(`${config.PROJECT_NAME}-vpc`, {
  numberOfAvailabilityZones: 2
});

export const allSubnetIds = vpc.privateSubnetIds.concat(vpc.publicSubnetIds);

export const cluster = new eks.Cluster(`cluster-pulumi-test`, {
  vpcId: vpc.id,
  subnetIds: allSubnetIds,
  instanceType: config.CLUSTER_NODE_INSTANCE_TYPE,
  desiredCapacity: 2,
  minSize: 1,
  maxSize: 3,
  storageClasses: "gp2",
  deployDashboard: false
});

// export const namesapce = new k8s.core.v1.Namespace(
//   `${config.PROJECT_NAME}`,
//   {},
//   { provider: cluster.provider }
// );

// Export the Cluster's Kubeconfig
export const kubeconfig = cluster.kubeconfig;

export const urn = cluster.urn;
