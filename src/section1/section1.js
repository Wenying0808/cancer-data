import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import "../section/section.css";
import section1Dataset from './section1data.csv';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const Section1 = ({id, isActive}) => {

    const [dataVisualization, setDataVisualization] = useState("table");

    const [section1Data, setSection1Data] = useState([]);

    //fetch data
    useEffect(() => {
        d3.csv(section1Dataset).then(function(data, error){
            if(error){
                console.log("fetchdata", error);
            } else{
                setSection1Data(data);
                console.log("fetched section1 data:", data);
            }
        });
    }, []);

    //group data per country
    const dataByCountry = {};

    section1Data.forEach((row) => {
        if(!dataByCountry[row.Entity]){
            dataByCountry[row.Entity] = {Entity: row.Entity, "2009": "-", "2019": "-"}
        }
        
        if(row.Year==="2009"){
            dataByCountry[row.Entity]["2009"] = row["Current number of cases of neoplasms per 100 people, in both sexes aged all ages"];
        }
        if(row.Year==="2019"){
            dataByCountry[row.Entity]["2019"] = row["Current number of cases of neoplasms per 100 people, in both sexes aged all ages"];
        }
    });
    

    //change data visulization
    const handleDataVisulizationChange = (event, visualType) => {
        setDataVisualization(visualType);
    }

    //create table
    const canvas = document.getElementById("#canvas");

    // Use CSS to style the sticky header
    const tableHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1, // Ensure the header stays above the body while scrolling
};

    const createTable = (data) => {
        
        return(
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow style={tableHeaderStyle}>
                            <TableCell>Country / Area</TableCell>
                            <TableCell>2009</TableCell>
                            <TableCell>2019</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(dataByCountry).map((row) => (
                            <TableRow key={row.Entity}>
                                <TableCell>{row.Entity}</TableCell>
                                <TableCell>{row["2009"]}</TableCell>
                                <TableCell>{row["2019"]}</TableCell>
                            </TableRow>
                            )  
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };


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
            <div className="canvas" id="canvas">
                {createTable(section1Data)}
            </div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section1;