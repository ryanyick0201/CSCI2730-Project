import {useState} from 'react'
import useProfile from '../Hooks/profile'

export default () => {
    const [form, setForm] = useState({
        address: '',
        password: '',
    })
    const {setAddress} = useProfile()
    const handleLogin = async () => {
        const res = await fetch('http://localhost:8000/authenticate', {
            method: 'POST',
            body: JSON.stringify({
                walletAddress: form.address,
                password: form.password,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if (data.authenticated) {
            localStorage.setItem('address', form.address)
            setAddress(form.address)
            window.location.href = '/'
        } else {
            alert('Wrong password')
        }
    }
    return <div className={'LoginPage'}>
        <div className="left">
            <div className={'row'}>
                <img src={'./img_1.png'} width={'136px'}/>
                SecureFlight
            </div>
            <div className={'description'}>
                Elevate your travel experience with

                our Flight Delay Insurance
            </div>
        </div>
        <div className="right">
            <div className="title">
                Welcome back
            </div>
            <div className="formItem">
                <div className="label">Wallet address</div>
                <input
                    onChange={e => setForm(prev => ({
                        ...prev,
                        address: e.target.value,
                    }))}
                />
            </div>
            <div className="formItem">
                <div className="label">Password</div>
                <input
                    type={'password'}
                    onChange={e => setForm(prev => ({
                        ...prev,
                        password: e.target.value,
                    }))}
                />
            </div>
            <div className={'formItem'} style={{textAlign: 'center'}}>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    </div>
}
