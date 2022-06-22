import * as React from "react"
import "./AddTransfer.css"

export default function AddTransfer(props) {
  const handleOnFormFieldChange = (e) => {
    if (e.target.name === "recipientEmail") props.setFieldError("")
    props.setForm({...props.form, [e.target.name]: e.target.value})
  }
  return (
    <div className="add-transfer">
      <h2>Add Transfer</h2>

      <AddTransferForm handleOnFormFieldChange={handleOnFormFieldChange} handleOnSubmit={props.handleOnSubmit} form={props.form} isCreating={props.isCreating}/>
    </div>
  )
}

export function AddTransferForm(props) {
  return (
    <div className="form">
      <div className="fields">
        <div className="field">
          <label>Memo</label>
          <input name="memo" value={props.form?.memo} placeholder="Enter a memo" onChange={props.handleOnFormFieldChange}/>
        </div>
        <div className="field">
          <label>Recipient</label>
          <input name="recipientEmail"value={props.form?.recipientEmail}placeholder="Enter a recipient" onChange={props.handleOnFormFieldChange}/>
        </div>
        <div className="field half-flex">
          <label>Amount (cents)</label>
          <input name="amount"value={props.form?.amount} type="number" onChange={props.handleOnFormFieldChange}/>
        </div>

        <button className="btn add-transfer" type="submit" onClick={props.handleOnSubmit}>
          Add
        </button>
      </div>
      {props.fieldError === "email error" ? <h2 className="error">Recipient email is required.</h2> : null}
    </div>
  )
}
