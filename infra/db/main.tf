locals {
  project       = "cookbooks"
  region        = "us-west-2"
  ami           = "ami-06e85d4c3149db26a"
  backend_sg_id = "sg-062a78c82cb628c90"
  multi_az      = false
}

data "aws_vpc" "cookbooks_vpc" {
  filter {
    name   = "tag:Name"
    values = ["cookbooks-vpc"] # insert values here
  }
}

data "aws_subnet" "bastion_subnet" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.cookbooks_vpc.id]
  }
  filter {
    name   = "tag:Name"
    values = ["*public-1*"] # insert values here
  }
}

resource "aws_kms_key" "db_key" {
  description  = "Db encryption key"
  multi_region = true
}

resource "aws_db_instance" "cookbooks_db" {
  identifier                      = "${local.project}-db"
  db_name                         = "Cookbooks"
  engine                          = "postgres"
  engine_version                  = "13.7"
  instance_class                  = "db.t3.micro"
  username                        = "postgres"
  password                        = var.db_password
  allocated_storage               = 20
  max_allocated_storage           = 22
  final_snapshot_identifier       = "${local.project}-db-snapshot"
  db_subnet_group_name            = "${local.project}-rds-subnet-group"
  skip_final_snapshot             = false
  performance_insights_enabled    = true
  multi_az                        = local.multi_az
  performance_insights_kms_key_id = aws_kms_key.db_key.arn
  storage_encrypted               = true
  kms_key_id                      = aws_kms_key.db_key.arn
  vpc_security_group_ids          = [aws_security_group.rds_sg.id]
}

resource "aws_security_group" "bastion" {
  name        = "rds-bastion"
  description = "Allow SSH from local dev"
  vpc_id      = data.aws_vpc.cookbooks_vpc.id

  ingress {
    description = "SSH from local dev"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Postgres from local dev"
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.project
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "${local.project}-rds"
  description = "Allow bastion access"
  vpc_id      = data.aws_vpc.cookbooks_vpc.id

  ingress {
    description     = "Inbound postgres from bastion"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "Inbound SSL from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = local.project
  }
}

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "bastion_key_pair" {
  key_name   = "${local.project}-bastion"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "../../${aws_key_pair.bastion_key_pair.key_name}.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

resource "aws_instance" "cookbooks_bastion_server" {
  ami                         = local.ami
  instance_type               = "t2.micro"
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.bastion.id]
  key_name                    = aws_key_pair.bastion_key_pair.key_name
  subnet_id                   = data.aws_subnet.bastion_subnet.id
  hibernation                 = true
  
  root_block_device {
    encrypted = true
  }
  tags = {
    Name = "${local.project}-rds-bastion"
  }
}

resource "aws_eip" "rds_bastion_eip" {
  instance = aws_instance.cookbooks_bastion_server.id
  vpc      = true
}
