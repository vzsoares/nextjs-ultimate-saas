variable "name" {
  type = string
}
variable "key_pair_name" {
  type = string
}
variable "domain" {
  type = string
}
variable "stage" {
  type = string
}
# identity is required so that ansible finds the instance
variable "instance_identity_type" {
  type = object({ Type = string })
}
variable "instance_identity_client" {
  type     = object({ Client = string })
  nullable = true
}

resource "aws_instance" "instance" {
  key_name      = var.key_pair_name
  instance_type = "t2.micro"
  ami           = "ami-04a81a99f5ec58529"

  subnet_id                   = "subnet-053d70e46696acd4f"
  associate_public_ip_address = true

  tags = merge({
    Terraform = "true"
    Domain    = var.domain
    Name      = var.name
    Stage     = var.stage
  }, var.instance_identity_type, var.instance_identity_client)
}

output "public_dns" {
  value = aws_instance.instance.public_dns
}
output "id" {
  value = aws_instance.instance.id
}
