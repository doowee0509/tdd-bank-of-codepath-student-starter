import * as React from "react"
import { formatAmount, formatDate } from "../../utils/format"
import "./TransactionDetail.css"
import { useParams } from "react-router-dom"
import axios from "axios"


export default function TransactionDetail() {
  const [hasFetched, setHasFetched] = React.useState(false)
  const [transaction, setTransaction] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const transactionId = useParams()?.transactionId

  React.useEffect(() => {
    const fetchTransactionById = async () => {
      setIsLoading(true)
      if(!transactionId) {
        return;
      }
      try {
        const result = await axios.get(`http://localhost:3001/bank/transactions/${transactionId}`)
        if (result?.data?.transaction) {
          setTransaction(result.data.transaction)
        }
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
        setHasFetched(true)
      }
    }
    fetchTransactionById()
  }, [transactionId])

  return (
    <div className="transaction-detail">
      <TransactionCard transaction={transaction} transactionId={transactionId} hasFetched={hasFetched}/>
    </div>
  )
}

export function TransactionCard({ transaction = {}, transactionId = null, hasFetched}) {
  console.log(transaction)
  return (
    <div className="transaction-card card">
      <div className="card-header">
        <h3>Transaction #{transactionId}</h3>
        {Object.keys(transaction).length === 0 && hasFetched  === true ? <h1>Not Found</h1> : null}
        <p className="category">{transaction.category}</p>
      </div>

      <div className="card-content">
        <p className="description">{transaction.description}</p>
      </div>

      <div className="card-footer">
        <p className={`amount ${transaction.amount < 0 ? "minus" : ""}`}>{formatAmount(transaction.amount)}</p>
        <p className="date">{formatDate(transaction.postedAt)}</p>
      </div>
    </div>
  )
}
