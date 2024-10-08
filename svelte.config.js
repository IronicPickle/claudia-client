import path from "node:path";
import { fileURLToPath } from "node:url";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess({
		style: {
			css: {
				preprocessorOptions: {
					scss: {
						additionalData: "@import '$lib/styles/index.scss';",
						importer: [
							(url) => {
								if (url.startsWith("$lib")) {
									return {
										file: url.replace(/^\$lib/, path.join(dirname, "src", "lib"))
									};
								}
								return url;
							}
						]
					}
				}
			}
		}
	}),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: "dist",
			assets: "dist",
			fallback: "index.html"
		}),
		alias: {
			$shared: "../claudia-shared",

			$routes: "./src/routes",

			$components: "./src/lib/components/",
			$constants: "./src/lib/constants/",
			$enums: "./src/lib/enums/",
			$objects: "./src/lib/objects/",
			$ts: "./src/lib/ts/",
			$utils: "./src/lib/utils/",
			$stores: "./src/lib/stores/",

			$config: "./src/config/",
			$api: "./src/api/"
		}
	},
	compilerOptions: {
		accessors: true
	}
};

export default config;
