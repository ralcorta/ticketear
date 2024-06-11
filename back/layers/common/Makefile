SHELL := /bin/bash

# MUST: sam build has to be runned with --build-in-source flag
build-NodeDependenciesLayer:
	@CURRENT_DIR=$$(pwd); \
	../../scripts/build-layer-dependencies.sh -l NodeDependenciesLayer -d ${ARTIFACTS_DIR} -r $$CURRENT_DIR;
	