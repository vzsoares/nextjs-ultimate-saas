locals {
  region     = "us-east-1"
  account_id = "355738159777"
  stage      = "prod"
  domain     = "next-saas"
}

##### Registries #####
# single
module "single_repo" {
  source = "../../../modules/ecr"
  name   = "${local.domain}/single"
  domain = local.domain
  stage  = local.stage
}

##### Instances #####
# single
module "instance_single" {
  source        = "../../../modules/ec2"
  domain        = local.domain
  stage         = local.stage
  name          = "next-saas-single"
  key_pair_name = "next-saas-ssh"
  instance_identity_type = {
    Type = "single"
  }
  instance_identity_client = null
}

##### Distributions #####
# single
module "distribution_single_foo" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_single.public_dns
  client_header_value = "foo"
  cname_dns           = "next-saas-single-foo.zenhalab.com"
  description         = "next-saas-single-foo"
}
module "distribution_single_baz" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_single.public_dns
  client_header_value = "baz"
  cname_dns           = "next-saas-single-baz.zenhalab.com"
  description         = "next-saas-single-baz"
}
module "distribution_single_bar" {
  source              = "../../../modules/cloudfront"
  stage               = local.stage
  domain              = local.domain
  dns_origin          = module.instance_single.public_dns
  client_header_value = "bar"
  cname_dns           = "next-saas-single-bar.zenhalab.com"
  description         = "next-saas-single-bar"
}
