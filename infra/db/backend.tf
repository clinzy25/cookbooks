terraform {
  backend "s3" {
    bucket = "cookbooks-tfstate"
    key    = "db/db.tfstate"
    region = "us-west-2"
  }
}
