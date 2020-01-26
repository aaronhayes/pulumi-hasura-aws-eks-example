import {
  kubeconfig,
  urn as clusterUrn,
  namespaceName as namespace
} from "./cluster";
import { urn as postgresUrn } from "./postgres";
import { urn as redisUrn } from "./redis";
import { url as hasuraUrl } from "./hasura";
import { ingressAddress, ingressHostname } from "./ingress";

// Pulumi Stack Exports.
// Example usage:
// pulumi stack output kubeconfig > kubeconfig.json
export {
  hasuraUrl,
  postgresUrn,
  clusterUrn,
  redisUrn,
  kubeconfig,
  namespace,
  ingressAddress,
  ingressHostname
};
