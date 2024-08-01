# sm-iclient

sm-iclient is a small subset of SuperMap iClient which is written in typescript, ESM module by default, and uses ky-universal as the HTTP request.
By using ky-universal, it can be run on **node** and **browser**

This is created to provide a smaller bundle than the full package SuperMap iClient and focus on providing a simple typescript client to access iServer API.

## NOTICE

This package is in heavy development, so it is prone to API changes even though the breaking changes API versioning not changes.
The API will be fixed after all services are included and complete.

## Packages

This is a monorepo with multiple packages. Currently, there are two packages:

1. `@sm-iclient/iserver` : provides abstractions for iServer REST Data and Map services
2. `@sm-iclient/ol` : `@sm-iclient/iserver` + SuperMap TileRestMap to add SuperMap iServer REST Map tiles into openlayers

Use `@sm-iclient/iserver` if :

- only need to access iServer REST Data
- installed in nodejs backend

Use `@sm-iclient/ol` if you are using openlayers

## Installation

Install `sm-iclient` with package manager

```bash
pnpm add @sm-iclient/iserver

npm install @sm-iclient/iserver

yarn add bash @sm-iclient/iserver
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
