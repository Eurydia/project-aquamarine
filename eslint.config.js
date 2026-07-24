import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
	js.configs.recommended,
	tseslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							regex: "^@mui/[^/]+$",
							message:
								"Do not use MUI barrel imports. Import from the component path instead.",
						},
					],
				},
			],
		},
	},
);