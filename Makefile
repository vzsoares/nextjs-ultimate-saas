# fak yo TABs
.RECIPEPREFIX := >
.DEFAULT_GOAL := default

DOCKER := docker

BUILD_STRATEGY ?= "SINGLE"
USE_LOCALHOST ?= "TRUE"
BASE_IMAGE_NAME ?= "next-saas"
IMAGE_TAG ?= "latest"

CLIENTS := foo bar baz

default:
> @echo "Please select a method" && exit 1

# build images
build:
> @if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} build-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} build-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

build-single:
> @${DOCKER} build -t "${BASE_IMAGE_NAME}-single:${IMAGE_TAG}" --build-arg BUILD_TYPE="SINGLE" --build-arg USE_LOCALHOST="${USE_LOCALHOST}" .

build-instances:
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, build-instance-${client})

build-instance-%:
> @${DOCKER} build -t "${BASE_IMAGE_NAME}-instance-$*:${IMAGE_TAG}" --build-arg BUILD_TYPE="INSTANCES" --build-arg BASE_CLIENT="$*" --build-arg USE_LOCALHOST="${USE_LOCALHOST}" .

# run images
run:
> @if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} run-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} run-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

run-single:
> @${DOCKER} run -d --name ${BASE_IMAGE_NAME}-single -p 3000:3000 -p 3001:3000 -p 3002:3000 ${BASE_IMAGE_NAME}-single

run-instances:
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, run-instance-${client})

run-instance-%:
> @${DOCKER} run -d -P --name ${BASE_IMAGE_NAME}-instance-$* ${BASE_IMAGE_NAME}-instance-$*

stop:
> @${DOCKER} container stop ${BASE_IMAGE_NAME}-single $(foreach client,${CLIENTS}, ${BASE_IMAGE_NAME}-instance-${client}) &>2; \
    ${DOCKER} container rm -f ${BASE_IMAGE_NAME}-single $(foreach client,${CLIENTS}, ${BASE_IMAGE_NAME}-instance-${client}) &>2

