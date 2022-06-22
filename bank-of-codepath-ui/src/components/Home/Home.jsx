import * as React from "react"
import { useEffect } from "react"
import AddTransaction from "../AddTransaction/AddTransaction"
import AddTransfer from "../AddTransfer/AddTransfer"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"
import axios from "axios"

export default function Home(props) {
  const [fieldError, setFieldError] = React.useState("")

  const filteredTransactions = props.filterInputValue ? props?.transactions.filter((transaction) => transaction.description.toLowerCase().indexOf(props.filterInputValue.toLowerCase()) !== -1) : props?.transactions

  // const filteredTransfers = props.filterInputValue ? props?.transfers.filter((transfer) => transfer.recipientEmail.toLowerCase().indexOf(props.filterInputValue.toLowerCase()) !== -1) : props?.transfers


const handleOnSubmitNewTransaction = () => {
  console.log("On submit transaction function")
}

const handleOnCreateTransaction = async() => {
  props.setIsCreating(true)
  await axios.post("http://localhost:3001/bank/transactions", {transaction: props.newTransactionForm})
  .catch((err) => {
    props.setError(err)
    props.setIsCreating(false)
  })
  .then(res => {
    props.setTransactions((prevTransactions) => [...prevTransactions, res?.data?.transaction])
    console.log(res.data.transaction)
  })
  .finally(() => {
    props.setNewTransactionForm({
      category: "",
      description: "",
      amount: 0
    })
    props.setIsCreating(false)
    console.log(props.transactions)
  })
}

const handleOnCreateTransfer = async() => {
  if (props.newTransferForm.recipientEmail === "") {
    setFieldError("email error")
    return;
  }
  props.setIsCreating(true)
  await axios.post("http://localhost:3001/bank/transfers", {transfer: props.newTransferForm})
  .catch((err) => {
    props.setError(err)
    props.setIsCreating(false)
  })
  .then(res => {
    console.log(res)
    props.setTransfers((prevTransfers) => [...prevTransfers, res?.data?.transfer])
  })
  .finally(() => {
    props.setNewTransferForm({
      memo: "",
      recipientEmail: "",
      amount: 0
    })
    props.setIsCreating(false)
  })
}


useEffect(() => {
  const getData = async () => {
    props.setIsLoading(true)
    try {
      const transactionsResult = await axios.get("http://localhost:3001/bank/transactions")
      if (transactionsResult?.data?.transactions) {
        props.setTransactions(transactionsResult.data.transactions)
      }

      const transfersResult = await axios.get("http://localhost:3001/bank/transfers")
      if (transfersResult?.data?.transfers) {
        props.setTransfers(transfersResult.data.transfers)
        console.log(transfersResult.data)
      }

    } catch (err) {
      console.log(err)
      props.setError(err)
    } finally {
      props.setIsLoading(false)
    }
  }
  getData()
}, [])


  return (
    <div className="home">
      <AddTransaction isCreating={props.isCreating} setIsCreating={props.setIsCreating} form={props.newTransactionForm} setForm={props.setNewTransactionForm} handleOnSubmit={handleOnCreateTransaction}/>
      <AddTransfer isCreating={props.isCreating} setIsCreating={props.setIsCreating} form={props.newTransferForm} setForm={props.setNewTransferForm} handleOnSubmit={handleOnCreateTransfer} fieldError={fieldError} setFieldError={setFieldError}/>
      {props.isLoading ? (<h1>Loading...</h1>) : (<BankActivity transactions={filteredTransactions} transfers={props.transfers}/>)}
      {props.error ? <h2 className="error">Error message</h2> : null}
    </div>
  )
}
