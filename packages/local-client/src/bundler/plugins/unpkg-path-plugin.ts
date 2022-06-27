import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
	return {
		name: "unpkg-path-plugin",
		setup(build: esbuild.PluginBuild) {
			// handle root entry file of index.js
			build.onResolve({filter: /(^index\.js$)/}, () => {
				return {path: "index.js", namespace: "a"};
			});

			// if the file name includes ./ or ../
			// handle relative paths in a module
			build.onResolve({filter: /^\.+\//}, (args: any) => {
				return {path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/").href, namespace: "a"};
			});

			// hanlde main file of a module
			build.onResolve({filter: /.*/}, async (args: any) => {
				return {
					namespace: "a",
					path: `https://unpkg.com/${args.path}`,
				};
			});
		},
	};
};
