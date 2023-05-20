locals {
  project          = "cookbooks"
  region           = "us-west-2"
}


resource "aws_ecr_repository" "ecr_client" {
  name                 = "${local.project}/client"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "ecr_server" {
  name                 = "${local.project}/server"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}
