import React, {useEffect, useState} from "react";
import * as d3 from "d3";
import section2Dataset from './section2data.csv';
import "../section/section.css";
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearRangeSlider from "../slider/YearRangeSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';

const Section2 = ({id, isActive}) => {

    const[section2Data, setSection2Data] = useState([]);
    const[selectedTabOption, setSelectedTabOption] = useState("table");
    const[selectedRegion, setSelectedRegion] = useState("World");
    const[yearRange, setYearRange] = useState([1990,2019])

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

    //change the tab option
    const handleTabOptionChange = (event, newOption) => {
        if(newOption !== null){
            setSelectedTabOption(newOption)
        }
    };

    //change the region
    const handleRegionChange = (event) => {
        setSelectedRegion(event.target.value)
    };

    //change the year range
    const minRangeDistance = 1;
    const handleYearRangeChange = (event, newRange, activeThumb) => {
        if(newRange[1]-newRange[0] < minRangeDistance){
            if(activeThumb === 0){
                const clamped = Math.min(newRange[0], 2019 - minRangeDistance);
                setYearRange([clamped, clamped + minRangeDistance]);
            }else{
                const clamped = Math.max(newRange[1], minRangeDistance);
                setYearRange([clamped - minRangeDistance, clamped]);
            }
        } else {
            setYearRange(newRange);
        }
       console.log("Year Range on section2 slider:", newRange);
    };

    //create slider
    const createSlider = () => {
        return(
            <YearRangeSlider yearRange={yearRange} handleYearRangeChange={handleYearRangeChange}/>
        ) 
    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">Prevalence Of cancer by type</div>
            <div className="description" id="description">This related chart shows the estimated number of people with each type of cancer:</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={selectedTabOption} onChange={handleTabOptionChange}/>
                <FormControl size="small">
                    <Select sx={{width: "150px"}} value={selectedRegion} onChange={handleRegionChange}>
                        <MenuItem value="World">World</MenuItem>
                    </Select> 
                </FormControl>
            </div>
            <div className="canvas" id="canvas"></div>
            <div className="slider-control" id="slider-control">{createSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section2;