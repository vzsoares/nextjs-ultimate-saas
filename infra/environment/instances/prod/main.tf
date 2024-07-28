locals {
  region     = "us-east-1"
  account_id = "355738159777"
  stage      = "prod"
  domain     = "next-saas"
}

##### Registries #####
# instances
module "instance_foo_repo" {
  source = "../../../modules/ecr"
  name   = "${local.domain}/instance-foo"
  domain = local.domain
  stage  = local.stage
}
module "instance_baz_repo" {
  source = "../../../modules/ecr"
  name   = "${local.domain}/instance-baz"
  domain = local.domain
  stage  = local.stage
}
module "instance_bar_repo" {
  source = "../../../modules/ecr"
  name   = "${local.domain}/instance-bar"
  domain = local.domain
  stage  = local.stage
}

##### Instances #####
# instances
module "instance_foo" {
  source        = "../../../modules/ec2"
  domain        = local.domain
  stage         = local.stage
  name          = "next-saas-instance-foo"
  key_pair_name = "next-saas-ssh"
  instance_identity_type = {
    Type = "instance"
  }
  instance_identity_client = {
    Client = "foo"
  }
}
module "instance_baz" {
  source        = "../../../modules/ec2"
  stage         = local.stage
  domain        = local.domain
  name          = "next-saas-instance-baz"
  key_pair_name = "next-saas-ssh"
  instance_identity_type = {
    Type = "instance"
  }
  instance_identity_client = {
    Client = "baz"
  }
}
module "instance_bar" {
  source        = "../../../modules/ec2"
  stage         = local.stage
  domain        = local.domain
  name          = "next-saas-instance-bar"
  key_pair_name = "next-saas-ssh"
  instance_identity_type = {
    Type = "instance"
  }
  instance_identity_client = {
    Client = "bar"
  }
}

##### Distributions #####
# instance
module "distribution_instance_foo" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_foo.public_dns
  client_header_value = "foo"
  cname_dns           = "next-saas-instance-foo.zenhalab.com"
  description         = "next-saas-single-foo"
}
module "distribution_instance_baz" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_baz.public_dns
  client_header_value = "baz"
  cname_dns           = "next-saas-instance-baz.zenhalab.com"
  description         = "next-saas-single-baz"
}
module "distribution_instance_bar" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_bar.public_dns
  client_header_value = "bar"
  cname_dns           = "next-saas-instance-bar.zenhalab.com"
  description         = "next-saas-single-bar"
}

