import argparse
import os
import shutil
import subprocess

def usage():
    print("Usage: script.py -l LAYER_NAME -d ARTIFACTS_DIR -r ROOT_DIR")
    exit(1)

# Parse arguments
parser = argparse.ArgumentParser()
parser.add_argument("-l", "--layerName", help="Layer name")
parser.add_argument("-d", "--ARTIFACTS_DIR", help="Artifacts directory")
parser.add_argument("-r", "--ROOT_DIR", help="Root directory")
args = parser.parse_args()

if not args.layerName or not args.ARTIFACTS_DIR or not args.ROOT_DIR:
    usage()

depsFile = "package.json"
lockFile = "package-lock.json"
rootLockFile = os.path.join(args.ROOT_DIR, lockFile)
layerNodeModules = os.path.join(args.ARTIFACTS_DIR, "nodejs/node_modules")
layerLockFile = os.path.join(args.ARTIFACTS_DIR, f"nodejs/{lockFile}")
layerDepFile = os.path.join(args.ARTIFACTS_DIR, f"nodejs/{depsFile}")

print(args)
print(f"rootLockFile: {rootLockFile}")
print(f"layerNodeModules: {layerNodeModules}")
print(f"layerLockFile: {layerLockFile}")
print(f"layerDepFile: {layerDepFile}")

if os.path.isdir(layerNodeModules):
    print("layerNodeModules", os.path.isdir(layerNodeModules))
else:
    print("NOOlayerNodeModules", os.path.isdir(layerNodeModules))

if os.path.isfile(layerLockFile):
    print("layerLockFile")
else:
    print("NOOlayerLockFile")

if os.path.isdir(layerNodeModules) and os.path.isfile(layerLockFile) and open(layerLockFile).read() == open(rootLockFile).read():
    print("No dependencies changed. Skipping layer update.")
else:
    print("Dependencies changed. Updating layer...")
    shutil.rmtree(layerNodeModules, ignore_errors=True)
    os.makedirs(os.path.join(args.ARTIFACTS_DIR, "nodejs"), exist_ok=True)
    shutil.copy(depsFile, layerDepFile)
    shutil.copy(lockFile, layerLockFile)
    install = "ci"
    if not os.path.isfile(rootLockFile):
        print("package-lock.json file do not exist on root folder. building...")
        install = "c"
    subprocess.run(["npm", install, "--prefix", os.path.join(args.ARTIFACTS_DIR, "nodejs"), "--production"])
