# Contributing

This project is built with [Preact](https://preactjs.com/) and bundled with [Vite](https://vitejs.dev/).

## Prerequisites

- Node.js
- This project uses pnpm. Run `corepack enable` to use pnpm in this project.

## Development workflow

This project uses Vite's [Library Mode](https://vitejs.dev/guide/build.html#library-mode).

- The library code is inside the `lib/` directory.
- The example app in the `src/` directory.
- Tests and Stories are colocated to embeds inside the `lib/` directory.

To get started with the project, run `pnpm i` in the root directory.

```sh
pnpm i
```

### Example App

The [example app](/example/) demonstrates usage of the library and works as a development playground.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild.

To start the development server, run `pnpm dev`.

```sh
pnpm dev
```

You can then open the example app in your browser.

### Storybook

To develop with Storybook, run `pnpm storybook`.

```sh
pnpm storybook
```

The [storybook](/storybook/) is used to develop the UI of an embed without having to initialize it. Changes to the library's JavaScript code will be reflected in Storybook without a rebuild.

## Linting

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
pnpm typecheck
pnpm lint
```

To fix formatting errors, run the following:

```sh
pnpm lint --fix
```

## Testing

We use [Vitest](https://vitest.dev/) for testing, together with [Preact Testing Library](https://preactjs.com/guide/v10/preact-testing-library/) to write better tests. Vitest and Preact Testing Library have a compatible interface to Jest and React Testing Library.

Run the unit tests by:

```sh
pnpm test
```
