import React from "react";
import "../section/section.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Section2 = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Prevalence Of cancer by type</div>
            <div className="description" id="description">This related chart shows the estimated number of people with each type of cancer:</div>
            <div className="control" id="control">
                <ToggleButtonGroup>
                    <ToggleButton value="table">Table</ToggleButton>
                    <ToggleButton value="map">Map</ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="canvas" id="canvas"></div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section2;