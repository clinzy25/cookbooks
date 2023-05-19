terraform {
  backend "s3" {
    bucket = "cookbooks-tfstate"
    key    = "vpc/vpc.tfstate"
    region = "us-west-2"
  }
}
