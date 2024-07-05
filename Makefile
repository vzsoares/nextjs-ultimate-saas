# fak yo TABs
.RECIPEPREFIX := >
.DEFAULT_GOAL := default

DOCKER := docker
BUILD_STRATEGY = "SINGLE"
IMAGE_TAG = "latest"
ARG_USELOCALHOST = "TRUE"

LOWER_BUILD_STRATEGY = $(shell echo $(BUILD_STRATEGY) | tr A-Z a-z)
BASE_IMAGE_NAME := "next-saas-${LOWER_BUILD_STRATEGY}"

CLIENTS := foo bar baz

# TODO remove
DOCKER := echo

default:
> @echo "Please select a method" && exit 1

build:
> if [ "${BUILD_STRATEGY}" = "INSTANCES" ]; then\
        ${MAKE} ${MAKEOPTS} build-instances;\
        elif [ "${BUILD_STRATEGY}" = "SINGLE" ]; then\
        ${MAKE} ${MAKEOPTS} build-single;\
        else\
        echo "NO BUILD STRATEGY SET" && exit 1;\
        fi

build-instances:
> ${MAKE} ${MAKEOPTS} $(foreach client,${CLIENTS}, build-instance-${client})

build-single:
> ${DOCKER} build -t "${BASE_IMAGE_NAME}:${IMAGE_TAG}" --build-arg BUILD_TYPE="${BUILD_STRATEGY}" --build-arg USE_LOCALHOST="${ARG_USELOCALHOST}" .

build-instance-%:
> @${DOCKER} build -t "${BASE_IMAGE_NAME}-$*:${IMAGE_TAG}" --build-arg BUILD_TYPE="${BUILD_STRATEGY}" BASE_CLIENT="$*" --build-arg USE_LOCALHOST="${ARG_USELOCALHOST}" .

