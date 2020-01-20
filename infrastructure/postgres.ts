import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { cluster, vpc } from "./cluster";

const dbSubnets = new aws.rds.SubnetGroup(`${config.PROJECT_NAME}-subnets`, {
  subnetIds: vpc.privateSubnetIds
});

export const db = new aws.rds.Instance(`${config.PROJECT_NAME}-postgres`, {
  engine: "postgres",
  instanceClass: "db.t2.small",
  allocatedStorage: 20,
  dbSubnetGroupName: dbSubnets.id,
  vpcSecurityGroupIds: [cluster.clusterSecurityGroup.id],
  name: config.POSTGRES_DB_NAME,
  username: config.POSTGRES_USERNAME,
  password: config.POSTGRES_PASSWORD,
  skipFinalSnapshot: true,
  publiclyAccessible: true
});


const username = db.username.apply(un => un);
const password = db.password.apply(pw => pw);
const address = db.address.apply(addr => addr);
const port = db.port.apply(port => port);
const name = db.name.apply(name => name);


console.log(username);
console.log(password);
console.log(address);
console.log(port);
console.log(name);

// Create a secret from the DB connection
export const dbConn = new k8s.core.v1.Secret(
  "postgres-db-conn",
  {
    data: {
      dbConnectionUrl: Buffer.from(
        `postgres://${username}:${password}@${address}:${port}/${name}`
      ).toString("base64")
    }
  },
  { provider: cluster.provider }
);

export const urn = db.urn;
