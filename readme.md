__SETUP:__

1) [Install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) node & npm.

2) Install all node required modules.

```
npm install
```

3) Optional but handy: install [npx](https://www.npmjs.com/package/npx) globally.

```
npm install -g npx
```

__CONFIGURE:__

There are three ways (at least) to configure this web interface for a specific Mintbase market contract.

* Copy .env.example to .env, and configure the environment variables within.  
    * You must set at least NETWORKID and MINTBASECONTRACTID.
    * You must rebuild the site to see changes take effect.

* If you are deploying on [Vercel](https://www.vercel.com), configure those environment variables directly in the Vercel deployment UI.
    * You must redeploy to see changes take effect

* If environment variables are not an option, edit index.html to change the hardcoded values within window.stateless_config.

In all cases, please note:
    * You must set at least NETWORKID and MINTBASECONTRACTID .
    * You must rebuild/redeploy the site to see config changes take effect.

__BUILD:__

This project is packaged/built/tested with [Parcel](https://parceljs.org/).
To build & host the Stateless site mockup in development mode:

```
npx parcel src/index.html
```

To generate an optimized site for deployment:
```
npx parcel build src/index.html --no-scope-hoist --public-url ./
```

