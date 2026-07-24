export default [
  {
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
];