variable "domain" {
  type = string
}
variable "name" {
  type = string
}

resource "aws_ecr_repository" "ecr_repo" {
  name                 = var.name
  image_tag_mutability = "MUTABLE"

  tags = {
    Terraform = true
    Domain    = var.domain
  }
}

resource "aws_ecr_lifecycle_policy" "ecr_repo" {
  repository = aws_ecr_repository.ecr_repo.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "selection": {
        "tagStatus": "untagged",
        "countType": "imageCountMoreThan",
        "countNumber": 1
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}