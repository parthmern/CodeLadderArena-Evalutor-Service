## run TS code

- one ways : tsc - compiler 
- second way : `npm i ts-node` without converting into js files

## how to setup new ts+express project

- `npm init -y`
- `npm install -D typescript`
- `tsc --init` gives "tsconfig.js" then making `"outDir": "./dist",`
- also do in "tsconfig.js"

```
"exclude": ["node_modules"],
"include": ["./src/**/*.ts"]
```

<br/>

- extra : when u do `tsc` or `npx tsc` it will do compile and gives .js files under ./dist foler



## types of express

- direct exprss install first
- it gives error and to solve it `npm i -D @types/express` 
- for nodemon `npm i -D nodemon`
- in pacage json ( so first to "npm run build" to compile and then do "npm start" to run index.js) 

```
    "build": "npx tsc",
    "start": "npx nodemon ./dist/index.js"
```

- or we can do like this short way(here when we do "npm start" automaticaly first run "prestart" command then "Start" command going to run)

```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "prestart": "npm run build",
    "start": "npx nodemon ./dist/index.js"
  },
```

- but still when u do changes nodemon is not able to detect index.ts file so here ts gives u watcher ( it runs when we do any file change in index.ts file)

```
    "watch" : "tsc -w",         // in package.json > script
```

- so here we need to run 2 commands symontonosly therfore use `npm i concurrently`

```
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx tsc",
    "watch" : "tsc -w",
    "prestart": "npm run build",
    "start": "npx nodemon ./dist/index.js",
    "dev" : "npx concurrently \"npm run watch\" \"npm start\" "
  },
```