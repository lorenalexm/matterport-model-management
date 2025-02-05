import js from "@eslint/js";
import globals from "globals";

export default [
	js.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			"no-unused-vars": "error",
			"no-undef": "error",
			"indent": ["error", "tab"],
			"eol-last": ["error", "always"],
		}
	}
]
