export default () => {

  return <div className={'LoginPage'}>
    <div className="left">
      <div className={'row'}>
        <img src={'./img_1.png'} width={'136px'} />
        SecureFlight
      </div>
      <div className={'description'}>
        Elevate your travel experience with

        our Flight Delay Insurance
      </div>
    </div>
    <div className="right">
      <div className="title">
        Welcome
      </div>
      <div className="formItem">
        <div className="label">Wallet address</div>
        <input />
      </div>
      <div className="formItem">
        <div className="label">Password</div>
        <input type={'password'} />
      </div>
      <div className={'formItem'} style={{ textAlign: 'center' }}>
        <button>Login</button>
      </div>
    </div>
  </div>
}
