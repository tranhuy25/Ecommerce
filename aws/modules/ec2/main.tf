resource "aws_instance" "app_instance" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id
  security_groups = [var.security_group_id]

  tags = {
    Name = var.instance_name
  }
}