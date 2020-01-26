import * as k8s from "@pulumi/kubernetes";

import { cluster, namespaceName } from "./cluster";
import * as config from "./config";

// Secrets need to be in base64 encoding
const adminSecret = config.HASURA_GRAPHQL_ADMIN_SECRET.result.apply(secret =>
  Buffer.from(secret).toString("base64")
);

const jwtSecret = config.HASURA_GRAPHQL_JWT_SECRET.apply(secret =>
  Buffer.from(secret).toString("base64")
);

// Create secrets
export const secrets = new k8s.core.v1.Secret(
  "hasura-secrets",
  {
    metadata: {
      namespace: namespaceName
    },
    data: {
      hasuraGraphqlAdminSecret: adminSecret,
      hasuraGraphqlJWTSecret: jwtSecret
    }
  },
  { provider: cluster.provider }
);
