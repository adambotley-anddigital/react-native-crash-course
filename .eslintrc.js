module.exports = {
  extends: [
    'universe',
    'universe/native',
    'universe/web',
    'universe/shared/typescript-analysis',
    'prettier',
  ],

  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],

  plugins: ['react-hooks'],
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    node: true,
  },
}
