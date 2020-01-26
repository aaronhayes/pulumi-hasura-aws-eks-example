import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { vpc, cluster, namespaceName } from "./cluster";
import { sg } from "./security-group";

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
    securityGroupIds: [sg.id]
  }
);

const redisPort = cacheCluster.port.apply(port =>
  Buffer.from(`${port}`).toString("base64")
);
const redisHost = cacheCluster.cacheNodes[0].address.apply(host =>
  Buffer.from(`${host}`).toString("base64")
);

// Create a ConfigMap from the cache connection information.
export const cacheConn = new k8s.core.v1.ConfigMap(
  "redis-db-conn",
  {
    metadata: {
      namespace: namespaceName
    },
    data: {
      host: redisHost,
      port: redisPort
    }
  },
  { provider: cluster.provider }
);

export const urn = cacheCluster.urn;
