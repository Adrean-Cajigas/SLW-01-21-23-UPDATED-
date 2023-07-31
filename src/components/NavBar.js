import React, { useRef, Component, useEffect, useState } from 'react';
import { BASE_BACKEND_URL } from '../config.js'
import { Link } from 'react-router-dom';
import './navbar.css';
import '../../public/stylesheets/style.css'
import LoginButton from './LoginButton';
import LoginPopup from './LoginPopup';
import Notifications from './Notification';
import SignupPopup from './SignupPopup';
import SignUpButton from './SignUpButton.js';

function MyServicesNavButton(props) {
    var token = localStorage.getItem('token');
    var decodedToken = {};
    if (token) {
        decodedToken = JSON.parse(atob(token.split('.')[1]));
    }
    const [notifications, setNotifications] = useState([]);

    function fetchNotificationData() {
        const fetchData = async () => {
            try {
                var token = localStorage.getItem('token');
                if (token) {
                    const response = await fetch(`${BASE_BACKEND_URL}/userdata/get-all-user-notifications`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            setNotifications(data.notifications);
                        })
                }
                else {

                }
            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    };


    if (props.constantUpdate)
        useEffect(() => {
            fetchNotificationData();
        });
    else
        useEffect(() => {
            fetchNotificationData();
        }, []);

    if (decodedToken.clubAdmin || decodedToken.eventAdmin || decodedToken.volunteerAdmin || decodedToken.internshipAdmin) {
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
    const [isShowingSignupPopup, setIsShowingSignupPopup] = useState(false);
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
        setIsShowingSignupPopup(false);
    }

    function showSignupPopup() {
        setIsShowingSignupPopup(true);
        setIsShowingLoginPopup(false);
    }

    function hidePopups() {
        setIsShowingLoginPopup(false);
        setIsShowingSignupPopup(false);
    }

    const searchRef = useRef(null);

    // Add event listener to the search bar
    useEffect(() => {
        const handleSearch = (event) => {
            if (event.key === 'Enter') {
                // Prevent the form from submitting
                event.preventDefault();

                // Perform search logic here
                const searchText = searchRef.current.value.trim().split(' ').join('+');
                const url = "/services?keyword=" + searchText;
                window.location.href = url;
            }
        };

        // Attach the event listener to the search bar
        searchRef.current.addEventListener('keyup', handleSearch);

        // Clean up the event listener
        return () => {
            if (searchRef.current) {
                searchRef.current.removeEventListener('keyup', handleSearch);
            }
        };
    }, []);

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
                            <img src="photos-optimized/CClogo-opt.png" className="navbar-logo" />
                        </a>
                        {window.innerWidth > 425 &&
                            <div id="nav-menu-search-bar">
                                <input
                                    className='search-bar-input'
                                    placeholder="Search..."
                                    ref={searchRef}
                                />
                                <img src="Photos/search.png" className="navbar-search-icon" />
                            </div>
                        }

                        <a
                            className="navigation-button navigation-text"
                            href="/">
                            Home</a>
                        <Link
                            className="navigation-button navigation-text"
                            to="/services"
                        >Explore</Link>
                        <MyServicesNavButton token={token} constantUpdate={props.constantUpdate} />
                        <a
                            className="navigation-button navigation-text"
                            href="https://www.mjc.edu/"
                            target="_blank"
                        >MJC</a>
                        <LoginButton ShowLoginPopup={showLoginPopup} token={token} />
                        <SignUpButton ShowSignupPopup={showSignupPopup} token={token}></SignUpButton>
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

            <div id="nav-menu-search-bar">
                <input
                    className='search-bar-input'
                    placeholder="Search..."
                    ref={searchRef}
                />
                <img src="Photos/search.png" className="navbar-search-icon" />
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
                    <a href="/">
                        <img
                            src="photos-optimized/CClogo-opt.png"
                            className="navbar-logo mobileLogo"
                        />
                    </a>
                </div>
            </div>
            <LoginPopup isShowingLoginPopup={isShowingLoginPopup} showSignupPopup={showSignupPopup} />
            <SignupPopup isShowingSignupPopup={isShowingSignupPopup} showLoginPopup={showLoginPopup} />
            <div
                id='login-popup-background'
                className={isShowingLoginPopup || isShowingSignupPopup ? '' : 'hidden'}
                onClick={hidePopups}
                style={{ cursor: 'pointer' }}
            >
            </div>
        </div>
    )
}

export default NavBar;