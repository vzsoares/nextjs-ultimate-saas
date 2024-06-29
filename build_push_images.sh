BUILD_TYPE=$1
BASE_CLIENT=$2
#DOCKER_REGISTRY = {aws_account_id}.dkr.ecr.{aws_region}.amazonaws.com

for r in $(grep 'image: \${DOCKER_REGISTRY}' docker-compose-production.yml | sed -e 's/^.*\///'); do
    #TODO check if registry exists
    # if exists skip
    # if not exists create
    aws ecr create-repository --repository-name "$r"
done

docker compose buid --build-arg BUILD_TYPE="$BUILD_TYPE" --build-arg BASE_CLIENT="$BASE_CLIENT"

docker compose push
