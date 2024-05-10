import React from "react";
import "./navbar.css";

const Navbar = () => {

    const onNavbarClick = () => {};
    return(
        <nav className="navbar">
            <div className="section-header">Cancer Prevalence</div>
            <ul>
                <li><a href="#section1" onClick={ () => onNavbarClick()}>Prevalence Around The World</a></li>
                <li><a href="#section2" onClick={ () => onNavbarClick()}>Prevalence Of cancer by type</a></li>
                <li><a href="#section3" onClick={ () => onNavbarClick()}>cancer prevalence by age</a></li>
                <li><a href="#section4" onClick={ () => onNavbarClick()}>global burden from cancer</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;