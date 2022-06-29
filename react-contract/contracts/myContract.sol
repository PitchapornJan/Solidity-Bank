// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract myContract{

    // uint public count = 0;
    mapping (address => uint256) public accountBalance;

    struct listBalance {
        uint256 deposit;
        uint256 withdraw;
        uint time;
        address owner;
    }

    mapping (address => listBalance[]) public list;



    function deposit (uint256 amount) public {
        accountBalance[msg.sender]+=amount;
        setListBalance(amount,0,block.timestamp,msg.sender);
    }

    function withdraw (uint256 amount) public {
        require(amount<=accountBalance[msg.sender],"Your funds are not enough for withdraw.");
        accountBalance[msg.sender]-=amount;
        setListBalance(0,amount,block.timestamp,msg.sender);
    }

    function myBalance () public view returns(uint256){
        return accountBalance[msg.sender];
    }

    function setListBalance(uint256 _deposit ,uint256 _withdraw,uint _time ,address _owner) public {
        listBalance memory lists = listBalance(_deposit,_withdraw , _time , _owner);
        list[msg.sender].push(lists);
        // list[msg.sender].push(listBalance(_deposit,_withdraw , _time , _owner));
    }
    function getListBalance () public view returns(listBalance[] memory){
        return list[msg.sender];
    }
  
}