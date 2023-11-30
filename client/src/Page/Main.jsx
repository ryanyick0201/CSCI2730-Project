export default () => {

  return <div className={'MainPage'}>
    <div className="top">
      <h2>My policies</h2>
      <table cellSpacing={20}>
        <tr>
          <th>Policy ID</th>
          <th>Departure date</th>
          <th>Departure time</th>
          <th>Flight number</th>
          <th>Class</th>
          <th>Status</th>
          <th>Make a claim</th>
        </tr>
        {
          new Array(5).fill(null).map((_, i) => {
            return <tr>
              <td>1</td>
              <td>2021-08-01</td>
              <td>10:00</td>
              <td>AA123</td>
              <td>Economy</td>
              <td>Active</td>
              <td>
                <button>Claim</button>
              </td>
            </tr>
          })
        }

      </table>
    </div>
    <div className={'bottom'}>
      <div className="bottomLeft">
        <h2>Secure your next flight</h2>
        <div className="formContainer">
          <div className="formRow">
            <div className="formItem">
              <div className="label">Date of departure</div>
              <input type={'date'} />
            </div>
            <div className="formItem">
              <div className="label">Departure time</div>
              <input type={'time'} />
            </div>
          </div>
          <div className="formRow">
            <div className="formItem">
              <div className="label">Flight number</div>
              <input type={'number'} />
            </div>
            <div className="formItem">
              <div className="label">Number of persons</div>
              <input type={'number'} />
            </div>
          </div>
          <div className="formRow">
            <div className="formItem">
              <div className="label">Ticket price (per person) (USD)</div>
              <input type={'number'} />
            </div>
            <div className="formItem">
              <div className="label">Plan</div>
              <input />
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '30px',
          }}
        >
          <button>Check out</button>
        </div>
      </div>

      <div className="bottomRight">
        <div className="plan">
          <div className="title">Basic plan</div>
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
          <div className="desc">Coverage</div>
          <ul>
            <li className="li">0.06 ETH for 3-6 hours delay</li>
            <li className="li">0.15 ETH for &gt;6 hours delay</li>
          </ul>
          <div className="desc">Premium</div>
          <ul>
            <li className="li">0.02 ETH</li>
            <li className="li">Limited to ticket price >= 400USD</li>
          </ul>
        </div>
      </div>

    </div>
  </div>
}
