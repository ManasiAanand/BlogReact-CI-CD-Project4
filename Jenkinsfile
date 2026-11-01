pipeline {
    agent any

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project Structure') {
            steps {
                sh '''
                    echo "Checking project structure..."
                    ls -la
                    ls -la frontend
                    ls -la backend
                '''
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=blogapp-project04 \
                            -Dsonar.projectName='Blog Application Project 04' \
                            -Dsonar.sources=frontend/src,backend/src
                        """
                    }
                }
            }
        }

        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t blogapp-frontend:${BUILD_NUMBER} ./frontend
                    docker build -t blogapp-backend:${BUILD_NUMBER} ./backend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    echo "Scanning frontend image..."
                    trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 blogapp-frontend:${BUILD_NUMBER}

                    echo "Scanning backend image..."
                    trivy image --scanners vuln --severity CRITICAL --exit-code 1 blogapp-backend:${BUILD_NUMBER}
                '''
            }
        }

        stage('Push Images to AWS ECR') {
            steps {
                sh '''
                    set -e

                    AWS_ACCOUNT_ID=057481081655
                    AWS_REGION=us-east-2
                    ECR_REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

                    echo "Logging in to AWS ECR..."
                    aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin ${ECR_REGISTRY}

                    echo "Tagging frontend image..."
                    docker tag blogapp-frontend:${BUILD_NUMBER} \
                        ${ECR_REGISTRY}/blogapp-frontend:build-${BUILD_NUMBER}

                    echo "Tagging backend image..."
                    docker tag blogapp-backend:${BUILD_NUMBER} \
                        ${ECR_REGISTRY}/blogapp-backend:build-${BUILD_NUMBER}

                    echo "Pushing frontend image..."
                    docker push ${ECR_REGISTRY}/blogapp-frontend:build-${BUILD_NUMBER}

                    echo "Pushing backend image..."
                    docker push ${ECR_REGISTRY}/blogapp-backend:build-${BUILD_NUMBER}

                    echo "Both images pushed successfully!"
                '''
            }
        }

        stage('Deploy to Amazon EKS') {
            steps {
                sh '''
                    set -e

                    AWS_REGION=us-east-2
                    CLUSTER_NAME=project04-eks
                    ECR_REGISTRY=057481081655.dkr.ecr.${AWS_REGION}.amazonaws.com

                    echo "Configuring EKS access..."
                    aws eks update-kubeconfig \
                        --region ${AWS_REGION} \
                        --name ${CLUSTER_NAME}

                    echo "Deploying frontend..."
                    kubectl set image deployment/blogapp-frontend \
                        frontend=${ECR_REGISTRY}/blogapp-frontend:build-${BUILD_NUMBER}

                    echo "Deploying backend..."
                    kubectl set image deployment/blogapp-backend \
                        backend=${ECR_REGISTRY}/blogapp-backend:build-${BUILD_NUMBER}

                    echo "Waiting for frontend rollout..."
                    kubectl rollout status deployment/blogapp-frontend --timeout=180s

                    echo "Waiting for backend rollout..."
                    kubectl rollout status deployment/blogapp-backend --timeout=180s

                    echo "EKS deployment completed successfully!"
                '''
            }
        }
    }
}
