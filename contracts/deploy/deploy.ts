import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedCardFusion = await deploy("CardFusion", {
    from: deployer,
    args: ["CardFusion", "CF"],
    log: true,
    waitConfirmations: 1,
  });

  console.log(`CardFusion contract deployed at: `, deployedCardFusion.address);
  console.log(`Deployment transaction hash: `, deployedCardFusion.transactionHash);
};
export default func;
func.id = "deploy_cardFusion"; // id required to prevent reexecution
func.tags = ["CardFusion"];

