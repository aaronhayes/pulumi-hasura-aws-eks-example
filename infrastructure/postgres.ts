import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { cluster, vpc, namespaceName } from "./cluster";
import { sg } from './security-group';

const dbSubnets = new aws.rds.SubnetGroup(`${config.PROJECT_NAME}-subnets`, {
  subnetIds: vpc.privateSubnetIds
});

export const db = new aws.rds.Instance(`${config.PROJECT_NAME}-postgres`, {
  engine: "postgres",
  instanceClass: config.POSTGRES_INSTANCE_TYPE,
  allocatedStorage: 20,
  dbSubnetGroupName: dbSubnets.id,
  name: config.POSTGRES_DB_NAME,
  username: config.POSTGRES_USERNAME,
  password: config.POSTGRES_PASSWORD,
  skipFinalSnapshot: true,
  publiclyAccessible: false,
  vpcSecurityGroupIds: [sg.id]
});

const connectionUrl = pulumi
  .all([db.username, db.password, db.address, db.port, db.name])
  .apply(([un, pw, addr, port, name]) =>
    Buffer.from(`postgres://${un}:${pw}@${addr}:${port}/${name}`).toString(
      "base64"
    )
  );

// Create a secret from the DB connection
export const dbConn = new k8s.core.v1.Secret(
  "postgres-db-conn",
  {
    metadata: {
      namespace: namespaceName
    },
    data: {
      dbConnectionUrl: connectionUrl
    }
  },
  { provider: cluster.provider }
);

export const urn = db.urn;
