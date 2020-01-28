# Demo Kubernetes AWS Deployment Using Pulumi

Example on deploying [Hasura](https://hasura.io/) on AWS EKS using [Pulumi](https://www.pulumi.com/)

## Requirements

1. Install [Pulumi](https://www.pulumi.com/docs/get-started/install/)
2. Install [Helm](https://helm.sh/docs/intro/install/)

## Deployed Resources

- AWS VPC
- AWS ECR Container for [Hasura (with Migrations)](../hasura)
- AWS EKS Kubeternetes Cluster
- AWS RDS PostgreSQL Instance
  - No public access only access allowed from EKS Cluster using Securtiy Group.
- AWS ElasticCache Redis Instance
  - No public access only access allowed from EKS Cluster using Securtiy Group.

## Kubernetes Instances/Components

- Namespace
- Hasura Instance
- Hasura Backend Plus
- Secrets Including Postgres and Redis Connection details
- Nginx Ingress (Using Helm)

## Planned Features

- GitHub Actions
- Deployment of Dockerised Node App (using ECR) for Hasura Event Triggers
- Automatic SSL/certs

## Fun Instructions

1. `cd infrastructure`
2. `pulumi up`
3. `pulumi stack output kubeconfig > kubeconfigs/test.json`
4. `` KUBECONFIG=./kubeconfigs/test.json kubectl get pods --namespace=`pulumi stack output namespace` ``
5. `` KUBECONFIG=./kubeconfigs/test.json kubectl scale deployment/hasura --replicas=2 --namespace=`pulumi stack output namespace` ``

## Accessing services

1. `` KUBECONFIG=./kubeconfigs/test.json kubectl get ingresses --namespace=`pulumi stack output namespace` ``
2. `curl -H 'Host: graphql.pulumi.demo.com' <YOUR_INGRESS_ADDRESS>/healthz`
3. `curl -H 'Host: auth.pulumi.demo.com' <YOUR_INGRESS_ADDRESS>/healthz`

## Hasura Backend Plus Commands

### Register User

```bash
curl --location --request POST '<YOUR_INGRESS_ADDRESS>/auth/local/register' \
--header 'Host: auth.pulumi.demo.com' \
--header 'Content-Type: application/json' \
--header 'Cache-Control: no-cache' \
--data-raw '{
    "username": "testuser",
    "password": "testpassword"
}'
```

### Login User

```bash
curl --location --request POST '<YOUR_INGRESS_ADDRESS>/auth/local/login' \
--header 'Host: auth.pulumi.demo.com' \
--header 'Content-Type: application/json' \
--header 'Cache-Control: no-cache' \
--data-raw '{
    "username": "testuser",
    "password": "testpassword"
}'
```

## Bring Down Resources

1. `pulumi destroy --yes`
