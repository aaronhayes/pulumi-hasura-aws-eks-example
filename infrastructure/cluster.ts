import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";

import * as config from "./config";

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

// Export the Cluster's Kubeconfig
export const kubeconfig = cluster.kubeconfig;

export const urn = cluster.urn;
