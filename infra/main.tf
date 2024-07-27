locals {
  region     = "us-east-1"
  account_id = "355738159777"
  stage      = "prod"
  domain     = "next-saas"
}

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

