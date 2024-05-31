import React, {useState, useEffect, useMemo} from "react";
import * as d3 from "d3";
import "../section/section.css";
import section4Dataset from './section4data.csv';
import ToggleButtonTableMapChart from "../toggleButton/toggleButtonTableMapChart";
import YearRangeSlider from "../slider/YearRangeSlider";
import YearSlider from "../slider/YearSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "../worldmap/ContinentCountryId";


const Section4 = ({id, isActive}) => {
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [section4Data, setSection4Data] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const [mapYear, setMapYear] = useState(2019);
    const[selectedContinent, setSelectedContinent] = useState("World");
    const[selectedCountryOrRegion, setSelectedCountryOrRegion] = useState("European Region (WHO)");


    // fetch data from csv
    useEffect(() => {
        d3.csv(section4Dataset).then(function(data, error){
            if(error){
                console.log("fetch section3data from csv file:", error)
            }else{
                setSection4Data(data);
            };
        });
    }, []);
    console.log("Section4 Fetched CSV Data:", section4Data);

    //group data by country
    const burdenDataByCountry = useMemo(() => {
        const dataByCountry = {};
        section4Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;

            if(!dataByCountry[country]){
                dataByCountry[country] = {};
            };
            if(!dataByCountry[country]["Burden Rate"]){
                dataByCountry[country]["Burden Rate"] = {};
            };

            dataByCountry[country]["Code"]=row.Code;
            dataByCountry[country]["Burden Rate"][year]=row["DALYs (Disability-Adjusted Life Years) - Neoplasms - Sex: Both - Age: Age-standardized (Rate)"];  
        });
        return dataByCountry;
    }, [section4Data]);

    console.log("section4 burdenDataByCountry", burdenDataByCountry);

    const handleTabOptionChange = (event, newTabOption) => {
        if(newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
    };

    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value);
    };

    const handleCountryOrRegionChange = (event) => {
        setSelectedCountryOrRegion(event.target.value);
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

    //change the map year
    const handleMapYearChange = (event, newYear) => {
        setMapYear(newYear);
    };

    const createTableChartSlider = () => {
        return (<YearRangeSlider yearRange={yearRange} handleYearRangeChange={handleYearRangeChange}/>);
    };

    const createMapSlider = () => {
        return (<YearSlider year={mapYear} handleYearChange={handleMapYearChange}/>);
    };

    const createTable = (data) => {
        return(
            <div style={{ maxHeight: "440px", overflowY: "auto" }}>
                <Table stickyHeader>
                    {/*table header: country, cancer type, table subheader: year 1 and year 2 */}
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                sx={{
                                    minWidth: '150px',
                                    backgroundColor: '#FBFBFB',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 1,
                                    left: 0,
                                    fontWeight: 600
                                }}
                            >
                                Country / Region
                            </TableCell>
                            
                            <TableCell 
                                sx={{ 
                                    minWidth: '150px',
                                    backgroundColor: '#FBFBFB',
                                    position: 'sticky',
                                    top: 0,
                                    left: 150,
                                    zIndex: 1,
                                    fontWeight:600,
                                }} 
                                align='left'
                            >
                                {`${yearRange[0]} (%)`}
                            </TableCell>

                            <TableCell 
                                sx={{ 
                                    minWidth: '150px',
                                    backgroundColor: '#FBFBFB',
                                    position: 'sticky',
                                    top: 0,
                                    left: 150,
                                    zIndex: 1,
                                    fontWeight: 600,
                                }} 
                                align='left'
                            >
                                {`${yearRange[1]} (%)`}
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    {/*row: country, year 1 and year 2 */}
                    <TableBody>
                        {Object.keys(data).map((country) => (
                            data[country]["Code"] ? (
                                <TableRow key={country} sx={{'&:hover':{backgroundColor:'#E5EBF8'}}}>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            top: 57,
                                            zIndex: 1,
                                            backgroundColor: '#F5F5F5',
                                        }}
                                    >
                                        {country}
                                    </TableCell>
                                    <TableCell>
                                        {data[country]["Burden Rate"][yearRange[0]]}
                                    </TableCell>
                                    <TableCell>
                                        {data[country]["Burden Rate"][yearRange[1]]}
                                    </TableCell>
                                    
                                </TableRow>
                            ) : null   
                        ))}

                        {/* only show the other row and its rows when the selectedContinent is World as it's regional data instead of national data*/}
                        {selectedContinent === "World" && (
                            <>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            top: 57,
                                            zIndex: 1,
                                            backgroundColor: '#E0E0E0',
                                            fontWeight: 600
                                        }}
                                    >
                                        Other
                                    </TableCell>
                                    <TableCell
                                        colSpan={2}
                                        sx={{
                                            backgroundColor: '#E0E0E0',
                                        }}
                                    >
                                    </TableCell>
                                </TableRow>
                                {Object.keys(data).map((country) => (
                                    /*only national data has country code*/
                                    data[country]["Code"] 
                                    ? null 
                                    : (
                                        <TableRow key={country} sx={{'&:hover':{backgroundColor:'#E5EBF8'}}}>
                                            <TableCell
                                                sx={{
                                                    position: 'sticky',
                                                    left: 0,
                                                    top: 57,
                                                    zIndex: 1,
                                                    backgroundColor: '#F5F5F5',
                                                }}
                                            >
                                                {country}
                                            </TableCell>
                                            <TableCell>
                                                {data[country]["Burden Rate"][yearRange[0]]}
                                            </TableCell>
                                            <TableCell>
                                                {data[country]["Burden Rate"][yearRange[1]]}
                                            </TableCell>
                                            
                                        </TableRow>
                                    )  
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </div>

        );
    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">
                {selectedTabOption !=="map" ? `The global disease burden from cancer (${yearRange[0]}-${yearRange[1]})` : `The global disease burden from cancer (${mapYear})`}
            </div>
            <div className="description" id="description">
                Disability-Adjusted Life Years (DALYs) per 100,000 individuals from all cancer types.
            </div>
            <div className="control" id="control">
                <ToggleButtonTableMapChart value={selectedTabOption} onChange={handleTabOptionChange}/>
                <FormControl size="small">
                    {selectedTabOption !== "chart" 
                        ? (
                            <Select sx={{width: "150px"}} value={selectedContinent} onChange={handleContinentChange}>
                                <MenuItem value="World">World</MenuItem>
                                <MenuItem value="Africa">Africa</MenuItem>
                                <MenuItem value="North America">North America</MenuItem>
                                <MenuItem value="South America">South America</MenuItem>
                                <MenuItem value="Asia">Asia</MenuItem>
                                <MenuItem value="Europe">Europe</MenuItem>
                                <MenuItem value="Oceania">Oceania</MenuItem>
                            </Select> 
                        )
                        : (
                            <Select sx={{width: "250px"}} value={selectedCountryOrRegion} onChange={handleCountryOrRegionChange}>
                                {Object.keys(burdenDataByCountry).map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                ))}
                                </Select>
                        )
                    }
                </FormControl>
            </div>
            <div className="canvas" id="canvas4">{selectedTabOption === "table" ? createTable(burdenDataByCountry) : null}</div>
            <div className="slider-control" id="slider-control4">{selectedTabOption !== "map" ? createTableChartSlider() : createMapSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section4;