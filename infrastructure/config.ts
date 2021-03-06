import * as pulumi from "@pulumi/pulumi";
import { Config } from "@pulumi/pulumi";
import * as random from "@pulumi/random";

type INSTANCE_TYPE = "t2.micro" | "t2.small" | "t2.medium" | "t2.large";

const config = new Config();

// Defaults
export const PROJECT_NAME = pulumi.getProject();
const PG_PASSWORD = new random.RandomPassword(`${PROJECT_NAME}-password`, {
  length: 19,
  overrideSpecial: "_%@",
  special: false
}).result;
export const APP_CLASS = pulumi.getStack();

// PostgreSQL Config
export const POSTGRES_DB_NAME = config.get("POSTGRES_DB_NAME") || "app";
export const POSTGRES_USERNAME = config.get("POSTGRES_USERNAME") || "postgres";
export const POSTGRES_PASSWORD = PG_PASSWORD;
export const POSTGRES_INSTANCE_TYPE =
  config.get("POSTGRES_INSTANCE_TYPE") || "db.t2.small";

// Hasura Config
const HASURA_SECRET = new random.RandomPassword(
  `${PROJECT_NAME}-hasura-secret`,
  {
    length: 13,
    overrideSpecial: "_%@#",
    special: false
  }
);
export const HASURA_GRAPHQL_ADMIN_SECRET = HASURA_SECRET;
export const HASURA_GRAPHQL_ENABLE_TELEMERTY =
  config.get("HASURA_GRAPHQL_ENABLE_TELEMERTY") || "false";
export const HASURA_GRAPHQL_ENABLE_CONSOLE =
  config.get("HASURA_GRAPHQL_ENABLE_CONSOLE") || "false";

const JWT_SECRET = new random.RandomPassword(`${PROJECT_NAME}-JWT-secret`, {
  length: 35,
  overrideSpecial: "_%@#",
  special: false
});

export const HASURA_GRAPHQL_JWT_SECRET = JWT_SECRET.result.apply(
  secret => `{ "type": "HS256", "key": "${secret}" }`
);

// Kubernetes Config
export const CLUSTER_NODE_COUNT = config.getNumber("CLUSTER_NODE_COUNT") || 2;
export const CLUSTER_NODE_INSTANCE_TYPE: INSTANCE_TYPE =
  config.get("CLUSTER_NODE_INSTANCE_TYPE") || "t2.small";
