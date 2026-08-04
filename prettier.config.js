export default {
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    htmlWhitespaceSensitivity: 'ignore',
    printWidth: 9999,
    overrides: [
        {
            files: '.github/workflows/deploy.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
