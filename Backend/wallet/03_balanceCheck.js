const { ethers, utils } = require("ethers");

async function _getBalance(_address) {
    const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/kVDGpGEVXoUaLMZyMaVZWs_RFz3MhcGI");
    const balanceWei = await provider.getBalance(_address);
    return balanceWei;
  }
// Example usage
const address = "0xb6adee15bd5ac1fc1c50b29fb99bdf8e0f444abf";
_getBalance(address)
  .then(balance => console.log(`Balance: ${balance} `))
  .catch(error => console.error(error));
