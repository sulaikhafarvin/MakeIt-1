const{ethers, network}= require("hardhat");
const{ networkConfig,developmentChains}= require("../heplers-hardhat.config")


module.exports = async function({ getNamedAccounts, deployments}){
    const{deploy,log}=deployments;
    const{deployer}= await getNamedAccounts();
    const chainId = network.config.chainId;

    console.log("deploying....")

    const mktToken= await deploy('Mkt',{
        from: deployer,
        args: [],
        log:true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });
    console.log("deployed");
         // Verification
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(mktToken.address, args);
  }

}

module.exports.tags = ["all","mktToken"]