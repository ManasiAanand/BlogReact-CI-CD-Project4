pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ManasiAanand/BlogReact-CI-CD-Project4.git'
            }
        }

        stage('Verify Project Structure') {
            steps {
                sh '''
                    echo "Checking Project 4 files..."
                    test -d frontend
                    test -d backend
                    test -d database
                    echo "All application folders found."
                '''
            }
        }
    }
}