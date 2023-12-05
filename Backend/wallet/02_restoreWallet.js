const { mnemonicToEntropy } = require("ethereum-cryptography/bip39");
const { wordlist } = require("ethereum-cryptography/bip39/wordlists/english");
const { HDKey } = require("ethereum-cryptography/hdkey");
const { privateToPublic, toChecksumAddress } = require("ethereumjs-util");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { bytesToHex } = require("ethereum-cryptography/utils");
const { writeFileSync } = require("fs");
  

//while the wallet i s lossed 
//using the ssed-phase restore the wallet 
//pass the seed phase and restore the wallet

async function main(_mnemonic) {
  const entropy = mnemonicToEntropy(_mnemonic, wordlist);
   const hdRootKey = HDKey.fromMasterSeed(entropy);
  const privateKeyBuffer = Buffer.from(hdRootKey.deriveChild(0).privateKey);
  const publicKey = privateToPublic(privateKeyBuffer);
  const  address = keccak256(publicKey).slice(-20);

   console.log(`Account One Wallet Address: 0x${bytesToHex(address)}`);

const accountOne = {
    privateKey: privateKeyBuffer,
    publicKey: publicKey,
    address: address,
  };
  const accountOneData = JSON.stringify(accountOne);
  writeFileSync("account 1.json", accountOneData);
    console.log(`Account One Private Key: ${bytesToHex(privateKeyBuffer)}`);
}
main(process.argv[2])
   .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
