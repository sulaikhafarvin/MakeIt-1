require("dotenv").config();

const {ethers} = require("ethers");

const { generateMnemonic, mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { privateToPublic, toChecksumAddress } = require("ethereumjs-util");  // Updated import
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { writeFileSync } = require("fs");

//first create a seed-phase
//2nd build a private key from HDRootket 
//and create public from private
// account address
  
  function _generateMnemonic() {
    const strength = 256; // 256 bits, 24 words; default is 128 bits, 12 words
    const mnemonic = generateMnemonic(wordlist, strength);
    const entropy = mnemonicToEntropy(mnemonic, wordlist);
    return { mnemonic, entropy };
  }


async function _getBalance(_address) {
  const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/kVDGpGEVXoUaLMZyMaVZWs_RFz3MhcGI");
  const balanceWei = await provider.getBalance(_address);
  return balanceWei;
}

 
  
  function _getHdRootKey(_mnemonic) {
    return HDKey.fromMasterSeed(_mnemonic);
  }
  
  function _generatePrivateKey(_hdRootKey, _accountIndex) {
    return _hdRootKey.deriveChild(_accountIndex).privateKey;
  }
  
  function _getPublicKey(_privateKey) {
    const privateKeyBuffer = Buffer.from(_privateKey);
    return privateToPublic(privateKeyBuffer);
  }
  
  function _getEthAddress(_publicKey) {
    const publicKeyBuffer = Buffer.from(_publicKey.slice(2), 'hex'); // Assuming _publicKey is a hex string starting with '0x'
    return keccak256(publicKeyBuffer).slice(-20);
}

  

    
// async function _getBalance(_getEthAddress) {
//     const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/OncYGsKAjIvnfXloIEzFAQonYIpH4oqz");
//     const balance = await provider.getBalance(_getEthAddress);
//     return ethers.utils.formatEther(balance);
//   }

function _bytesToHex(bytes) {
    if (bytes instanceof Uint8Array) {
      return bytesToHex(bytes);
    } else if (Array.isArray(bytes)) {
      return bytesToHex(Uint8Array.from(bytes));
    } else {
      throw new Error("Unsupported input type for bytesToHex");
    }
  }





  
  function _store(_privateKey, _publicKey, _address, _balance) {
    const accountOne = {
      privateKey: _privateKey,
      publicKey: _publicKey,
      address: _address,
      balance: _balance.toString(), 
    };
    const accountOneData = JSON.stringify(accountOne);
    writeFileSync("account_2.json", accountOneData);
  }
  
  
  async function main() {
    const { mnemonic, entropy } = _generateMnemonic();
    console.log(`WARNING! Never disclose your Seed Phrase:\n ${mnemonic}`);
  
    const hdRootKey = _getHdRootKey(entropy);
  
    const accountOneIndex = 0;
    const accountOnePrivateKey = _generatePrivateKey(hdRootKey, accountOneIndex);
    console.log(`Account One Private Key: ${bytesToHex(accountOnePrivateKey)}`);
  
    const accountOnePublicKey = _getPublicKey(accountOnePrivateKey);

  
    const accountOneAddress = '0x' + _bytesToHex(_getEthAddress(accountOnePublicKey));
    console.log(`Account One Wallet Address: ${accountOneAddress}`);
    

    const balance = await _getBalance(accountOneAddress);
    console.log(`Account Balance: ${balance} `);
  
    _store(accountOnePrivateKey, accountOnePublicKey, accountOneAddress,balance);



    
 
}

  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  