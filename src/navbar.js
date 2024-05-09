import React from "react";

const Navbar = () => {

    const onNavbarClick = () => {};
    return(
        <nav className="navbar">
            <ul>
                <li><a href="#section1" onClick={ () => onNavbarClick()}>Section1</a></li>
                <li><a href="#section2" onClick={ () => onNavbarClick()}>Section2</a></li>
                <li><a href="#section3" onClick={ () => onNavbarClick()}>Section3</a></li>
                <li><a href="#section4" onClick={ () => onNavbarClick()}>Section4</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;