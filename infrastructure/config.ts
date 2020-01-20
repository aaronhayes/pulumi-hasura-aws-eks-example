import * as pulumi from "@pulumi/pulumi";
import { Config } from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as k8s from "@pulumi/kubernetes";

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
export const POSTGRES_DB_NAME = config.get("POSTGRES_DB_NAME") || 'app';
export const POSTGRES_USERNAME = config.get("POSTGRES_USERNAME") || 'postgres';
export const POSTGRES_PASSWORD = PG_PASSWORD;

// Kubernetes Config
export const CLUSTER_NODE_COUNT = config.getNumber("CLUSTER_NODE_COUNT") || 2;
export const CLUSTER_NODE_INSTANCE_TYPE: INSTANCE_TYPE =
  config.get("CLUSTER_NODE_INSTANCE_TYPE") || "t2.small";
