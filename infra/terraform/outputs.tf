# Outputs - Important values to use after terraform apply
# These will be displayed and can be queried with: terraform output

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.-app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance (Elastic IP)"
  value       = aws_eip.app_server.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.app_server.id
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.pp-server.public_ip}"
}

output "frontend_url" {
  description = "URL to access the frontend application"
  value       = "http://${aws_eip.app_server.public_ip}:3000"
}

output "backend_url" {
  description = "URL to access the backend API"
  value       = "http://${aws_eip.app_server.public_ip}:4000"
}

# Output for Ansible inventory
output "ansible_inventory" {
  description = "Ansible inventory format"
  value       = <<-EOT
    [app_servers]
    zomato-server ansible_host=${aws_eip.app_server.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/${var.key_name}.pem
    
    [jenkins_servers]
    jenkins-server ansible_host=${aws_eip.Jenkins.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/${var.key_name}.pem
  EOT
}

# Jenkins Server Outputs
output "jenkins_instance_id" {
  description = "ID of the Jenkins EC2 instance"
  value       = aws_instance.Jenkins.id
}

output "jenkins_public_ip" {
  description = "Public IP address of Jenkins server"
  value       = aws_eip.Jenkins.public_ip
}

output "jenkins_public_dns" {
  description = "Public DNS name of Jenkins server"
  value       = aws_instance.Jenkins.public_dns
}

output "jenkins_url" {
  description = "URL to access Jenkins web interface"
  value       = "http://${aws_eip.Jenkins.public_ip}:8080"
}

output "jenkins_ssh_command" {
  description = "SSH command to connect to Jenkins server"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.Jenkins.public_ip}"
}
