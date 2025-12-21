# EC2 Instance - Main application server
# Runs Docker containers for frontend, backend, and database

resource "aws_instance" "app_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_server.id]

  # Root volume configuration
  root_block_device {
    volume_size           = 30  # GB
    volume_type           = "gp3"
    delete_on_termination = true
    encrypted             = true
  }

  # User data script - runs on first boot
  # Installs Docker, docker-compose, and basic tools
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
                unzip
              
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
              
              # Create application directory
              mkdir -p /home/ubuntu/app
              chown ubuntu:ubuntu /home/ubuntu/app
              
              # Log completion
              echo "Setup completed at $(date)" > /var/log/user-data.log
              EOF

  # Metadata options for IMDSv2 (security best practice)
  metadata_options {
    http_endpoint               = "enabled"
    http_tokens                 = "required"
    http_put_response_hop_limit = 1
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-server"
  }
}

# Elastic IP - Static public IP for the instance
# Useful for DNS and consistent access
resource "aws_eip" "app_server" {
  instance = aws_instance.app_server.id
  domain   = "vpc"

  tags = {
    Name = "${var.project_name}-${var.environment}-eip"
  }

  # Ensure EIP is created after internet gateway
  depends_on = [aws_internet_gateway.main]
}
