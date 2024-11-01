# Lunie Official Monorepo

## Preparation:

To install the required modules for `/api`, `/app`, and `/extension` all at once, run:

```bash
$ yarn
```

If you're only interested in `/api`, `/app`, or `/extension` there are instructions below for how to work in one workspace at a time.

#### To install new dependencies in a single workspace:

Run this command with the following syntax:

```bash
$ yarn workspace <workspace-name> add <package-name>
```

As an example:

```bash
$ yarn workspace extension add cool-vue-package
```

## To run the code in a single workspace:

- API:
```bash
$ yarn workspace api start
```

- App:
```bash
$ yarn workspace app serve
```


