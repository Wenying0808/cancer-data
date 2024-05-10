import React from "react";
import "../section/section.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Section4 = ({id, isActive}) => {
    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">The global disease burden from cancer</div>
            <div className="description" id="description">
                Disability-Adjusted Life Years (DALYs) per 100,000 individuals from all cancer types.
            </div>
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

export default Section4;