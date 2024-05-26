import React from "react";
import "../section/section.css";
import ToggleButtonTableMap from "../toggleButton/toggleButtonTableMap";


const Section4 = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">The global disease burden from cancer</div>
            <div className="description" id="description">
                Disability-Adjusted Life Years (DALYs) per 100,000 individuals from all cancer types.
            </div>
            <div className="control" id="control">
                <ToggleButtonTableMap value={"table"}/>
            </div>
            <div className="canvas" id="canvas4"></div>
            <div className="slider-control" id="slider-control4"></div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section4;