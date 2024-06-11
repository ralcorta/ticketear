#!/bin/bash

# usage() {
#     echo "Usage: $0 -l LAYER_NAME -d ARTIFACTS_DIR"
#     exit 1
# }

# # Parse arguments
# while getopts "l:d:" opt; do
#     case $opt in
#         l)
#             layerName=$OPTARG
#             ;;
#         d)
#             ARTIFACTS_DIR=$OPTARG
#             ;;
#         *)
#             usage
#             ;;
#     esac
# done

# # Check if mandatory arguments are present
# if [ -z "$layerName" ] || [ -z "$ARTIFACTS_DIR" ]; then
#     usage
# fi

# echo Layer: $layerName
# echo Dir: $ARTIFACTS_DIR

# if [ -z "$layerName" ] || [ -z "$ARTIFACTS_DIR" ]; then
#     usage
# fi

# zip -r lambda-layer.zip node_modules package-lock.json 

# zip lambda-function.zip -r lambda.py
# openssl dgst -sha256 -binary lambda-function.zip | openssl base64
# awslocal lambda get-layer-version --layer-name $layerName --version-number 1 --query Content.CodeSha256 --output text