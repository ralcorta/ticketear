#!/bin/bash

usage() {
    echo "Usage: $0 -l LAYER_NAME -d ARTIFACTS_DIR -r ROOT_DIR"
    exit 1
}

while getopts "l:d:r:" opt; do
    case $opt in
        l)
            layerName=$OPTARG
            ;;
        d)
            ARTIFACTS_DIR=$OPTARG
            ;;
        r)
            ROOT_DIR=$OPTARG
            ;;
        *)
            usage
            ;;
    esac
done

if [ -z "$layerName" ] || [ -z "$ARTIFACTS_DIR" ] || [ -z "$ROOT_DIR" ]; then
    usage
fi

depsFile="package.json"
lockFile="package-lock.json"
rootLockFile="$ROOT_DIR/$lockFile"
layerNodeModules="$ARTIFACTS_DIR/nodejs/node_modules"
layerLockFile="$ARTIFACTS_DIR/nodejs/$lockFile"
layerDepFile="$ARTIFACTS_DIR/nodejs/$depsFile"

echo "$ARTIFACTS_DIR"
folder="$(ls $ARTIFACTS_DIR/nodejs)"
echo "$folder"

if [ -d "$layerNodeModules" ] && [ -f "$layerLockFile" ] && cmp -s "$layerLockFile" "$rootLockFile"; then
    echo "No dependencies changed. Skipping layer update."
else
    echo "Dependencies changed. Updating layer..."
    rm -rf "$layerNodeModules"
    mkdir -p ${ARTIFACTS_DIR}/nodejs 
    cp "$depsFile" "$layerDepFile"
    cp "$lockFile" "$layerLockFile"
    install="ci"
    if [ ! -f "$rootLockFile" ]; then
        echo "package-lock.json file do not exist on root folder. building..."
        install="c"
    fi
    npm "$install" --prefix ${ARTIFACTS_DIR}/nodejs --production 
fi