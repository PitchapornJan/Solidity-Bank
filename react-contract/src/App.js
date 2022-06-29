import './App.css';
import React from 'react';

import {useState , useEffect} from 'react'
import {NavbarMenu} from './componant/NavbarMenu.js';
import DataContext from './data/DataContext';
import { BrowserRouter as Router,Routes, Route, Link} from "react-router-dom";
import { Button, ButtonGroup } from 'react-bootstrap';
import { ReactDOM } from 'react';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config';

//Componant
import Transaction from './componant/Transaction';
import ReportComponant from './componant/ReportComponant';
import FormIncomeComponant from './componant/FormIncomeComponant';
import FormExpenseComponant from './componant/FormExpenseComponant';

import Web3 from 'web3';

const Title = () => <h1 class='title-name'>ระบบฝาก-ถอน</h1>

function App() {

  //connect web3
  const [account , setAccount] = useState();
  const [contactList, setContactList] = useState();
  const [contacts, setContacts] = useState([]);

  useEffect(()=>{
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      // function เก็บค่า abi ,address 
      const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
      setContactList(contactList);
    }
    load();
  },[]);




  const [nameIncome, setNameIncome] = useState("");
  const [nameExpense, setNameExpense] = useState("");

  const handleIncome = (event) => {
    event.preventDefault();
    alert(`The name you entered was Income: ${nameIncome}`);
  }

  const handleExpense = (event) => {
    event.preventDefault();
    alert(`The name you entered was Expense: ${nameExpense}`);
  }

  // initData State
  // const initdata = [
  //   {id:1 , amount: -1000},
  //   {id:2 , amount: 15000},
  //   {id:3 , amount: -500}
  // ]
  // Built Array State
  const [items,setItems] = useState([])

  const [reportIncome,setReportIncome] = useState(0)
  const [reportExpense,setReportExpense] = useState(0)

  //Function 
  const onAddNewItem = (newItem) => {
    //ทพการวนลูปข้อมูล โดยดึงเอาข้อมูลเดิมที่อยู่ใน State Item มาต่อกับ newItem
    setItems((prevItem)=>{
      return [newItem,...prevItem]
    })
  }

  //ดัก State items
  useEffect(()=>{
    const amounts = items.map(items=>items.amount)
    /*เช็คว่า element อะไรบ้างมีค่ามากกว่า 0  และ total เก็บผลคำนวณข้อมูล total รวม element แต่ละตัว*/
    const income = amounts.filter(element=>element>0).reduce((total,element)=>total+=element,0)
    const expense = amounts.filter(element=>element<0).reduce((total,element)=>total+=element,0)*(-1)
    
    setReportIncome(income)
    setReportExpense(expense)
  },[items,reportIncome,reportExpense])


  return (
      <DataContext.Provider value={
        {
          income : reportIncome,
          expense : reportExpense  
        }
      }>
        <Router>
        <div>
          <NavbarMenu/>
          
          <div className='body'>
            <Title/>
            <ButtonGroup aria-label="Basic example" size='sm' className="mb-2 gap-2">
                <Button variant="outline-warning"><Link to='/'>ข้อมูลบัญชี</Link></Button>
                <Button variant="outline-warning"><Link to='/income'>ฝากเงิน</Link></Button>
                <Button variant="outline-warning"><Link to='/expense'>ถอนเงิน</Link></Button>
            </ButtonGroup>
            <p>You account is : {account} </p>

            {/* <div>
              <label>
                <p>ฝาก</p>
                <input  
                    type='number'
                    value={nameIncome}
                    onChange={(element) => setNameIncome(element.target.value)}
                />
                <button onClick={handleIncome} className='btn-income' type='submit' style={{padding : '10px', margin : '10px'}}>ฝาก</button>
              </label>
            </div>
            <div>
              <label>
                <p>ถอน</p>
                <input
                    type='number'
                    value={nameExpense}
                    onChange={(element) => setNameExpense(element.target.value)}
                />
                <button onClick={handleExpense} className='btn-expense' type='submit' style={{padding : '10px', margin : '10px'}}>ถอน</button>
              </label>
            </div> */}
            
          </div>
          <div className='container'>     
          <Routes>
            <Route path='/' exact element={<ReportComponant/> }></Route>
            <Route path='/income' element={<><FormIncomeComponant onAddItem={onAddNewItem}/><Transaction items={items}/></>}></Route>
            <Route path='/expense' element={<><FormExpenseComponant onAddItem={onAddNewItem}/> <Transaction items={items}/></>}></Route>
          </Routes>
          </div>
        </div>
        </Router>
      </DataContext.Provider>
  );
}

export default App;
