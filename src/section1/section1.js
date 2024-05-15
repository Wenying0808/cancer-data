import React, {useState, useEffect, useMemo} from "react";
import * as d3 from "d3";
import * as topojson from 'topojson-client';
import "../section/section.css";
import "./section1_table.css";
import section1Dataset from './section1data.csv';
import ToggleButtonTableMap from "../toggleButton/toggleButtonTableMap";
import { Table, TableHead, TableRow, TableCell, TableBody, Box, Slider } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WorldMap from "../worldmap/worldmap";
    
console.log("topojson",topojson); //check if topojson is imported

const Section1 = ({id, isActive}) => {

    const worldAltasURL="https://unpkg.com/world-atlas@1.1.4/world/50m.json";

    const [selectedOption, setSelectedOption] = useState("table");
    const [section1Data, setSection1Data] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const [mapYear, setMapYear] = useState(2009);
    const minRangeDistance = 1;
    const [sortBy, setSortBy] = useState("Entity");
    const [sortOrder, setSortOrder] = useState("asc");
    const [hoveredColumn, setHoveredColumn] = useState(null);

    //fetch section 1 data
    useEffect(() => {
        d3.csv(section1Dataset).then(function(data, error){
            if(error){
                console.log("fetchdata", error);
            } else{
                setSection1Data(data);
                /*console.log("fetched section1 cancer data:", data);*/
            }
        });
    }, []);
    //fetch data from json

    useEffect(() => {
        fetch(worldAltasURL)
        .then((response)=> response.json())
        .then((topoJSONData)=>{
            setMapData(topoJSONData);
            console.log("topoJSONData",topoJSONData);
            const worldFeatures = topojson.feature(topoJSONData, 'countries');
            console.log("data", worldFeatures);
            
        })
    }, []);


    console.log("mapData", mapData);

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

    //memorize sorted Data
    const sortedData = useMemo(() => {
        //numeric sort
        const numericSort = (a, b) => {
            const aValue = parseFloat(a[sortBy]) || 0;
            const bValue = parseFloat(b[sortBy]) || 0;
            return sortOrder === 'asc' ? aValue-bValue : bValue-aValue;
        };

        const sorted = [...Object.values(dataByCountry)]; //copy dataByCountry
            sorted.sort((a, b) => {
                if(sortBy === "Entity") {
                const aValue = a[sortBy] || '';
                const bValue = b[sortBy] || '';
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }else{
                return numericSort(a,b);
                }
        })
        return sorted; //return sorted array
    }, [sortBy, sortOrder, dataByCountry]);
    
    /*console.log("sortedData", sortedData);*/
    
    //sorting indicator
    const getSortingIcon = (column) => {
        if (column === sortBy) {
            return sortOrder === 'asc' ? <SouthIcon fontSize="small"/> : <NorthIcon fontSize="small"/>
        }
    }

    //handle hover event on the columns header
    const handleColumnHover = (column) => {
        if(column !== sortBy){
            setHoveredColumn(column);
        }
    }
    const handleColumnLeave = (column) => {
        setHoveredColumn(null);
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
       console.log("Year Range on table slider:", newRange);
    };

    const handleMapYearChange = (event, newYear) => {
        console.log("newYear on map slider", newYear)
        setMapYear(newYear);
    };


    const createTable = (data) => {
        
        //sort data function
        const sortData = (column) => {
            //deal with the column which is already sorted
            if (sortBy === column){
                setSortOrder( sortOrder === 'asc' ? 'desc' : 'asc');
            } else{
                setSortBy(column);
                setSortOrder('asc');
            }
        }
        
        return(
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table>
                    <TableHead className="columnheader">
                        <TableRow className="columnheader-row" >
                            <TableCell 
                                className="columnheader-cell"
                                onClick={() => sortData("Entity")}
                                onMouseEnter={() => handleColumnHover("Entity")}
                                onMouseLeave={handleColumnLeave}
                            >
                                Country / Area
                                {getSortingIcon("Entity")}
                                {hoveredColumn === "Entity" && <SwapVertIcon fontSize="small" sx={{color: "gray"}}/>}
                            </TableCell>

                            <TableCell 
                                className="columnheader-cell"
                                onClick={() => sortData(yearRange[0])}
                                onMouseEnter={() => handleColumnHover(yearRange[0])}
                                onMouseLeave={handleColumnLeave}
                            >
                                {yearRange[0]}
                                (%)
                                {getSortingIcon(yearRange[0])}
                                {hoveredColumn === yearRange[0] && <SwapVertIcon fontSize="small" sx={{color: "gray"}}/>}
                            </TableCell>

                            <TableCell 
                                className="columnheader-cell"
                                onClick={() => sortData(yearRange[1])}
                                onMouseEnter={() => handleColumnHover(yearRange[1])}
                                onMouseLeave={handleColumnLeave}
                            >
                                {yearRange[1]}
                                (%)
                                {getSortingIcon(yearRange[1])}
                                {hoveredColumn === yearRange[1] && <SwapVertIcon fontSize="small" sx={{color: "gray"}}/>}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow className="row" key={row.Entity} >
                                <TableCell className="cell" >{row.Entity}</TableCell>
                                <TableCell className="cell" >{row[yearRange[0]]}</TableCell>
                                <TableCell className="cell" >{row[yearRange[1]]}</TableCell>
                            </TableRow>
                            )  
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const createMap = () => {
        return(
            <WorldMap/>
        )
    };

    const createTableSlider = () => {
        return(
            <>
                <div className="slider-label">1990</div>
                    <Box sx={{ width: 600 }}>
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
                <div className="slider-label">2019</div>
            </>
                
        );
    }

    const createMapSlider = () => {
        return(
            <>
                <div className="slider-label">1990</div>
                        <Box sx={{ width: 600 }}>
                            <Slider 
                                track={false}
                                value={mapYear} 
                                onChange={handleMapYearChange}
                                valueLabelDisplay="auto"
                                getAriaValueText={valueText}
                                min={1990} 
                                max={2019}
                            />
                        </Box>
                    <div className="slider-label">2019</div>
            </>
        );
    };

    
    const handleOptionChange = (event, newOption) => {
        if (newOption !== null){
            setSelectedOption(newOption);
        }
        console.log("previous selectedOption: ", selectedOption);
        console.log("current selectedOption: ", newOption);
    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">
                Prevalence Around The World 
                {selectedOption === "table" && ` (Years: ${yearRange[0]} - ${yearRange[1]})`} 
                {selectedOption === "map" && ` (Year: ${mapYear})`} 
            </div>
            <div className="description" id="description">The estimated share of the total population with any form of cancer.</div>
            <div className="control" id="control">
                <ToggleButtonTableMap value={selectedOption} onChange={handleOptionChange}/>
            </div>
            <div className="canvas" id="canvas">{selectedOption==="table" ? createTable(sortedData) : createMap()}</div>
            <div className="slider-control" id="slider-control">{selectedOption==="table" ? createTableSlider() : createMapSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section1;