require('@nomicfoundation/hardhat-toolbox');
require("dotenv").config()

module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./app/src/artifacts",
  },
  networks: {
    hardhat: {
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIV_KEY]
    }
  }
};
