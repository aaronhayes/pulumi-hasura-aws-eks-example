import * as k8s from "@pulumi/kubernetes";

import * as config from "./config";
import { cluster } from "./cluster";

const appName = "my-nginx-demo";
const appLabels = { env: config.APP_CLASS };
const deployment = new k8s.apps.v1.Deployment(
  `${appName}-deployment`,
  {
    metadata: {
      labels: appLabels
    },
    spec: {
      replicas: 2,
      selector: { matchLabels: appLabels },
      template: {
        metadata: {
          labels: appLabels
        },
        spec: {
          containers: [
            {
              name: appName,
              image: "nginx",
              ports: [
                {
                  name: "http",
                  containerPort: 80
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

const service = new k8s.core.v1.Service(
  `${appName}-svc`,
  {
    metadata: { labels: appLabels },
    spec: {
      type: "LoadBalancer",
      ports: [
        {
          port: 80,
          targetPort: "http"
        }
      ],
      selector: appLabels
    }
  },
  { provider: cluster.provider }
);

// Export the URL for the load balanced service
export const url = service.status.loadBalancer.ingress[0].hostname;
