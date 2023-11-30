import * as React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom'
import Checkout from './Page/Checkout'
import Main from './Page/Main'
import Register from './Page/Register'
import Login from './Page/Login'
import Complete from './Page/Complete'

const router = createBrowserRouter([
  {
    path: '/register',
    element: (
      <Register />
    ),
  },
  {
    path: '/login',
    element: (
      <Login />
    ),
  },
  {
    path: '/',
    element: (
      <Main />
    ),
  },
  {
    path: '/checkout',
    element: (
      <Checkout />
    ),
  },
  {
    path: '/complete',
    element: (
      <Complete />
    ),
  },
  {
    path: 'about',
    element: <div>About</div>,
  },
])

const Header = () => {

  return <div className={'Header'}>
    <img src={'./img.png'} width={76} />
    <button>Login</button>
  </div>
}

const Footer = () => {

  return <div className={'Footer'}>
    <div className={'footerContent'}>
      <div className="text">CSCI2730 Project</div>
      <div className="text">SecureFlight</div>
      <div className="text">2023</div>
    </div>
  </div>
}

const Container = () => {

  return <div>

    <div><Header></Header></div>
    <div className={'content'}>
      <RouterProvider router={router} />
    </div>
    <div><Footer></Footer></div>

  </div>
}
createRoot(document.getElementById('root')).render(
  <Container />,
)
