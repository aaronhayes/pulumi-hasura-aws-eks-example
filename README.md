# Demo Kubernetes AWS Deployment Using Pulumi

Example on deploying [Hasura](https://hasura.io/) on AWS EKS using [Pulumi](https://www.pulumi.com/)

## Requirements

1. Install [Pulumi](https://www.pulumi.com/docs/get-started/install/)
2. Install [Helm](https://helm.sh/docs/intro/install/)

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
- Nginx Ingress (Using Helm)

## Planned Features

- GitHub Actions
- Deployment of Dockerised Node App (using ECR) for Hasura Event Triggers
- Deployment of Hasura Backend Plus for Authentication

## Fun Instructions

1. `cd infrastructure`
2. `pulumi up`
3. `pulumi stack output kubeconfig > kubeconfigs/test.json`
4. `KUBECONFIG=./kubeconfigs/test.json kubectl get pods`
5. `KUBECONFIG=./kubeconfigs/test.json kubectl scale deployment/hasura --replicas=2`

## Accessing services

1. `KUBECONFIG=./kubeconfigs/test.json kubectl get ingresses`
2. `curl -H 'Host: graphql.pulumi.demo.com' <YOUR_INGRESS_ADDRESS>/healthz`
3. `curl -H 'Host: nginx.pulumi.demo.com' <YOUR_INGRESS_ADDRESS>`

## Bring Down Resources

1. `pulumi destroy --yes`
