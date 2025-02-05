import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
	js.configs.recommended,
	...pluginVue.configs["flat/recommended"],
	{
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
			"indent": ["error", "tab"],
			"eol-last": ["error", "always"],
			"vue/script-indent": ["error", "tab"],
			"vue/html-indent": ["error", "tab"],
			"vue/no-unused-vars": "error",
		}
	}
]
