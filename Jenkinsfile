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
    }
}
