// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



// create a own Mkt token 

contract Mkt is   Ownable  {

//errors

error  Mkt_NotZeroAccount();
error Mkt__AmountMustBeMoreThanZero();

//mappings

mapping (address user => uint256 token) public s_UserToAmountMined;
mapping (address user => uint256 token) public s_UserToRewardMined;



    constructor() ERC20("makeit", "MKT"){
    _mint(msg.sender, 1000000 * 10 ** 18);
    
    }


    //tresnfer to specific address
 function mint(address _to, uint256 _amount) private onlyOwner {
    if(_to == address(0)){
        revert Mkt_NotZeroAccount();
    }
    if(_amount <=0){
   revert Mkt__AmountMustBeMoreThanZero();
    }
      s_UserToAmountMined[_to] +=_amount;
        _mint(_to, _amount);
    }


//burn token
function burn(uint256 _amount) private onlyOwner {
    _burn(msg.sender, _amount);
    }


 // rewards
     function reward(address _recipient,uint256 _amount)public onlyOwner{
        if(_recipient == address(0)){
        revert Mkt_NotZeroAccount();
    }
    if(_amount <=0){
   revert Mkt__AmountMustBeMoreThanZero();
    }

    s_UserToRewardMined[_recipient] += _amount;
    _mint(_recipient, _amount);

    
    }   
}

