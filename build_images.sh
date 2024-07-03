# BUILD_TYPE=$1
# BASE_CLIENT=$2
# USE_LOCALHOST=$3
# BASE_CLIENT=""
# BUILD_TYPE="SINGLE"
USE_LOCALHOST="TRUE"
CLIENTS=("foo" "bar" "baz")
#DOCKER_REGISTRY = {aws_account_id}.dkr.ecr.{aws_region}.amazonaws.com

#for r in $(grep 'image: \${DOCKER_REGISTRY}' docker-compose-production.yml | sed -e 's/^.*\///'); do
#    #TODO check if registry exists
#    # if exists skip
#    # if not exists create
#    aws ecr create-repository --repository-name "$r"
#done

echo "building SINGLE image"
docker build -t next-saas-single:latest --build-arg BUILD_TYPE="SINGLE" --build-arg USE_LOCALHOST="$USE_LOCALHOST" . &

for CLIENT in "${CLIENTS[@]}"; do
    echo "building INSTANCES $CLIENT image"
    docker build -t "next-saas-instance-$CLIENT:latest" --build-arg BUILD_TYPE="INSTANCES" --build-arg BASE_CLIENT="$CLIENT" --build-arg USE_LOCALHOST="$USE_LOCALHOST" . &

done

wait

# docker run -p 3000:3000 -p 3001:3000 -p 3002:3000 next-saas-single

# docker run -p 3010:3000 next-saas-instance-foo
# docker run -p 3011:3000 next-saas-instance-bar
# docker run -p 3012:3000 next-saas-instance-baz

# docker compose push
