import React from "react";
import "./section.css";

const Section = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">title</div>
            <div className="description" id="description">description</div>
            <div className="control" id="control">control</div>
            <div className="canvas" id="canvas">canvas</div>
            <div className="resource" id="resource">resource</div>
        </section>
    )
};

export default Section;