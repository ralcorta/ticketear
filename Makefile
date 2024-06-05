SHELL := /bin/bash

# MUST: sam build has to be runned with --build-in-source flag
# build-NodeDependenciesLayer:
# 	@CURRENT_DIR=$$(pwd); \
# 	../../../scripts/build-layer-dependencies.sh -l NodeDependenciesLayer -d ${ARTIFACTS_DIR} -r $$CURRENT_DIR;

build-NodeDependenciesLayer:
	@CURRENT_DIR=$$(pwd); \
	mkdir -p ${ARTIFACTS_DIR}/nodejs; \
	cp package.json "$$ARTIFACTS_DIR/nodejs/package.json"; \
	cp package-lock.json "$$ARTIFACTS_DIR/nodejs/package-lock.json"; \
    npm ci --prefix ${ARTIFACTS_DIR}/nodejs --production;
	