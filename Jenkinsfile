pipeline {
    agent any

    environment {
        AWS_REGION     = "ap-south-2"
        AWS_ACCOUNT_ID = "956959393819"
        ECR_REPO       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/eks-cicd"
        GIT_CREDENTIAL_ID = "git-creds"
        CLUSTER_NAME   = "eks-cicd-cluster"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/jo-parimal/eks-cicd-project.git',
                        credentialsId: "${GIT_CREDENTIAL_ID}"
                    ]]
                ])
            }
        }

        stage('Generate Version Tag') {
           steps {
              script {
                env.IMAGE_TAG = "v1.${BUILD_NUMBER}"
                echo "Image Tag: ${env.IMAGE_TAG}"
        }
    }
}

        stage('Build Docker Image') {
            steps {
                sh """
                docker build -t ${ECR_REPO}:${IMAGE_TAG} ./app
                """
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region ${AWS_REGION} | \
                docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                """
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh """
                docker push ${ECR_REPO}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to EKS') {
           steps {
               sh """
                aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
                kubectl apply -f k8s/
                kubectl set image deployment/eks-cicd-app eks-cicd-container=${ECR_REPO}:${IMAGE_TAG} -n default
                kubectl rollout status deployment/eks-cicd-app -n default
                """
          }
       }
    }
}
