import { useEffect, useState } from 'react'
import useProfile from '../Hooks/profile'

export default () => {
  const { web3, address, contract } = useProfile()
  const [policy, setPolicy] = useState([])
  const [form, setForm] = useState({
    date: '',
    time: '',
    flightNumber: '',
    numberOfPersons: '',
    ticketPrice: '',
    plan: '',
  })

  useEffect(() => {
    console.log(form)
  }, [form])
  useEffect(() => {
    const fetchData = async() => {
      if (contract && address) {
        try {
          const result = await contract.methods.viewPolicyByWallet(address)
          .call()
          const policyIds = result.map(Number)

          const policies = await Promise.all(policyIds.map(async id => {
            console.log(`Fetching policy for ID:`, id)
            return await contract.methods.viewPolicyByID(id).call()
          }))

          // Use functional update to ensure you're working with the latest state
          setPolicy(prevPolicy => [...prevPolicy, ...policies])

          console.log(`Final policies:`, policies)
        } catch (error) {
          console.error(`Error fetching policies:`, error)
        }
      }
    }

    fetchData()
  }, [contract, address])

  const handleCheckOut = () => {
    localStorage.setItem('policy', JSON.stringify({ ...form }))
    window.location.href = '/checkout'
  }

  const claim = async(item, isLarge, isValidClaim) => {
    try {
      console.log(Number(item[0]));
      console.log(isLarge);
      console.log(isValidClaim);

      const txObject = await contract.methods.claim(
        Number(item[0]),
        !isLarge,
        isLarge,
        isValidClaim,
      )
      console.log(txObject);
      const gas = await txObject.estimateGas({
        from: address,
      });

      console.log('Estimated gas:', gas)

      // Send the transaction
      const result = await txObject.send({
        from: address,
        gas,
      })

      window.location.reload();
      window.alert("Your claim application has finished. Check the latest claim status for more detail.");

      localStorage.setItem('claim', JSON.stringify(item))
      window.location.href = '/complete'
    } catch (e) {
      console.error(e)
    }
  }

  const handleClaim = async(item) => {
    try {
      const result = await fetch(`http://localhost:8000/flightDelayInfo?departureDate=${item[1]}&departureTime=${item[2]}&airline=${item[3]}`)
      const data = await result.json()

      if (!data[0]) {
        window.alert('No flight found')
        return
      } else {
        const delayTime = data[0].delayTime

        if (delayTime > 600) {
          claim(item, true, true)
        } else if (delayTime > 180) {
          claim(item, false, true)
        } else {
          claim(item, false, false)
        }
      }
    } catch (error) {
      console.error(`Error handling claim:`, error)
    }
  }

  return <div className={'MainPage'}>
    <div className="top">
      <h2>My policies</h2>
      <table cellSpacing={20}>
        <thead>
        <tr>
          <th>Policy ID</th>
          <th>Departure date</th>
          <th>Departure time</th>
          <th>Flight number</th>
          <th>Class</th>
          <th>Status</th>
          <th>Make a claim</th>
        </tr>
        </thead>
        <tbody>
        {policy.map((item, index) => (
          <tr key={index}>
            <td>{Number(item[0])}</td>
            <td>{`${String(item[1]).substring(6, 8)}-${String(item[1]).substring(4, 6)}-${String(item[1]).substring(0, 4)}`}</td>
            <td>{
              Number(item[2]) > 1200
                ? `${item[2]} pm`
                : `${item[2]} am`
            }</td>
            <td>{item[3]}</td>
            <td>{Number(item[5]) ? 'Premium' : 'Basic'}</td>
            <td>{{
              0: 'Pending',
              1: 'Claimed',
              2: 'Unclaimed',
            }[Number(item[6])]}</td>
            <td>
              {(Number(item[6]) === 0) && (
                <button onClick={() => handleClaim(item)}>Claim</button>
              )}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
    <div className={'bottom'}>
      <div className="bottomLeft">
        <h2>Secure your next flight</h2>
        <div className="formContainer">
          <div className="formRow">
            <div className="formItem">
              <div className="label">Date of departure</div>
              <input
                type={'date'} onBlur={(e) => setForm(prev => ({
                ...prev,
                date: Number(e.target.value.split('-').join('')),
              }))}
              />
            </div>
            <div className="formItem">
              <div className="label">Departure time</div>
              <input
                type={'time'}
                onBlur={(e) =>
                  setForm(prev => ({
                    ...prev,
                    time: Number(e.target.value.split(':').join('')),
                  }))
                }

              />
            </div>
          </div>
          <div className="formRow">
            <div className="formItem">
              <div className="label">Flight number</div>
              <input
                onChange={(e) => {
                  setForm(prev => ({
                    ...prev,
                    flightNumber: e.target.value,
                  }))
                }}
              />
            </div>
            <div className="formItem">
              <div className="label">Number of persons</div>
              <input
                type={'number'}
                onChange={(e) => {
                  setForm(prev => ({
                    ...prev,
                    numberOfPersons: Number(e.target.value),
                  }))
                }}
              />
            </div>
          </div>
          <div className="formRow">
            <div className="formItem">
              <div className="label">Ticket price (per person) (USD)</div>
              <input
                type={'number'}
                onChange={(e) => {
                  const ticketPrice = Number(e.target.value)
                  setForm((prev) => ({
                    ...prev,
                    ticketPrice: ticketPrice,
                    plan: ticketPrice > 400 ? 1 : 0, // If ticket price > 400, set plan to Premium (1), otherwise set to Basic (0)
                  }))
                }}
              />
            </div>

            <div className="formItem">
              <div className="label">Plan</div>
              <select
                disabled
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    plan: Number(e.target.value),
                  }))
                }}
                value={form.plan} // Ensure the select value is controlled by the form state
              >
                <option value="0">Basic</option>
                <option value="1">Premium</option>
              </select>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
          }}
        >
          <button onClick={handleCheckOut}>Check out</button>
        </div>
      </div>

      <div className="bottomRight">
        <div className="plan">
          <div className="title">Basic plan</div>
          <br />
          <div className="desc">Coverage</div>
          <ul>
            <li className="li">0.03 ETH for 3-6 hours delay</li>
            <li className="li">0.07 ETH for &gt;6 hours delay</li>
          </ul>
          <div className="desc">Premium</div>
          <ul>
            <li className="li">0.01 ETH</li>
            <li className="li">Limited to ticket price &lt; 400USD</li>
          </ul>
        </div>

        <div
          className="plan" style={{
          background: 'linear-gradient(238deg, #43AA60 9.71%, #3D7C4E 86.9%)',
        }}
        >
          <div className="title">Premium plan</div>
          <br />
          <div className="desc">Coverage</div>
          <ul>
            <li className="li">0.06 ETH for 3-6 hours delay</li>
            <li className="li">0.15 ETH for &gt;6 hours delay</li>
          </ul>
          <div className="desc">Premium</div>
          <ul>
            <li className="li">0.02 ETH</li>
            <li className="li">Limited to ticket price &gt; 400USD</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
}
