# Demo Kubernetes AWS Deployment Using Pulumi

Example on deploying [Hasura](https://hasura.io/) on AWS EKS using [Pulumi](https://www.pulumi.com/)

## Deployed Resources
- AWS VPC 
- AWS EKS Kubeternetes Cluster
- AWS RDS PostgreSQL Instance
  - No public access only access allowed from EKS Cluster using Securtiy Group.
- AWS ElasticCache Redis Instance
  - No public access only access allowed from EKS Cluster using Securtiy Group.

## Kubernetes Instances/Components
- Hasura Instance
- Nginx Sample app
- Secrets Including Postgres and Redis Connection details


## Instructions

1. `pulumi up`
2. `pulumi stack output kubeconfig > kubeconfigs/test.json`
3. `KUBECONFIG=./kubeconfigs/test.json kubectl get pods`
4. `curl $(pulumi stack output nginxUrl)`
4. `curl $(pulumi stack output hasuraUrl)/healthz`