# Variables for customizing the Zomato infrastructure
# Override these in terraform.tfvars or via -var flags

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "zomato"
}

variable "instance_type" {
  description = "EC2 instance type for application server"
  type        = string
  default     = "t3.micro"
}

variable "jenkins_instance_type" {
  description = "EC2 instance type for Jenkins server"
  type        = string
  default     = "t3.micro"  # Jenkins needs more resources (2 vCPU, 2GB RAM)
}

variable "ami_id" {
  description = "AMI ID for EC2 instance (Ubuntu 22.04 LTS in us-east-1)"
  type        = string
  # TODO: Update this AMI ID for your region if different
  # This is Ubuntu 22.04 LTS for us-east-1
  # Find latest: aws ec2 describe-images --owners 099720109477 --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId'
  default     = "ami-03deb8c961063af8c"
}

variable "key_name" {
  description = "EC2 Key Pair name for SSH access"
  type        = string
  # TODO: Create an EC2 key pair in AWS Console or via CLI:
  # aws ec2 create-key-pair --key-name zomato-deploy-key --query 'KeyMaterial' --output text > zomato-deploy-key.pem
  # chmod 400 zomato-deploy-key.pem
  default     = "fullstack-cicd"
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed to SSH into EC2 instance"
  type        = list(string)
  # Allowing from anywhere for easier access - restrict in production
  # Your current IP: 128.185.168.216/32
  default     = ["0.0.0.0/0"]
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}
