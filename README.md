# Marginal — Blog Application on Amazon EKS

A three-tier blog application built using **React, Node.js/Express, and MySQL**, deployed on **Amazon EKS** through an automated Jenkins CI/CD pipeline.

The project demonstrates containerization, automated code quality analysis, security scanning, AWS ECR image management, Kubernetes deployment, persistent storage, and network security.

## Architecture

```text
                    Users / Browser
                           |
                           v
                  AWS LoadBalancer
                           |
                           v
                 Frontend Service
                 React + Nginx
                 Port 80 / 8080
                           |
                           v
                  Backend Service
                 Node.js / Express
                     Port 5000
                           |
                           v
                   MySQL Service
                     Port 3306
                           |
                           v
                  MySQL Persistent
                     Volume (EBS)
```

### CI/CD Workflow

```text
GitHub Repository
       |
       v
     Jenkins
       |
       v
  Checkout SCM
       |
       v
 Verify Project Structure
       |
       v
 Install Dependencies
       |
       v
 Build Frontend
       |
       v
 Lint Code
       |
       v
 Test Backend
       |
       v
 SonarQube Analysis
       |
       v
 SonarQube Quality Gate
       |
       v
 Build Docker Images
       |
       v
 Trivy Security Scan
       |
       v
 Push Images to AWS ECR
       |
       v
 Deploy to Amazon EKS
```

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React, Nginx |
| Backend | Node.js, Express |
| Database | MySQL 8.0 |
| Source Control | Git, GitHub |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Security Scanning | Trivy |
| Containerization | Docker |
| Container Registry | Amazon ECR |
| Container Orchestration | Amazon EKS |
| Infrastructure | AWS |
| Storage | EBS Persistent Volume |
| Monitoring | Kubernetes Metrics Server |
| Security | Kubernetes NetworkPolicies |

## AWS Infrastructure

- Amazon EKS cluster: `project04-eks`
- AWS Region: `us-east-2`
- Amazon ECR repositories:
  - `blogapp-frontend`
  - `blogapp-backend`
- EKS worker node: EC2 t3.medium
- EBS-backed persistent storage for MySQL
- Frontend exposed using Kubernetes LoadBalancer service.
- Backend and MySQL exposed internally using ClusterIP services.

## Kubernetes Deployment

The application runs in the `default` namespace.

| Component | Deployment | Replicas |
|---|---|---:|
| Frontend | blogapp-frontend | 1 |
| Backend | blogapp-backend | 1 |
| MySQL | mysql | 1 |

### Kubernetes Services

- `frontend-service`: LoadBalancer, port 80
- `backend-service`: ClusterIP, port 5000
- `mysql-service`: ClusterIP, port 3306

### Health Checks

- Frontend: HTTP readiness and liveness probes on port 8080.
- Backend: `/readyz` readiness probe and `/healthz` liveness probe.
- MySQL: `mysqladmin ping` readiness and liveness probes.

### Resource Management

Frontend and backend containers have CPU and memory requests and limits configured.

## Database Persistence

MySQL uses an AWS EBS-backed PersistentVolumeClaim.

| Configuration | Value |
|---|---|
| Database | MySQL 8.0 |
| Database name | blogdb |
| PVC | mysql-pvc |
| Storage | 5 GiB |
| Storage Class | gp2 |
| Access Mode | ReadWriteOnce |
| Mount Path | /var/lib/mysql |

Database credentials are provided through Kubernetes Secrets.

The persistent volume's reclaim policy is configured as `Retain`.

Database persistence was verified by replacing the MySQL pod and confirming that existing application data remained available.

## Security Implementation

- Multi-stage Docker builds.
- Non-root container execution.
- Docker image security scanning using Trivy.
- Code quality analysis using SonarQube.
- Kubernetes Secrets for sensitive application credentials.
- Frontend and backend service-account token automount disabled.
- Kubernetes NetworkPolicies restrict:
  - Frontend-to-backend ingress on TCP port 5000.
  - Backend-to-MySQL ingress on TCP port 3306.
- Application containers use configured resource requests and limits.

## Monitoring

Kubernetes Metrics Server is installed and operational.

It provides:
- Node CPU and memory utilization.
- Pod CPU and memory utilization.
- Resource usage through `kubectl top`.

Prometheus and Grafana are not currently installed. Centralized logging is also a planned enhancement.

## Jenkins CI/CD Pipeline

The Jenkins pipeline contains 12 stages:

1. Checkout SCM
2. Verify Project Structure
3. Install Dependencies
4. Build Frontend
5. Lint Code
6. Test Backend
7. SonarQube Code Analysis
8. SonarQube Quality Gate
9. Build Docker Images
10. Trivy Security Scan
11. Push Images to AWS ECR
12. Deploy to Amazon EKS

Docker images are tagged dynamically using the Jenkins build number:

```text
build-${BUILD_NUMBER}
```

The pipeline updates the frontend and backend Kubernetes deployments with the corresponding ECR images and waits for successful rollouts.

## Repository Structure

```text
BlogReact-CI-CD-Project4/
├── backend/
├── frontend/
├── database/
├── k8s/
│   ├── backend.yaml
│   ├── frontend.yaml
│   ├── mysql.yaml
│   └── mysql-deployment.yaml
├── Jenkinsfile
├── sonar-project.properties
├── .dockerignore
└── README.md
```

## Useful Kubernetes Commands

Check application pods:

```bash
kubectl get pods -n default
```

Check deployments:

```bash
kubectl get deployments -n default
```

Check services:

```bash
kubectl get services -n default
```

Check NetworkPolicies:

```bash
kubectl get networkpolicies -n default
```

Check persistent storage:

```bash
kubectl get pvc -n default
kubectl get pv
```

Check node resource utilization:

```bash
kubectl top nodes
```

Check pod resource utilization:

kubectl top pods -n default

Project Outcome

Successfully implemented an automated CI/CD workflow for a containerized three-tier blog application on Amazon EKS.

The project demonstrates practical experience with Jenkins pipeline automation, Docker image hardening, SonarQube quality analysis, Trivy security scanning, Amazon ECR, Kubernetes deployments, persistent database storage, health probes, and network security.

Future Enhancements

Prometheus and Grafana monitoring.

Centralized application logging.

Horizontal Pod Autoscaling.

High-availability database architecture.

AWS Load Balancer Controller and Ingress configuration.

Automated infrastructure provisioning using Terraform.
