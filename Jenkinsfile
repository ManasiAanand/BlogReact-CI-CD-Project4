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
