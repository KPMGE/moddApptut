# setup our Dapp

Try running some of the following tasks to get started
```shell
npm install
```
## To start our contract
compile the contract
```shell
npx hardhat compile
```

start our local node
```shell
npx hardhat node
```

deploy contract
```shell
npx hardhat run --network localhost scripts/deploy.js
```

Set up NODE_OPTIONS with legacy provider
```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

Start React app
```shell
npm start
```

