import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";

export const vpc = new awsx.ec2.Vpc(`${config.PROJECT_NAME}-vpc`, {
  numberOfAvailabilityZones: 2
});

export const allSubnetIds = vpc.privateSubnetIds.concat(vpc.publicSubnetIds);

export const cluster = new eks.Cluster(`cluster-pulumi-test`, {
  vpcId: vpc.id,
  publicSubnetIds: vpc.publicSubnetIds,
  privateSubnetIds: vpc.privateSubnetIds,
  instanceType: config.CLUSTER_NODE_INSTANCE_TYPE,
  desiredCapacity: 2,
  minSize: 1,
  maxSize: 3,
  storageClasses: "gp2",
  deployDashboard: false
});

// Namespace
export const namesapce = new k8s.core.v1.Namespace(
  `${config.PROJECT_NAME}-${config.APP_CLASS}`,
  {},
  { provider: cluster.provider }
);

export const namespaceName = namesapce.metadata.apply(m => m.name);

// Export the Cluster's Kubeconfig
export const kubeconfig = cluster.kubeconfig;

export const urn = cluster.urn;
