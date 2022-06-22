import * as React from "react"
import { formatAmount, formatDate } from "../../utils/format"
import "./TransferDetail.css"
import { useParams } from "react-router-dom"
import axios from "axios"


export default function TransactionDetail() {
  const [hasFetched, setHasFetched] = React.useState(false)
  const [transfer, setTransfer] = React.useState({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const transferId = useParams()?.transferId

  React.useEffect(() => {
    const fetchTransferById = async () => {
      setIsLoading(true)
      if(!transferId) {
        return;
      }
      try {
        const result = await axios.get(`http://localhost:3001/bank/transfers/${transferId}`)
        if (result?.data?.transfer) {
          setTransfer(result.data.transfer)
        }
      } catch (err) {
        setError(err)
        console.log(err)
      } finally {
        setIsLoading(false)
        setHasFetched(true)
      }
    }
    fetchTransferById()
  }, [transferId])

  return (
    <div className="transfer-detail">
      <TransferCard transfer={transfer} transferId={transferId} hasFetched={hasFetched}/>
    </div>
  )
}

export function TransferCard({ transfer = {}, transferId = null , hasFetched}) {
  return (
    <div className="transfer-card card">
      <div className="card-header">
        <h3>Transfer #{transferId}</h3>
        {Object.keys(transfer).length === 0 && hasFetched  === true ? <h1>Not Found</h1> : null}
        <p className="category">{transfer.category}</p>
      </div>

      <div className="card-content">
        <p className="description">{transfer.description}</p>
      </div>

      <div className="card-footer">
        <p className={`amount ${transfer.amount < 0 ? "minus" : ""}`}>{formatAmount(transfer.amount)}</p>
        <p className="date">{formatDate(transfer.postedAt)}</p>
      </div>
    </div>
  )
}
