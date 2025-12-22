# Jenkins EC2 Instance - CI/CD Server
# Dedicated instance for running Jenkins pipelines

resource "aws_instance" "Jenkins" {
  ami                    = var.ami_id
  instance_type          = var.jenkins_instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.jenkins_sg.id]

  # Root volume configuration
  root_block_device {
    volume_size           = 30  # GB - Jenkins needs more space for builds
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  # User data script - runs on first boot
  # Installs basic tools and Docker
  user_data = <<-EOF
              #!/bin/bash
              set -e
              
              # Update system
              apt-get update -y
              apt-get upgrade -y
              
              # Install dependencies
              apt-get install -y \
                apt-transport-https \
                ca-certificates \
                curl \
                gnupg \
                lsb-release \
                git \
                unzip \
                python3-pip \
                openjdk-17-jdk
              
              # Install Docker
              curl -fsSL https://get.docker.com -o get-docker.sh
              sh get-docker.sh
              
              # Start and enable Docker
              systemctl start docker
              systemctl enable docker
              
              # Add ubuntu user to docker group
              usermod -aG docker ubuntu
              
              # Install Docker Compose V2
              mkdir -p /usr/local/lib/docker/cli-plugins
              curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 \
                -o /usr/local/lib/docker/cli-plugins/docker-compose
              chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
              
              # Install Node.js (for building frontend/backend)
              curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
              apt-get install -y nodejs
              
              # Install Ansible
              apt-get install -y ansible
              
              # Log completion
              echo "Setup completed at $(date)" > /var/log/user-data.log
              EOF

  # Metadata options for IMDSv2
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-jenkins"
    Role = "Jenkins-CI-CD"
  }
}

# Elastic IP for Jenkins - Static public IP
resource "aws_eip" "Jenkins" {
  instance = aws_instance.Jenkins.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-jenkins-eip"
  }

  depends_on = [aws_internet_gateway.main]
}
