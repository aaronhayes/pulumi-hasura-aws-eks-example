// Hasura Backend Plus
import * as k8s from "@pulumi/kubernetes";

import { cluster, namespaceName } from "./cluster";
import { secrets } from "./secrets";

const appName = "hbp";
const appLabels = { name: "hbp" };
const deployment = new k8s.apps.v1.Deployment(
  `${appName}`,
  {
    metadata: {
      name: "hbp",
      labels: appLabels,
      namespace: namespaceName
    },
    spec: {
      replicas: 1,
      selector: { matchLabels: appLabels },
      template: {
        metadata: {
          labels: appLabels
        },
        spec: {
          containers: [
            {
              name: appName,
              image: "nhost/hasura-backend-plus",
              ports: [
                {
                  name: "http",
                  containerPort: 4000
                }
              ],
              env: [
                {
                  name: "AUTH_LOCAL_ACTIVE",
                  value: "true"
                },
                {
                  name: "STORAGE_ACTIVE",
                  value: "false"
                },
                {
                  name: "HASURA_GRAPHQL_ENDPOINT",
                  value: "http://hasura/v1/graphql"
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
export const deploymentName = deployment.metadata.name;

export const service = new k8s.core.v1.Service(
  `${appName}`,
  {
    metadata: { name: "hbp", labels: appLabels, namespace: namespaceName },
    spec: {
      type: "LoadBalancer",
      ports: [
        {
          port: 80,
          targetPort: 4000,
          name: "http"
        }
      ],
      selector: appLabels
    }
  },
  { provider: cluster.provider }
);

// Export the URL for the load balanced service
export const url = service.status.loadBalancer.ingress[0].hostname;
