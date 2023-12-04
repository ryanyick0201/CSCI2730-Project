import {useState} from "react";

export default () => {
    const [data] = useState(JSON.parse(localStorage.getItem('policy') || '{}'))
    return <div className={'CheckOutPage'}>
        <div className="title">Confirm your insurance policy</div>
        <div className="description">
            <div className="label">Policy ID</div>
            <div className="item">{
                data.policyId
            }</div>
        </div>
        <div className="description">
            <div className="label">Date of departure</div>
            <div className="item">{
                data.date
            }</div>
        </div>
        <div className="description">
            <div className="label">Departure time</div>
            <div className="item">{
                data.time
            }</div>
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
                data.plan ? '0.02' * data.numberOfPersons : '0.01' * data.numberOfPersons
            }ETH
            </div>
        </div>
        <div className="bottom">
            <button onClick={() => window.location.href = '/'}>Return</button>
        </div>
    </div>
}
