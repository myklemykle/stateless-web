__SETUP:__

1) [Install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) node & npm.

2) Install all node required modules:

```
npm install
```

3) Optional but handy: install [npx](https://www.npmjs.com/package/npx) globally:

```
npm install -g npx
```

__EXPLORE:__

Ala many NEAR js projects, this one is packaged/built/tested with [Parcel](https://parceljs.org/).

This will build & host a demo of the Distrotron contract
(Note atm the Distrotron address is hard-coded in the js.)

```
npx parcel src/distrotron.html
```

This will build & host the Stateless site mockup:

```
npx parcel src/index.html
```
