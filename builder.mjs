import { build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

build({
    entryPoints: ['src/**/*.ts'],
    bundle: true,
    platform: 'node',
    outdir: 'dist',
    target: 'node20',
    sourcemap: false,
    minify: true,
    packages: 'external',
    plugins: [nodeExternalsPlugin()],
});
