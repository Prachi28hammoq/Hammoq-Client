pipeline {
    agent any
    environment {
        PROJECT_ID = 'hammock-272305'
        LOCATION = 'us-central1-c'
        CREDENTIALS_ID = 'testdev'
        BUCKET = 'hammoq-client'
        PATTERN = '**'
    }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }

        stage('Build Project') {
            steps {
                script {
                    sh 'npm run recycledcomponents'
                    sh 'npm install'
                    //sh 'npm install react-scripts'
                    sh "REACT_APP_NAME=APP REACT_APP_STAGE=devhost REACT_APP_STRIPE=pk_test_lC5HYE8HU7h3YulsALN8XO0Y00QcNkc02w CI=false react-scripts build"
                }
            }
        }
        stage('Store to GCS') {
            steps{
            sh script:'''
                #!/bin/bash
                echo "This is start $(pwd)"
                cd ./build
                echo "This is $(pwd)"
            '''
                // If we name pattern build_environment.txt, this will upload the local file to our GCS bucket.
                step([$class: 'ClassicUploadStep', credentialsId: env
                        .CREDENTIALS_ID,  bucket: "gs://${env.BUCKET}/",
                      pattern: env.PATTERN])
            }
        }
    }    
}