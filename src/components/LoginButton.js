import React, { Component, useEffect } from 'react';
import './navbar.css';

function LoginButton(props) {    

    if (!props.token){
        return (
            <a 
                className="navigation-button navigation-text" 
                onClick={props.ShowLoginPopup}
                style={{cursor:'pointer'}}
                id="navigation-login"
            >Login</a>
        )
    }

    return (
        <a 
            className="navigation-button navigation-text" 
            href="logout.html" 
            id="navigation-login"
        >Logout</a>
    )
}

export default LoginButton