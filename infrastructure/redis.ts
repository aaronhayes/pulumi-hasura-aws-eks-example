import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { vpc, cluster } from "./cluster";

// Create a Redis Instance
const cacheSubnets = new aws.elasticache.SubnetGroup(
  `${config.PROJECT_NAME}-redis-subnets`,
  {
    subnetIds: vpc.privateSubnetIds
  }
);

export const cacheCluster = new aws.elasticache.Cluster(
  `${config.PROJECT_NAME}-redis`,
  {
    engine: "redis",
    nodeType: "cache.t2.small",
    numCacheNodes: 1,
    subnetGroupName: cacheSubnets.id,
    securityGroupIds: [cluster.clusterSecurityGroup.id]
  }
);

// Create a ConfigMap from the cache connection information.
export const cacheConn = new k8s.core.v1.ConfigMap(
  "redis-db-conn",
  {
    data: {
      host: cacheCluster.cacheNodes[0].address
    }
  },
  { provider: cluster.provider }
);

export const urn = cacheCluster.urn;
