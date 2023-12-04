import {useState} from 'react'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link, Navigate,
} from 'react-router-dom'
import Checkout from './Page/Checkout'
import Main from './Page/Main'
import Register from './Page/Register'
import Login from './Page/Login'
import Complete from './Page/Complete'
import useProfile from './Hooks/profile'
import Confirm from "./Page/Confirm";

const router = createBrowserRouter([
    {
        path: '/register',
        element: (
            <Register/>
        ),
    },
    {
        path: '/login',
        element: (
            <Login/>
        ),
    },
    {
        path: '*',
        element: <Navigate to="/login" replace/>,
    },
])

const authRouter = createBrowserRouter([

    {
        path: '/',
        element: (
            <Main/>
        ),
    },
    {
        path: '/checkout',
        element: (
            <Checkout/>
        ),
    },
    {
        path: '/complete',
        element: (
            <Complete/>
        ),
    },
    {
        path: '/confirm',
        element: (
            <Confirm/>
        ),
    },
])

const Header = () => {
    const {address, setAddress} = useProfile()
    const handleLogout = () => {
        setAddress('')
        localStorage.removeItem('address')
        window.location.href = '/login'
    }
    return <div className={'Header'}>
        <img src={'./img.png'} width={76}/>
        {address ? (<button onClick={handleLogout}>Logout</button>) : (
            <div style={{display: 'flex', gap: 12}}>
                <button onClick={() => window.location.href = '/login'}>
                    Login
                </button>
                <button onClick={() => window.location.href = '/register'}>Register</button>
            </div>)}
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
            <Auth></Auth>
        </div>
        <div><Footer></Footer></div>

    </div>
}
const Auth = () => {
    const {address} = useProfile()

    if (!address) {
        return <RouterProvider router={router}/>
    } else {
        return <RouterProvider router={authRouter}/>
    }
}
createRoot(document.getElementById('root')).render(
    <Container/>,
)
