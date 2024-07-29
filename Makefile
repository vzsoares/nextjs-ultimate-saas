-include .env
export
# fak yo TABs
.RECIPEPREFIX := >
.DEFAULT_GOAL := help

DOCKER := docker
AWS := aws
AWK := awk

AWS_ACCOUNT_ID ?= 355738159777
AWS_REGION ?= us-east-1

BUILD_STRATEGY ?= "SINGLE"
USE_LOCALHOST ?= "TRUE"
BASE_IMAGE_NAME ?= "next-saas"
IMAGE_TAG ?= "latest"

CLIENTS ?= foo bar baz

export ANSIBLE_CONFIG="$(pwd)/ansible-playbooks/ansible.cfg"

##@
##@ Build docker image
##@

build: ##@ Build selected strategy image
> @if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} build-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} build-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

build-single: ##@ Build single image
> @${DOCKER} build -t "${BASE_IMAGE_NAME}-single:${IMAGE_TAG}" --build-arg BUILD_TYPE="SINGLE" --build-arg USE_LOCALHOST="${USE_LOCALHOST}" .

build-instances: ##@ Build all instances build
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, build-instance-${client})

build-instance-%: ##@ Build instance %
> @${DOCKER} build -t "${BASE_IMAGE_NAME}-instance-$*:${IMAGE_TAG}" --build-arg BUILD_TYPE="INSTANCES" --build-arg BASE_CLIENT="$*" --build-arg USE_LOCALHOST="${USE_LOCALHOST}" .

##@
##@ Run docker image
##@

run: ##@ Run selected strategy image
> @if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} run-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} run-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

run-single: ##@ Run single instance
> @${DOCKER} run -d --name ${BASE_IMAGE_NAME}-single -p 3000:3000 -p 3001:3000 -p 3002:3000 ${BASE_IMAGE_NAME}-single

run-instances: ##@ Run all instances images
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, run-instance-${client})

run-instance-%: ##@ Run instance %
> @${DOCKER} run -d -P --name ${BASE_IMAGE_NAME}-instance-$* ${BASE_IMAGE_NAME}-instance-$*

##@
##@ Push image to registry
##@

push: ##@ Push selected strategy to ecr
> @if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} push-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} push-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

push-single: ##@ Push single instance to registry
> @${AWS} ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
> @${DOCKER} tag ${BASE_IMAGE_NAME}-single:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BASE_IMAGE_NAME}/single:latest
> @${DOCKER} push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BASE_IMAGE_NAME}/single:latest

push-instances: ##@ Push all instances
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, push-instance-${client})

push-instance-%: ##@ Push % instance
> @${AWS} ecr get-login-password --region ${AWS_REGION} | ${DOCKER} login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
> @${DOCKER} tag ${BASE_IMAGE_NAME}-instance-$*:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BASE_IMAGE_NAME}/instance-$*:latest
> @${DOCKER} push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BASE_IMAGE_NAME}/instance-$*:latest

##@
##@ Deploy
##@

deploy-local: ##@ Deploy to local vm like `oracle vm`;
              ##@ - uses ansible
> HOST_NAME=${LOCAL_HOST_NAME} ansible-playbook -i "${LOCAL_HOST_NAME}," ansible-playbooks/playbook_docker.ansible.yaml -k -K -u ${LOCAL_USER}

deploy-ec2: ##@ Deploy to remote vm aws ec2;
              ##@ - uses ansible
> ansible-playbook -i ansible-playbooks/inventory.ansible.aws_ec2.yml ansible-playbooks/playbook_docker.ansible.yaml

##@
##@ Misc commands
##@

help: ##@ (Default) This help menu
> @printf "\nUsage: make <command>\n"
> @grep -F -h "##@" $(MAKEFILE_LIST) | grep -F -v grep -F | sed -e 's/\\$$//' | $(AWK) 'BEGIN {FS = ":*[[:space:]]*##@[[:space:]]*"}; \
	{ \
		if($$2 == "") \
			pass; \
		else if($$0 ~ /^#/) \
			printf "\n%s\n", $$2; \
		else if($$1 == "") \
			printf "     %-20s%s\n", "", $$2; \
		else \
			printf "\n    \033[34m%-20s\033[0m %s\n", $$1, $$2; \
	}'

stop: ##@ stop all running containers
> @${DOCKER} container stop ${BASE_IMAGE_NAME}-single $(foreach client,${CLIENTS}, ${BASE_IMAGE_NAME}-instance-${client}) &>2; \
    ${DOCKER} container rm -f ${BASE_IMAGE_NAME}-single $(foreach client,${CLIENTS}, ${BASE_IMAGE_NAME}-instance-${client}) &>2
