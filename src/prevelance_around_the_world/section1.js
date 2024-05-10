import React from "react";
import "../section/section.css";

const Section1 = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Prevalence Around The World</div>
            <div className="description" id="description">The estimated share of the total population with any form of cancer.</div>
            <div className="control" id="control">
                
            </div>
            <div className="canvas" id="canvas">canvas</div>
            <div className="resource" id="resource">resource</div>
        </section>
    )
};

export default Section1;