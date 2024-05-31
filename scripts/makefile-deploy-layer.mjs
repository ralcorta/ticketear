import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import sanitize from 'sanitize-filename';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Usage: node scripts/makefile-deploy-layer.mjs <ARTIFACTS_DIR>');
    process.exit(1);
}

const ARTIFACTS_DIR = sanitize(args?.[0]);

if (!ARTIFACTS_DIR)
    throw new Error(
        'No artifacts directory provided. Please provide the path to the artifacts directory as the first argument.',
    );

// Create the target directory
const targetDir = path.join(ARTIFACTS_DIR, 'nodejs');
fs.mkdirSync(targetDir, { recursive: true });

// Copy package.json and package-lock.json
const filesToCopy = ['package.json', 'package-lock.json'];
filesToCopy.forEach((file) => {
    log(path.join(__dirname, '..', file), path.join(targetDir, file));
    fs.copyFileSync(path.join(__dirname, '..', file), path.join(targetDir, file));
});

// Run npm ci in the target directory with --production flag
execSync(`npm ci --prefix ${targetDir} --production`, { stdio: 'inherit' });
