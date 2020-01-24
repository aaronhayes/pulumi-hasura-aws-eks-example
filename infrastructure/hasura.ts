import * as k8s from "@pulumi/kubernetes";
import { cluster } from "./cluster";
import * as config from "./config";

import { dbConn } from "./postgres";

const appName = "hasura";

const hasuraLabels = {
  app: 'hasura'
};

const hasuraDeployment = new k8s.apps.v1.Deployment(
  `${appName}-deployment`,
  {
    metadata: {
      name: 'hasura',
      labels: hasuraLabels
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
              image: "hasura/graphql-engine:v1.0.0",
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
                      name:  dbConn.metadata.name
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
  `${appName}-svc`,
  {
    metadata: {
      name: 'hasura',
      labels: hasuraLabels
    },
    spec: {
      type: "LoadBalancer",
      ports: [
        {
          port: 80,
          targetPort: 8080,
          name: 'http'
        }
      ],
      selector: hasuraLabels
    }
  },
  { provider: cluster.provider }
);

export const url = service.status.loadBalancer.ingress[0].hostname;
