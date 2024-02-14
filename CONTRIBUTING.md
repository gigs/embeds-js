# Contributing

This project is built with [Preact](https://preactjs.com/) and bundled with [Vite](https://vitejs.dev/).

## Development workflow

This project uses Vite's [Library Mode](https://vitejs.dev/guide/build.html#library-mode).

- The library code is inside the `lib/` directory.
- The example app in the `src/` directory.
- Tests and Stories are colocated to embeds inside the `lib/` directory.

To get started with the project, run `npm i` in the root directory.

```sh
npm i
```

### Example App

The [example app](/example/) demonstrates usage of the library and works as a development playground.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild.

To start the development server, run `npm run dev`.

```sh
npm run dev
```

You can then open the example app in your browser.

### Storybook

To develop with Storybook, run `npm run storybook`.

```sh
npm run storybook
```

The [storybook](/storybook/) is used to develop the UI of an embed without having to initialize it. Changes to the library's JavaScript code will be reflected in Storybook without a rebuild.

## Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
npm run release
```

## Linting

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
npm run typecheck
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint --fix
```

## Testing

We use [Vitest](https://vitest.dev/) for testing, together with [Preact Testing Library](https://preactjs.com/guide/v10/preact-testing-library/) to write better tests. Vitest and Preact Testing Library have a compatible interface to Jest and React Testing Library.

Run the unit tests by:

```sh
npm test
```
