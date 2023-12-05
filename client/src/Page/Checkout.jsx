import { useState } from 'react'
import useProfile from '../Hooks/profile'
// policyId: result.policyNumber
export default () => {
  const { web3, address, contract } = useProfile()

  const handleCheckOut = () => {
    const form = JSON.parse(localStorage.getItem('policy') || '{}')
    const {
      date,
      time,
      flightNumber,
      numberOfPersons,
      ticketPrice,
      plan,
    } = form

    contract && address && (async() => {
      try {
        console.log(`Address is ${address}, ${date}, ${time}, ${flightNumber}, ${numberOfPersons}, ${plan}`)
        console.log('Contract:', contract)
        console.log('Web3:', web3)

        const txObject = await contract.methods.createPolicy(
          date,
          time,
          flightNumber,
          numberOfPersons,
          plan,
        )

        const gas = await txObject.estimateGas({
          from: address,
          value: web3.utils.toWei((plan === 0
            ? '0.01'
            : '0.02') * numberOfPersons, 'ether'),
        })
        console.log('Estimated gas:', gas)

        // Send the transaction
        const result = await txObject.send({
          from: address,
          gas,
          value: web3.utils.toWei((plan === 0
            ? '0.01'
            : '0.02') * numberOfPersons, 'ether'),
        })

        localStorage.setItem(
          'policy',
          JSON.stringify({ ...form, policyId: result.transactionHash }),
        )
        window.location.href = '/confirm'
      } catch (e) {
        console.log(e)
      }

    })()
  }

  const [data] = useState(JSON.parse(localStorage.getItem('policy') || '{}'))
  return <div className={'CheckOutPage'}>

    <div className="title">Confirm your insurance policy</div>
    <div className="description">
      <div className="label">Date of departure</div>
      <div className="item">{
        data.date
      }</div>
    </div>
    <div className="description">
      <div className="label">Departure time</div>
      <div className="item">        {
        Number(data.time) > 1200
          ? `${Number(data.time) - 1200} pm`
          : `${Number(data.time)} am`
      }
      </div>
    </div>
    <div className="description">
      <div className="label">Flight number</div>
      <div className="item">{
        data.flightNumber
      }</div>
    </div>
    <div className="description">
      <div className="label">Number of persons</div>
      <div className="item">{
        data.numberOfPersons
      }</div>
    </div>
    <div className="description">
      <div className="label">Plan</div>
      <div className="item">{
        data.plan ? 'Premium' : 'Basic'
      }</div>
    </div>
    <div className="description">
      <div className="label">Policy premium</div>
      <div className="item">{
        data.plan
          ? '0.02' * data.numberOfPersons
          : '0.01' * data.numberOfPersons
      }ETH
      </div>
    </div>
    <div className="bottom">
      <button onClick={() => handleCheckOut()}>Confirm</button>
    </div>
  </div>
}
