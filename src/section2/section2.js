import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import section2Dataset from './section2data.csv';
import "../section/section.css";
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";

const Section2 = ({id, isActive}) => {

    const[section2Data, setSection2Data]=useState([]);

    //fetch section 2 data on initail render
    useEffect(() => {
        d3.csv(section2Dataset).then(function(data, error){
            if(error){
                console.log("fetch section 2 data from local csv:", error);
            }else{
                setSection2Data(data);
            }
        })
    }, [])

    console.log("Section 2 Fetched csv Data:", section2Data);



    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Prevalence Of cancer by type</div>
            <div className="description" id="description">This related chart shows the estimated number of people with each type of cancer:</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={"table"}/>
            </div>
            <div className="canvas" id="canvas"></div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section2;