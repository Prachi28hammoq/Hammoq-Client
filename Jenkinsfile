pipeline {
    agent any
    environment {
        PROJECT_ID = 'hammock-272305'
        CLUSTER_NAME = 'hammock-cluster'
        LOCATION = 'us-central1-c'
        CREDENTIALS_ID = 'testdev'
    }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }

        stage('Build image') {
            steps {
                script {
                    myapp = docker.build("gcr.io/hammock-272305/hammoq-client-dev")
                }
            }
        }
        // stage("Push image") {
        //     steps {
        //                 docker.withDockerRegistry(registry: [credentialsId: 'dockerhub']) { withRegistry('https://gcr.io', 'gcr:testdev') {
        //                     myapp.push("${env.BUILD_NUMBER}")
        //                     myapp.push("latest")
        //             }
        //     }
        // } 
        stage("Push image") {
            steps {
                 script {
                        docker.withRegistry('https://gcr.io', 'gcr:testdev') {
                            sh "docker push gcr.io/hammock-272305/hammoq-client-dev:latest"
                    }
                 }
            }
        } 
        stage('Deploy to GKE') {
            steps{
                sh "kubectl delete -f deployment.yaml"
                sh "kubectl delete -f service.yaml"
                sh "kubectl create -f deployment.yaml"
                sh "kubectl create -f service.yaml"
                //step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
            }
        }
    }    
}