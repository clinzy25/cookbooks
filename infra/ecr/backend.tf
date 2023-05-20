terraform {
  backend "s3" {
    bucket = "cookbooks-tfstate"
    key    = "ecr/ecr.tfstate"
    region = "us-west-2"
  }
}
