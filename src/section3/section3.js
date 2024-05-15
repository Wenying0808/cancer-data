import React from "react";
import "../section/section.css";
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";


const Section3 = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Cancer prevalence by age</div>
            <div className="description" id="description">By breaking down the data by age group, we can see that the majority of cancers are in older people.</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={"table"}/>
            </div>
            <div className="canvas" id="canvas"></div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section3;