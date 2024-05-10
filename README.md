# Recipe Budd

A simple recipe manager for the web and mobile.

## Apps and Packages

- `expo`: the mobile app
- `nextjs`: the web app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## Getting Started

This is a monorepo managed with Turborepo. This means that all the packages and apps are linked into the same source tree. We use this linked structure to share code and state between the packages and apps.

```
cd my-turborepo

# Build all apps and packages
yarn run build

# Develop all apps and packages
yarn run dev
```
