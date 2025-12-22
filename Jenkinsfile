pipeline {
    agent any
    
    environment {
        // Application configuration
        PROJECT_NAME = 'zomato-app'
        
        // Docker configuration
        DOCKER_REGISTRY = 'docker.io'  // Change to AWS ECR in Phase 4
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        
        // AWS EC2 configuration
        EC2_HOST = '172.31.21.182'  // Private IP - Jenkins and app server in same VPC
        EC2_PUBLIC_IP = '107.21.240.12'  // Public IP for browser access
        EC2_USER = 'ubuntu'
        SSH_CREDENTIALS_ID = 'ec2-ssh-key'
        
        // Ansible configuration
        ANSIBLE_VAULT_CREDENTIALS_ID = 'ansible-vault-password'
        
        // OpenAI API Key (stored in Jenkins credentials)
        OPENAI_CREDENTIALS_ID = 'openai-api-key'
    }
    
    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Add timestamps to console output
        timestamps()
        
        // Timeout if build takes more than 30 minutes
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
                
                script {
                    // Get commit information
                    env.GIT_COMMIT_MSG = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()
                    env.GIT_AUTHOR = sh(
                        script: 'git log -1 --pretty=%an',
                        returnStdout: true
                    ).trim()
                }
                
                echo "📝 Commit: ${env.GIT_COMMIT_MSG}"
                echo "👤 Author: ${env.GIT_AUTHOR}"
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        echo '📦 Installing backend dependencies...'
                        dir('backend') {
                            sh '''
                                npm install
                            '''
                        }
                    }
                }
                
                stage('Frontend Dependencies') {
                    steps {
                        echo '📦 Installing frontend dependencies...'
                        dir('frontend') {
                            sh '''
                                npm install
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        echo '🧪 Running backend tests...'
                        dir('backend') {
                            sh '''
                                # TODO: Add actual tests when available
                                # npm test
                                echo "Backend tests passed (placeholder)"
                            '''
                        }
                    }
                }
                
                stage('Frontend Tests') {
                    steps {
                        echo '🧪 Running frontend tests...'
                        dir('frontend') {
                            sh '''
                                # TODO: Add actual tests when available
                                # npm test
                                echo "Frontend tests passed (placeholder)"
                            '''
                        }
                    }
                }
                
                stage('Lint Code') {
                    steps {
                        echo '🔍 Linting code...'
                        sh '''
                            # TODO: Add linting when configured
                            # npm run lint
                            echo "Code linting passed (placeholder)"
                        '''
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                script {
                    // Build backend image
                    sh '''
                        cd backend
                        docker build -t ${PROJECT_NAME}-backend:${BUILD_NUMBER} .
                        docker tag ${PROJECT_NAME}-backend:${BUILD_NUMBER} ${PROJECT_NAME}-backend:latest
                    '''
                    
                    // Build frontend image with correct API URL
                    sh """
                        cd frontend
                        docker build \
                            --build-arg VITE_API_BASE=http://${EC2_PUBLIC_IP}:4000 \
                            -t ${PROJECT_NAME}-frontend:${BUILD_NUMBER} .
                        docker tag ${PROJECT_NAME}-frontend:${BUILD_NUMBER} ${PROJECT_NAME}-frontend:latest
                    """
                }
                echo '✅ Docker images built successfully'
            }
        }
        
        stage('Push to Registry') {
            when {
                // Only push to registry on main branch
                branch 'main'
            }
            steps {
                echo '📤 Pushing images to Docker registry...'
                script {
                    // TODO: Uncomment when Docker Hub credentials are configured
                    /*
                    docker.withRegistry("https://${DOCKER_REGISTRY}", DOCKER_CREDENTIALS_ID) {
                        sh '''
                            docker push ${PROJECT_NAME}-backend:${BUILD_NUMBER}
                            docker push ${PROJECT_NAME}-backend:latest
                            docker push ${PROJECT_NAME}-frontend:${BUILD_NUMBER}
                            docker push ${PROJECT_NAME}-frontend:latest
                        '''
                    }
                    */
                    echo "⏭️  Skipping Docker registry push (configure credentials first)"
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                echo '🚀 Deploying to AWS EC2...'
                
                script {
                    // Use SSH credentials and OpenAI API key for deployment
                    withCredentials([
                        sshUserPrivateKey(credentialsId: SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY'),
                        string(credentialsId: OPENAI_CREDENTIALS_ID, variable: 'OPENAI_API_KEY')
                    ]) {
                        sh '''
                            cd ansible
                            
                            # Test SSH connection first
                            echo "Testing SSH connection to app server..."
                            ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -i "$SSH_KEY" ubuntu@${EC2_HOST} "echo 'SSH connection successful'" || {
                                echo "ERROR: Cannot connect to app server"
                                exit 1
                            }
                            
                            # Ensure Ansible is installed
                            which ansible-playbook || {
                                echo "Installing Ansible..."
                                pip3 install ansible
                            }
                            
                            # Run deployment playbook with SSH key and OpenAI API key
                            OPENAI_API_KEY="${OPENAI_API_KEY}" ansible-playbook \
                                -i inventory \
                                deploy.yml \
                                --private-key="$SSH_KEY" \
                                --extra-vars "EC2_PUBLIC_IP=${EC2_PUBLIC_IP}" \
                                -v
                        '''
                    }
                }
                
                echo '✅ Deployment completed successfully'
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Performing health checks...'
                script {
                    sh """
                        # Wait for services to start
                        sleep 10
                        
                        # Check frontend
                        echo "Checking frontend..."
                        curl -f http://${EC2_PUBLIC_IP}:3000 || exit 1
                        
                        # Check backend
                        echo "Checking backend API..."
                        curl -f http://${EC2_PUBLIC_IP}:4000/api/restaurants || exit 1
                        
                        echo "✅ All health checks passed!"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '🎉 Pipeline completed successfully!'
            // TODO: Add Slack/email notifications when configured
        }
        
        failure {
            echo '❌ Pipeline failed!'
            // TODO: Add Slack/email notifications when configured
        }
        
        always {
            echo '🧹 Cleaning up...'
            // Clean up workspace
            cleanWs()
        }
    }
}
