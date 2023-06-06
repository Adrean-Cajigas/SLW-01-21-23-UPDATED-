import React, { useRef, Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import '../../public/stylesheets/style.css'
import LoginButton from './LoginButton';
import LoginPopup from './LoginPopup';
import { useRect } from 'react-use-rect';
import Notifications from './Notification';

function MyServicesNavButton(props) {
    const [notifications, setNotifications] = useState([]);

    // IF PERFORMANCE BECOMES AN ISSUE ON THE WEBSITE THIS IS MOST LIKELY THE CAUSE
    // REWORK THIS USE EFFECT TO CHANGE ONLY WHEN YOU WANT IT TO CHANGE BY PASSING A STATE
    // IF PERFORMANCE DROPS, I just don't know what the boss wants exactly so I am leaving it like this
    useEffect(() => {
        const fetchData = async () => {
            try {
                var token = localStorage.getItem('token');
                // if (token) {
                //     const response = await fetch('http://localhost:3000/get-all-user-notifications',
                //         {
                //             headers: {
                //                 'Authorization': `Bearer ${token}`
                //             }
                //         })
                //         .then(response => response.json())
                //         .then(data => {
                //             setNotifications(data.notifications);
                //         })
                // }
                // else {
                //     console.log('no token found')
                // }
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, []);

    if (props.token) {
        return (
            <Link
                className="navigation-button navigation-text relative-container"
                to="/my-services"
                id="applicants"
            >
                <Notifications notifications={notifications ? notifications.length : 0} />
                My Services</Link>
        )
    }

    return null;
}

function NavBar(props) {
    const [isShowingLoginPopup, setIsShowingLoginPopup] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [token, setToken] = useState(false);
    const [showNavBarMobile, setShowNavBarMobile] = useState(false);

    useEffect(() => {
        const handleScroll = event => {
            if (props.isFixedPage) { // prevent it from looking different if the bar is fixed
                setHasScrolled(window.scrollY > 0 ? true : false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    })

    // get token from local storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        setToken(token);
    }, [setToken]);

    function showLoginPopup() {
        setIsShowingLoginPopup(true);
    }

    return (
        <div>
            <div
                className={"navigation-bar" + (props.isFixedPage ? '' : " not-fixed") + (showNavBarMobile ? " active" : "")}
            >
                <div className={'navigation-menu-wrapper' + (hasScrolled ? ' scrolled' : '')}>
                    <nav
                        className={"navigation-menu"}
                    >

                        <a href="/">
                            <img src="Photos/CClogo.png" className="navbar-logo" />
                        </a>
                        <input
                            placeholder="Search..."
                            id="nav-menu-search-bar"
                        />
                        <a
                            className="navigation-button navigation-text"
                            href="/">
                            Home</a>
                        <Link
                            className="navigation-button navigation-text"
                            to="/services"
                        >Explore</Link>
                        <MyServicesNavButton token={token} />
                        <a
                            className="navigation-button navigation-text"
                            href="https://www.mjc.edu/"
                            target="_blank"
                        >MJC</a>
                        <LoginButton
                            ShowLoginPopup={showLoginPopup}
                            token={token}
                        />
                    </nav>
                </div>
                <div
                    className="navigation-sub-menu navigation-menu"
                >
                    <a
                        className="navigation-button navigation-text"
                        href="service-search"
                    >Subject and Career Path</a>
                    <a
                        className="navigation-button navigation-text"
                        href="service-search"
                    >Clubs and Communities</a>
                    <a
                        className="coming-soon navigation-button navigation-text"
                    >Volunteer &amp; Community Service</a>
                    <a
                        className="coming-soon navigation-button navigation-text"
                    >Internship &amp; Work Experience</a>
                </div>
            </div>
            <div
                className={"navigation-hamburger navigation-menu" + (showNavBarMobile ? " active" : "")}
                onClick={() => setShowNavBarMobile(!showNavBarMobile)}
            >
                <div>
                    <div className="navigation-line"></div>
                    <div className="navigation-line"></div>
                    <div className="navigation-line"></div>
                </div>
                <div className="center-content">
                    <a href="index.html">
                        <img
                            src="Photos/CClogo.png"
                            className="navbar-logo mobileLogo"
                        />
                    </a>
                </div>
            </div>
            <LoginPopup isShowingLoginPopup={isShowingLoginPopup} />
            <div
                id='login-popup-background'
                className={isShowingLoginPopup ? '' : 'hidden'}
                onClick={() => setIsShowingLoginPopup(false)}
                style={{ cursor: 'pointer' }}
            >
            </div>
        </div>
    )
}

export default NavBar;