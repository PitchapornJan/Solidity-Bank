import './Home.css';
import React from 'react';
import moment from 'moment';

import { useState, useEffect } from 'react'
import { NavbarMenu } from './componant/NavbarMenu.js';

import { CONTACT_ABI, CONTACT_ADDRESS } from './config';

import Web3 from 'web3';

const Title = () => <h1 className='title-name'>ระบบฝาก-ถอน</h1>

function Home() {

  //connect web3
  const [account, setAccount] = useState();

  const [amount_deposit, setDeposit] = useState('');
  const [amount_withdraw, setWithdraw] = useState('');
  const [balance, setBalance] = useState();

  const [list, setList] = useState([]);

  // Connect web3
  const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

  useEffect(() => {
    async function load() {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
    }
    load();
  });

  // รับ contract ใน solidity เข้ามา
  const getContract = () => {
    const contractList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
    return contractList;
  }

  // function deposit
  const saveDeposit = () => {
    const contractInstance = getContract();
    const { methods } = contractInstance;
    const { deposit } = methods;
    if ((parseInt(amount_deposit) !== 0) && (amount_deposit.trim().length !== 0)) {
      deposit(amount_deposit).send({ from: account }).then((res) => {
        console.log(res);
        getBalance();
        getList();
        setDeposit('');
      }).catch((err) => console.log(err));
    } else {
      alert('Please input deposite not 0 and not Empty.');
    }
  }

  // function withdraw
  const saveWithdraw = () => {
    const contractInstance = getContract();
    const { methods } = contractInstance;
    const { withdraw } = methods;
    if ((parseInt(amount_withdraw) !== 0) && (amount_withdraw.trim().length !== 0)) {
      withdraw(amount_withdraw).send({ from: account }).then((res) => {
        console.log(res);
        getBalance();
        getList();
        setWithdraw('');
      }).catch((err) => console.log(err));
    } else {
      alert('Please input withdraw not 0 and not Empty.');
    }
  }

  // myBalance
  const getBalance = () => {
    const contractInstance = getContract();
    const { methods } = contractInstance;
    const { myBalance } = methods;
    myBalance().call({ from: account }).then((res) => {
      console.log(res);
      setBalance(res);
      return res;
    }).catch((err) => console.log(err));
  }

  //getListBalance
  const getList = () => {
    const contractInstance = getContract();
    const { methods } = contractInstance;
    const { getListBalance } = methods;
    getListBalance().call({ from: account }).then((res) => {
      console.log(res);
      setList(res);
      return res;
    }).catch((err) => console.log(err));
  }


  return (
    <div>
      <div>
        <NavbarMenu />
      </div>

      <div className='totle-name'>
        <Title />
      </div>

      <div className='body'>
        <p>You account is : {account} </p>
        <div className='form-control-deposit'>
          <h3>ฝาก</h3>
          <input className='deposit-input'
            type='number'
            min='1'
            value={amount_deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
          <button onClick={saveDeposit} className='btn-deposit' type='submit'>ฝาก</button>
        </div>

        <div className='form-control-withdarw'>
          <h3>ถอน</h3>
          <input className='withdraw-input'
            type='number'
            min='1'
            value={amount_withdraw}
            onChange={(e) => setWithdraw(e.target.value)}
          />
          <button onClick={saveWithdraw} className='btn-withdraw' type='submit'>ถอน</button>
        </div>

        <div className='border-text'>
          <p> เงินคงเหลือ :  {balance}</p>
          <button onClick={getBalance} style={{ margin: '5px' }}>แสดง</button>
        </div>
      </div>

      <div>
        <div className='list-title'>
          <p style={{ fontSize: '25px' }}>รายการฝาก - ถอน : </p>
          <button onClick={getList} className='btn-showList'>แสดงรายการ</button>
        </div>
        <div>
          {
            list.map((props) => {
              return (
                <ul key={props.time} className='item-list'>
                  <li>
                    <span>ฝาก : {props.deposit}</span>
                    <span>ถอน : {props.withdraw}</span>
                    <span>เวลา : {moment.unix(props.time).format("lll").toString()}</span>
                    <span>จาก : {props.owner}</span>
                  </li>
                </ul>)
            })
          };
        </div>

      </div>
    </div>
  );
}

export default Home;
