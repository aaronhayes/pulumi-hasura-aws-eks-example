import * as awsx from "@pulumi/awsx";

import * as config from "./config";
import { cluster, vpc } from "./cluster";

const sg = new awsx.ec2.SecurityGroup(`${config.PROJECT_NAME}-sg`, { vpc });

sg.createIngressRule("postgres-access", {
  location: {
    sourceSecurityGroupId: cluster.nodeSecurityGroup.id
  },
  ports: new awsx.ec2.TcpPorts(5432),
  description: "Postgres access for nodes"
});

sg.createIngressRule("postgres-access-cluster", {
  location: {
    sourceSecurityGroupId: cluster.clusterSecurityGroup.id
  },
  ports: new awsx.ec2.TcpPorts(5432),
  description: "Postgres access for cluster"
});

sg.createIngressRule("redis-access", {
    location: {
        sourceSecurityGroupId: cluster.nodeSecurityGroup.id
    },
    ports: new awsx.ec2.TcpPorts(6379),
    description: "Redis access for nodes"
});

sg.createIngressRule("redis-access-cluster", {
    location: {
        sourceSecurityGroupId: cluster.clusterSecurityGroup.id
    },
    ports: new awsx.ec2.TcpPorts(6379),
    description: "Redis access for cluster"
});

sg.createEgressRule("outbound", {
  location: new awsx.ec2.AnyIPv4Location(),
  ports: new awsx.ec2.AllTcpPorts(),
  description: "Outbound access to anywhere"
});

export { sg };
