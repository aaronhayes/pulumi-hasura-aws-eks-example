import { kubeconfig, urn as clusterUrn } from "./cluster";
import { urn as postgresUrn } from "./postgres";
import { urn as redisUrn } from "./redis";
import { url as hasuraUrl } from "./hasura";
import { url as nginxUrl } from "./nginx";
import { ingressAddress, ingressHostname } from "./ingress";

// Pulumi Stack Exports.
// Example usage:
// pulumi stack output kubeconfig > kubeconfig.json
export {
  nginxUrl,
  hasuraUrl,
  postgresUrn,
  clusterUrn,
  redisUrn,
  kubeconfig,
  ingressAddress,
  ingressHostname
};
