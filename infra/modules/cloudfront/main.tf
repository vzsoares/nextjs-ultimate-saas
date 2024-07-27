variable "dns_origin" {
  type = string
}
variable "cname_dns" {
  type = string
}
variable "client_header_value" {
  type = string
}
variable "description" {
  type = string
}

resource "aws_cloudfront_distribution" "distribution" {
  origin {
    domain_name = var.dns_origin
    origin_id   = var.dns_origin
    custom_header {
      name  = "X-Saas-Client"
      value = var.client_header_value
    }
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_ssl_protocols   = ["TLSv1.2"]
      origin_protocol_policy = "http-only"
    }
  }

  enabled     = true
  comment     = var.description
  price_class = "PriceClass_100"

  aliases = [var.cname_dns]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.dns_origin

    cache_policy_id            = "83da9c7e-98b4-4e11-a168-04f0df8e2c65"
    response_headers_policy_id = "60669652-455b-4ae9-85a4-c4c02393f86c"
    origin_request_policy_id   = "216adef6-5c7f-47e4-b989-5492eafa07d3"
    viewer_protocol_policy     = "redirect-to-https"

    compress    = true
    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:355738159777:certificate/ab0d185c-45d1-4cf5-9847-60ee899428e4"
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"

  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Terraform = "true"
  }

}
