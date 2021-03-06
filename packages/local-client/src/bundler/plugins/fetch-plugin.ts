import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
	name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
	return {
		name: "fetche-plugin",
		setup(build: esbuild.PluginBuild) {
			// if its the root entry file of index.js
			build.onLoad({filter: /(^index\.js$)/}, () => {
				return {
					loader: "jsx",
					contents: inputCode,
				};
			});

			// if it's any other type of file, then do nothing and try the next onload below
			build.onLoad({filter: /.*/}, async (args: any) => {
				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

				if (cachedResult) {
					return cachedResult;
				}
			});

			build.onLoad({filter: /.css$/}, async (args: any) => {
				// Check to see if we have already fetched this file
				// and if it is in the cache

				// if it is , return it immediately

				const {data, request} = await axios.get(args.path);

				// replace " in the string to \\" etc
				const escaped = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");

				const contents = `
					const style = document.createElement('style');
					style.innerText = '${escaped}';
					document.head.appendChild(style);
				`;
				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: contents,
					resolveDir: new URL("./", request.responseURL).pathname,
				};

				// store response in cache
				await fileCache.setItem(args.path, result);
				return result;
			});

			build.onLoad({filter: /.*/}, async (args: any) => {
				// Check to see if we have already fetched this file
				// and if it is in the cache

				const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

				if (cachedResult) {
					return cachedResult;
				}

				// if it is , return it immediately

				const {data, request} = await axios.get(args.path);

				const result: esbuild.OnLoadResult = {
					loader: "jsx",
					contents: data,
					resolveDir: new URL("./", request.responseURL).pathname,
				};

				// store response in cache
				await fileCache.setItem(args.path, result);
				return result;
			});
		},
	};
};
