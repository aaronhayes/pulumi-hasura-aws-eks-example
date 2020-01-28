import * as awsx from "@pulumi/awsx";
import * as k8s from "@pulumi/kubernetes";

import { cluster, namespaceName } from "./cluster";
import * as config from "./config";
import { secrets } from "./secrets";
import { dbConn } from "./postgres";

const appName = "hasura";

const hasuraLabels = {
  app: "hasura"
};

// Build and publish to an ECR registry.
const repo = new awsx.ecr.Repository(`${config.PROJECT_NAME}-hasura`);
const image = repo.buildAndPushImage("../hasura");

const hasuraDeployment = new k8s.apps.v1.Deployment(
  `${appName}`,
  {
    metadata: {
      name: "hasura",
      labels: hasuraLabels,
      namespace: namespaceName
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: hasuraLabels },
      template: {
        metadata: {
          labels: hasuraLabels
        },
        spec: {
          containers: [
            {
              name: "hasura",
              image: image,
              ports: [
                {
                  name: "http",
                  containerPort: 8080
                }
              ],
              env: [
                {
                  name: "HASURA_GRAPHQL_ENABLE_CONSOLE",
                  value: config.HASURA_GRAPHQL_ENABLE_CONSOLE
                },
                {
                  name: "HASURA_GRAPHQL_ENABLE_TELEMETRY",
                  value: config.HASURA_GRAPHQL_ENABLE_TELEMERTY
                },
                {
                  name: "HASURA_GRAPHQL_DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      key: "dbConnectionUrl",
                      name: dbConn.metadata.name
                    }
                  }
                },
                {
                  name: "HASURA_GRAPHQL_ADMIN_SECRET",
                  valueFrom: {
                    secretKeyRef: {
                      key: "hasuraGraphqlAdminSecret",
                      name: secrets.metadata.name
                    }
                  }
                },
                {
                  name: "HASURA_GRAPHQL_JWT_SECRET",
                  valueFrom: {
                    secretKeyRef: {
                      key: "hasuraGraphqlJWTSecret",
                      name: secrets.metadata.name
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    }
  },
  { provider: cluster.provider }
);

// Export deployment name
export const deploymentName = hasuraDeployment.metadata.name;

export const service = new k8s.core.v1.Service(
  `${appName}`,
  {
    metadata: {
      name: "hasura",
      labels: hasuraLabels,
      namespace: namespaceName
    },
    spec: {
      type: "LoadBalancer",
      ports: [
        {
          port: 80,
          targetPort: 8080,
          name: "http"
        }
      ],
      selector: hasuraLabels
    }
  },
  { provider: cluster.provider }
);

export const url = service.status.loadBalancer.ingress[0].hostname;
