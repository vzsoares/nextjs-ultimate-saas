locals {
  region     = "us-east-1"
  account_id = "355738159777"
  stage      = "prod"
  domain     = "next-saas"
}

# Registries
module "single_repo" {
  source = "./modules/ecr"
  name   = "${local.domain}/single"
  domain = local.domain
}

module "instance_foo_repo" {
  source = "./modules/ecr"
  name   = "${local.domain}/instance-foo"
  domain = local.domain
}

module "instance_baz_repo" {
  source = "./modules/ecr"
  name   = "${local.domain}/instance-baz"
  domain = local.domain
}

module "instance_bar_repo" {
  source = "./modules/ecr"
  name   = "${local.domain}/instance-bar"
  domain = local.domain
}

# Instances
module "instance_single" {
  source        = "./modules/ec2"
  domain        = local.domain
  name          = "next-saas-single"
  key_pair_name = "next-saas-ssh"
  instance_identity_type = {
    Type = "single"
  }
  instance_identity_client = null
}
