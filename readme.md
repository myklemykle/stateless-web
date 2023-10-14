__DEV SETUP:__

1) [Install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) node & npm.

2) Install all required node modules with npm.

```
npm install
```

3) Install [npx](https://www.npmjs.com/package/npx) globally.

```
npm install -g npx
```

__CONFIGURE:__

* Copy `.env.example` to `.env`, and configure the environment variables within.
    * You must set at least `NETWORKID` and `MINTBASECONTRACTID`.
    * You must rebuild the site to see changes take effect.

* If environment variables are not an option, edit index.html to change the hardcoded values within window.stateless_config.

__BUILD:__

This project is packaged/built/tested with [Parcel](https://parceljs.org/).
To build & host the site in development mode:

```
npx parcel src/index.html
```

To generate an optimized site for manual deployment:
```
npx parcel build src/index.html --no-scope-hoist --public-url ./
```

__DEPLOY:__

* One-click deploy to [Vercel](https://www.vercel.com): 
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmyklemykle%2Fstateless-web&env=NETWORKID,MINTBASECONTRACTID&envDescription=NETWORKID%20should%20be%20%22mainnet%22%20or%20%22testnet%22.%20%20See%20.env.example%20for%20more%20details%20on%20required%20%26%20optional%20environment%20variables.&envLink=https%3A%2F%2Fgithub.com%2Fmyklemykle%2Fstateless-web%2Fblob%2Fmaster%2F.env.example&build-command=npx%20parcel%20build%20src%2Findex.html%20--no-scope-hoist%20--public-url%20.%2F&install-command=npm%20install)

