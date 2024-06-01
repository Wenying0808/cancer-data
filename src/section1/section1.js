import React, {useState, useEffect, useMemo} from "react";
import * as d3 from "d3";
import * as topojson from 'topojson-client';
import iso3166Lookup from "iso3166-lookup";
import "../section/section.css";
import "./section1_table.css";
import section1Dataset from './section1data.csv';
import ToggleButtonTableMap from "../toggleButton/toggleButtonTableMap";
import YearRangeSlider from "../slider/YearRangeSlider";
import YearSlider from "../slider/YearSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import WorldMap from "../worldmap/worldmap";
import continentCountryIds from "../worldmap/ContinentCountryId";
    
console.log("topojson",topojson); //check if topojson is imported

const Section1 = ({id, isActive}) => {

    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [selectedContinent, setSelectedContinent] = useState("World");
    const [section1Data, setSection1Data] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const [mapYear, setMapYear] = useState(2019);
    const [sortBy, setSortBy] = useState("Entity");
    const [sortOrder, setSortOrder] = useState("asc");
    const [hoveredColumn, setHoveredColumn] = useState(null);

    // fetch section 1 data
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

    // memoralize data
    const dataByCountry = useMemo(() => {
        const dataByCou = {};
        //group data per country
        section1Data.forEach((row) => {
            if(!dataByCou[row.Entity]){
                dataByCou[row.Entity] = {Entity: row.Entity}
            }
            //add data from 1990 to 2019 to each country
            dataByCou[row.Entity][row.Year] = row["Current number of cases of neoplasms per 100 people, in both sexes aged all ages"];
            dataByCou[row.Entity]["Code"] = row["Code"];
    
            //add country code from iso to the data
            if (!dataByCou[row.Entity].hasOwnProperty("id")) {
                const countryDetail = iso3166Lookup.findAlpha3(row.Code); //Find country details by ISO 3166-1 Alpha-3
                console.log("countryDetail", countryDetail);
                if(countryDetail){
                    dataByCou[row.Entity].id = countryDetail.num3;
                }
            }
        });
        return dataByCou;

    }, [section1Data]);


    console.log("Section1 dataByCountry:",dataByCountry);
    /*console.log("all country names from lookup: ",iso3166Lookup.getAllCountryNames());*/

    // memorize filter Data
    const filteredDataByContinent = useMemo(() => {
        const filtered = [...Object.values(dataByCountry)]; //copy dataByCountry
        return filtered.filter(row => {
            if (selectedContinent === "World"){
                return true; // show all data
            } else {
                const countryId = row.id;
                return continentCountryIds[selectedContinent].includes(parseInt(countryId));
            }
        })
    },[dataByCountry, selectedContinent]);

    console.log("section1 filteredDataByContinent]", filteredDataByContinent);

    // memorize sorted Data
    const sortedData = useMemo(() => {

        return [...filteredDataByContinent].sort((a, b) => {
            if(sortBy === "Entity") {
                const aValue = a[sortBy] || '';
                const bValue = b[sortBy] || '';
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }else{ //numerical sorting
                const aValue = parseFloat(a[sortBy]) || 0;
                const bValue = parseFloat(b[sortBy]) || 0;
                return sortOrder === 'asc' ? aValue-bValue : bValue-aValue;
            }
        });

    }, [sortBy, sortOrder, filteredDataByContinent]);

    console.log("section1 sortedData", sortedData);
    
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

    //set the range of the year
    const minRangeDistance = 1;
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
       console.log("Year Range on section1 table slider:", newRange);
    };

    const handleMapYearChange = (event, newYear) => {
        console.log("section1 newYear on map slider", newYear)
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
        };
        
        return(
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow className="columnheader-row" >
                            <TableCell 
                                className="columnheader-cell"
                                onClick={() => sortData("Entity")}
                                onMouseEnter={() => handleColumnHover("Entity")}
                                onMouseLeave={handleColumnLeave}
                                sx={{
                                    backgroundColor:'#FBFBFB',
                                    fontWeight: 600,
                                }}
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
                                sx={{
                                    backgroundColor:'#FBFBFB',
                                    fontWeight: 600,
                                }}
                            >
                                {`${yearRange[0]} (%)`}
                                {getSortingIcon(yearRange[0])}
                                {hoveredColumn === yearRange[0] && <SwapVertIcon fontSize="small" sx={{color: "gray"}}/>}
                            </TableCell>

                            <TableCell 
                                className="columnheader-cell"
                                onClick={() => sortData(yearRange[1])}
                                onMouseEnter={() => handleColumnHover(yearRange[1])}
                                onMouseLeave={handleColumnLeave}
                                sx={{
                                    backgroundColor:'#FBFBFB',
                                    fontWeight: 600,
                                }}
                            >
                                {`${yearRange[1]} (%)`}
                                {getSortingIcon(yearRange[1])}
                                {hoveredColumn === yearRange[1] && <SwapVertIcon fontSize="small" sx={{color: "gray"}}/>}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                                <TableRow className="row" key={row.Entity} >
                                    <TableCell className="cell" sx={{backgroundColor: '#F5F5F5'}}>{row.Entity}</TableCell>
                                    <TableCell className="cell" >{row[yearRange[0]]}</TableCell>
                                    <TableCell className="cell" >{row[yearRange[1]]}</TableCell>
                                </TableRow>
                            )
                            ) 
                        }
                    </TableBody>
                </Table>
            </div>
        );
    };

    const createMap = () => {
        return(<WorldMap mapYear={mapYear} dataByCountry={dataByCountry} selectedContinent={selectedContinent}/>);
    };

    const createTableSlider = () => {
        return(
            <YearRangeSlider yearRange={yearRange} handleYearRangeChange={handleYearRangeChange}/>
        );
    };

    const createMapSlider = () => {
        return(
            <YearSlider year={mapYear} handleYearChange={handleMapYearChange}/>
        );
    };

    const handleTabOptionChange = (event, newTabOption) => {
        if (newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
        /*console.log("previous selectedOption: ", selectedOption);*/
        /*console.log("current selectedOption: ", newOption);*/
    };

    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value);
    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">
                {`Prevalence Around The ${selectedContinent}`}
                {selectedTabOption === "table" && ` (Years: ${yearRange[0]} - ${yearRange[1]})`} 
                {selectedTabOption === "map" && ` (Year: ${mapYear})`} 
            </div>
            <div className="description" id="description">The estimated share of the total population with any form of cancer.</div>
            <div className="control" id="control">
                <ToggleButtonTableMap value={selectedTabOption} onChange={handleTabOptionChange}/>
                <FormControl size="small">
                    <Select sx={{width: "150px"}} value={selectedContinent} onChange={handleContinentChange}>
                        <MenuItem value="World">World</MenuItem>
                        <MenuItem value="Africa">Africa</MenuItem>
                        <MenuItem value="North America">North America</MenuItem>
                        <MenuItem value="South America">South America</MenuItem>
                        <MenuItem value="Asia">Asia</MenuItem>
                        <MenuItem value="Europe">Europe</MenuItem>
                        <MenuItem value="Oceania">Oceania</MenuItem>
                    </Select> 
                </FormControl>
                 
                
            </div>
            <div className="canvas" id="canvas1">{selectedTabOption==="table" ? createTable(sortedData) : createMap()}</div>
            <div className="slider-control" id="slider-control1">{selectedTabOption==="table" ? createTableSlider() : createMapSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section1;