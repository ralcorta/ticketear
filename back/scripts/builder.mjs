import { context, build } from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { argv, cwd, exit } from 'node:process';

const watch = argv?.[2] === 'watch';

const builder = async () => {
    const config = {
        entryPoints: ['src/**/*.ts'],
        bundle: true,
        platform: 'node',
        outdir: 'dist',
        target: 'node20',
        sourcemap: false,
        minify: true,
        packages: 'external',
        plugins: [
            nodeExternalsPlugin({
                // packagePath: [`${cwd()}/package.json`, 'layers/common/package.json'],
            }),
        ],
    };
    await build(config);
    console.log('Build complete!');
    if (watch) {
        let ctx = await context(config);
        console.log("Now I'm watching ... e.e");
        await ctx.watch();
    }
};
builder();
