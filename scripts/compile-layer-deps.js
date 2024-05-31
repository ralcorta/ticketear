const { execSync } = require('child_process');
const { existsSync, copyFileSync } = require('fs');
const { join } = require('path');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({ region: 'us-east-1' }); // Specify your AWS region

let hashCmd;
if (process.platform === 'linux') {
    hashCmd = 'sha256sum';
} else if (process.platform === 'darwin') {
    hashCmd = 'shasum -a 256';
} else {
    console.error('SO not supported.');
    process.exit(1);
}

function getHash(command) {
    return execSync(command).toString().trim();
}

function findFilesAndHash(path) {
    const findCmd = `find ${path} -type f -exec ${hashCmd} {} \\; | ${hashCmd}`;
    return getHash(findCmd);
}

async function getLayerVersionHash() {
    const params = {
        LayerName: 'node-dependencies-layer',
        VersionNumber: 1,
    };

    try {
        const data = await lambda.getLayerVersion(params).promise();
        return data.Content.CodeSha256;
    } catch (err) {
        console.error('Error getting layer version:', err);
        process.exit(1);
    }
}

const newHash = findFilesAndHash('node_modules package-lock.json');
const oldHash = getHash(
    'aws lambda get-layer-version --layer-name node-dependencies-layer --version-number 1 --query Content.CodeSha256 --output text',
);

if (newHash !== oldHash) {
    console.log('El contenido ha cambiado, subiendo una nueva capa...');
    const artifactsDir = process.env.ARTIFACTS_DIR; // Ensure this environment variable is set

    if (!artifactsDir) {
        console.error('ARTIFACTS_DIR environment variable not set.');
        process.exit(1);
    }

    const destPackageLockPath = join(artifactsDir, 'package-lock.json');
    copyFileSync('package-lock.json', destPackageLockPath);

    execSync(`npm ci --prefix ${artifactsDir} --production`, { stdio: 'inherit' });
} else {
    console.log('El contenido no ha cambiado.');
}
