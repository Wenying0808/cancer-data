import React from "react";
import "./navbar.css";

const Navbar = ({activeSelection, onNavbarClick}) => {


    return(
        <nav className="navbar">
            <div className="section-header">Cancer Prevalence</div>
            <ul>
                <li><a href="#section1" onClick={ () => onNavbarClick("section1")} className={activeSelection==="section1" ? "activeNavItem" : ""}>Prevalence Around The World</a></li>
                <li><a href="#section2" onClick={ () => onNavbarClick("section2")} className={activeSelection==="section2" ? "activeNavItem" : ""}>Prevalence Of cancer by type</a></li>
                <li><a href="#section3" onClick={ () => onNavbarClick("section3")} className={activeSelection==="section3" ? "activeNavItem" : ""}>cancer prevalence by age</a></li>
                <li><a href="#section4" onClick={ () => onNavbarClick("section4")} className={activeSelection==="section4" ? "activeNavItem" : ""}>global burden from cancer</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;