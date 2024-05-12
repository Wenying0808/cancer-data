import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import "../section/section.css";
import section1Dataset from './section1data.csv';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Slider } from '@mui/material';

const Section1 = ({id, isActive}) => {

    const [dataVisualization, setDataVisualization] = useState("table");
    const [section1Data, setSection1Data] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const minRangeDistance = 1;

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
            dataByCountry[row.Entity] = {Entity: row.Entity}
        }
        //add data from 1990 to 2019 to each country
        dataByCountry[row.Entity][row.Year] = row["Current number of cases of neoplasms per 100 people, in both sexes aged all ages"];
        dataByCountry[row.Entity]["Code"] = row["Code"];
    });

    console.log("dataByCountry",dataByCountry);
    

    //change data visulization
    const handleDataVisulizationChange = (event, visualType) => {
        setDataVisualization(visualType);
    }

    //display value for the slider
    function valueText(value){
        return value;
    }

    //set the range of the year
    const handleYearRangeChange = (event, newRange, activeThumb) => {
        if(newRange[1]-newRange[0] < minRangeDistance){
            if(activeThumb === 0){
                const clamped = Math.min(newRange[0], 2019 - minRangeDistance);
                setYearRange([clamped, clamped+minRangeDistance]);
            }else{
                const clamped = Math.max(newRange[1], minRangeDistance);
                setYearRange([clamped-minRangeDistance, clamped]);
            }
        } else {
            setYearRange(newRange);
        }
       
    };

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
                            <TableCell>{yearRange[0]}</TableCell>
                            <TableCell>{yearRange[1]}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(dataByCountry).map((row) => (
                            <TableRow key={row.Entity}>
                                <TableCell>{row.Entity}</TableCell>
                                <TableCell>{row[yearRange[0]]}</TableCell>
                                <TableCell>{row[yearRange[1]]}</TableCell>
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
                <div className="slider-control">
                    <div className="slider-label">{yearRange[0]}</div>
                    <Box sx={{ width: 400 }}>
                        <Slider 
                            value={yearRange} 
                            onChange={handleYearRangeChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valueText}
                            min={1990} 
                            max={2019}
                            disableSwap
                        />
                    </Box>
                    <div className="slider-label">{yearRange[1]}</div>
                </div>
                
            </div>
            <div className="canvas" id="canvas">
                {createTable(section1Data)}
            </div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section1;