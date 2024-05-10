import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import "../section/section.css";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

const Section1 = ({id, isActive}) => {

    const [dataVisualization, setDataVisualization] = useState("table");

    const [section1Data, setSection1Data] = useState([]);

    useEffect(() => {
        d3.csv("./bog_bodies.csv").then(function(data,error){
            if(error){
                console.log("fetchdata", error);
            } else{
                setSection1Data(data);
                console.log("fetched data:", data);
            }
        });
        let dataset;
        
        d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json").then(
            (data, error) => {
                if (error) {
                    console.log("fetchjsondata", error);
                }else{
                    dataset = data;
                    console.log("fetched json data", dataset);
                }
            }
    );
    }, []);

    

    //change data visulization
    const handleDataVisulizationChange = (event, visualType) => {
        setDataVisualization(visualType);
    }

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Prevalence Around The World</div>
            <div className="description" id="description">The estimated share of the total population with any form of cancer.</div>
            <div className="control" id="control">
                <ToggleButtonGroup value={dataVisualization} onChange={handleDataVisulizationChange}>
                    <ToggleButton value="table">
                        <WindowOutlinedIcon/>
                        Table
                    </ToggleButton>
                    <ToggleButton value="map">
                        <PublicOutlinedIcon/>
                        Map
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <div className="canvas" id="canvas"></div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section1;