# Terraform version and AWS provider configuration
# This sets up the AWS provider for infrastructure provisioning

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # TODO: Uncomment and configure when ready to use remote state
  # backend "s3" {
  #   bucket         = "zomato-terraform-state"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

provider "aws" {
  region = var.aws_region
  
  # TODO: Configure AWS credentials via:
  # 1. AWS CLI: aws configure
  # 2. Environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  # 3. IAM role (recommended for EC2/CI instances)
  
  default_tags {
    tags = {
      Project     = "Zomato-DevOps"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
