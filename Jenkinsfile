pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Verify Project Structure') {
            steps {
                sh '''
                    test -d frontend
                    test -d backend
                    test -d database
                    echo "All application folders found."
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

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t blogapp-frontend:${BUILD_NUMBER} ./frontend
                    docker build -t blogapp-backend:${BUILD_NUMBER} ./backend
                '''
            }
        }
    }
}
