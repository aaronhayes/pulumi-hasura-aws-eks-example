import * as k8s from "@pulumi/kubernetes";

import { service as hasuraService } from "./hasura";
import { service as hbpService } from "./hbp";

import * as config from "./config";
import { cluster, namespaceName } from "./cluster";

// Install Nginx

// Deploy the NGINX ingress controller using the Helm chart.
const nginx = new k8s.helm.v2.Chart(
  "nginx",
  {
    chart: "nginx-ingress",
    version: "1.24.4",
    namespace: namespaceName,
    fetchOpts: { repo: "https://kubernetes-charts.storage.googleapis.com/" },
    values: { controller: { publishService: { enabled: true } } }
  },
  { providers: { kubernetes: cluster.provider } }
);

export const ingress = new k8s.networking.v1beta1.Ingress(
  `${config.PROJECT_NAME}-ingress`,
  {
    metadata: {
      labels: {
        app: "ingress"
      },
      namespace: namespaceName,
      annotations: { "kubernetes.io/ingress.class": "nginx" }
    },
    spec: {
      rules: [
        {
          host: "graphql.pulumi.demo.com",
          http: {
            paths: [
              {
                path: "/",
                backend: {
                  serviceName: hasuraService.metadata.name,
                  servicePort: 80
                }
              }
            ]
          }
        },
        {
          host: "auth.pulumi.demo.com",
          http: {
            paths: [
              {
                path: "/",
                backend: {
                  serviceName: hbpService.metadata.name,
                  servicePort: 80
                }
              }
            ]
          }
        }
      ]
    }
  },
  { provider: cluster.provider }
);

export const ingressHostname = ingress.status.loadBalancer.ingress[0].hostname;
export const ingressAddress = ingress.status.loadBalancer.ingress[0].ip;

