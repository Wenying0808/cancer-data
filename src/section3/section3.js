import React, {useState, useEffect, useMemo} from "react";
import "../section/section.css";
import * as d3 from "d3";
import section3Dataset from './section3data.csv';
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearSlider from "../slider/YearSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, Select, MenuItem, FormControl } from '@mui/material';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "../worldmap/ContinentCountryId";


const Section3 = ({id, isActive}) => {
    const [section3Data, setSection3Data] = useState([]);
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [selectedYear, setSelectedYear] = useState(2019);
    const [selectedContinent, setSelectedContinent] = useState("World");
    const [selectedCountryOrRegion, setSelectedCountryOrRegion] = useState("European Region (WHO)");
    const [sortBy, setSortBy] = useState("Entity");
    const [sortOrder, setSortOrder] = useState("asc");
    const [hoveredColumn, setHoveredColumn] = useState(null);

    //fetch csv data
    useEffect(() => {
        d3.csv(section3Dataset).then(function(data, error){
            if(error){
                console.log("fetch section3data from csv file:", error)
            }else{
                setSection3Data(data);
            };
        });
    }, []);
    console.log("Section3 Fetched CSV Data:", section3Data);

    //mag age group to csv file
    const ageGroupMapping = useMemo(() => ({
        "All ages": "Current number of cases of neoplasms per 100 people, in both sexes aged all ages",
        "70+ years old": "Current number of cases of neoplasms per 100 people, in both sexes aged 70+ years",
        "50-69 years old": "Current number of cases of neoplasms per 100 people, in both sexes aged 50-69 years",
        "15-49 years old": "Current number of cases of neoplasms per 100 people, in both sexes aged 15-49 years",
        "5-14 years old": "Current number of cases of neoplasms per 100 people, in both sexes aged 5-14 years",
        "Under 5s": "Current number of cases of neoplasms per 100 people, in both sexes aged under 5",
    }), []);

    //get the key of ageGroup
    const ageGroups = Object.keys(ageGroupMapping);

    //group data by country
    const ageGroupDataByCountry = useMemo(() => {
        const dataByCountry = {};
        section3Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;

            if(!dataByCountry[country]){
                dataByCountry[country] = {};
            };

            dataByCountry[country]["Code"]=row.Code;
            dataByCountry[country]["Entity"]=row.Entity;

            ageGroups.forEach(ageGroup => {
                if(!dataByCountry[country][ageGroup]){
                    dataByCountry[country][ageGroup] = {};
                }
                dataByCountry[country][ageGroup][year] = row[ageGroupMapping[ageGroup]]
            });
        })
        return dataByCountry;
    }, [section3Data, ageGroupMapping, ageGroups])

    console.log("AgeGroupDataByCountry in Section3:", ageGroupDataByCountry);
    console.log("Object.entries(AgeGroupDataByCountr) in Section3:", Object.entries(ageGroupDataByCountry));


    //filter table data by selected continent
    const filteredAgeGroupDataByCountry = useMemo(() => {
        //convert object to key-value pair array, the first array is country, and the second array is its data
        const filteredData = Object.entries(ageGroupDataByCountry).filter(([country, data]) => {

            const countryCode = data["Code"];
            //convert country code to country id
            const countryId = iso3166Lookup.findAlpha3(countryCode, "num3");
            //use numeric country code to determine which country belongs to which continent
            const countriesInSelectedContinent = continentCountryIds[selectedContinent];

            if (selectedContinent === "World"){
                return true;
            } else {
                return countriesInSelectedContinent && countriesInSelectedContinent.includes(parseInt(countryId));
            }

        })
        return Object.fromEntries(filteredData);
        
    }, [ageGroupDataByCountry, selectedContinent]);
    console.log("filteredAgeGroupDataByCountry in section3", filteredAgeGroupDataByCountry);

    console.log("Object.entries(filteredAgeGroupDataByCountry) in section3", Object.entries(filteredAgeGroupDataByCountry));

    // memorize sorted Data
    const sortedAndFilteredDataByCountry = useMemo(() => {
       const sortedArray = Object.entries(filteredAgeGroupDataByCountry).sort((a,b) => {
            if(sortBy === "Entity"){
                const aValue = a[1]["Entity"] || ''; // add [1] as the object.enries are the array of such form [countryName, countryData]
                    const bValue = b[1]["Entity"] || '';
                    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                // numerical sorting -> Get the age group and year from the sortBy variable
                const [ageGroup, year] = sortBy.split('|');
                const aValue = parseFloat(a[1][ageGroup][year]) || 0;
                const bValue = parseFloat(b[1][ageGroup][year]) || 0;
                return sortOrder === 'asc' ? aValue-bValue : bValue-aValue;
            }
        });
        return Object.fromEntries(sortedArray);
    }, [sortBy, sortOrder, filteredAgeGroupDataByCountry]);

    const handleSortRequest = (column) => {
        const isAsc = sortBy === column && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortBy(column);
    };

    // handle hover event on the columns header
    const handleColumnHover = (column) => {
        if(column !== sortBy){
            setHoveredColumn(column);
        }
    };
    const handleColumnLeave = () => {
        setHoveredColumn(null);
    };

    const handleTabOptionChange = (event, newTabOption) => {
        if(newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
    };

    //chnage the filter for table via select control
    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value)
    };

    //change the filter for chart via select control
    const handleCountryOrRegionChange = (event) => {
        setSelectedCountryOrRegion(event.target.value)
    };

    const handleYearChange = (event, newYear) => {
        setSelectedYear(newYear);
    };

    //create slider for table and chart
    const createSlider = () => {
        return(
            <YearSlider year={selectedYear} handleYearChange={handleYearChange}/>
        ) 
    };

    const createTable = (data) => {
        //remove the content of the canvas before rendering table
        d3.select("#canvas3").selectAll("svg").remove();
        return(
            <div style={{ maxHeight: "440px", overflowY: "auto" }}>
                <Table stickyHeader>
                    {/*table header: country, age group */}
                    <TableHead>
                        <TableRow>
                            <TableCell
                                onClick={() => handleSortRequest("Entity")}
                                onMouseEnter={() => handleColumnHover("Entity")}
                                onMouseLeave={handleColumnLeave}
                                sx={{
                                    minWidth: '180px',
                                    backgroundColor: hoveredColumn === "Entity" ? '#EDEDED' : '#FBFBFB',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                    left: 0,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                <TableSortLabel
                                    active={sortBy === "Entity"}
                                    direction={sortBy === "Entity" ? sortOrder: 'asc'}
                                >
                                    Country / Region
                                </TableSortLabel>
                                
                            </TableCell>
                            {ageGroups.map((ageGroup) => (
                                <TableCell 
                                    key={ageGroup}
                                    onClick={() => handleSortRequest(`${ageGroup}|${selectedYear}`)}
                                    onMouseEnter={() => handleColumnHover(`${ageGroup}|${selectedYear}`)}
                                    onMouseLeave={handleColumnLeave}
                                    sx={{ 
                                        minWidth: '180px',
                                        backgroundColor: hoveredColumn === `${ageGroup}|${selectedYear}` ? '#EDEDED' : '#FBFBFB',
                                        position: 'sticky',
                                        top: 0,
                                        left: 182,
                                        zIndex: 2,
                                        fontWeight:600,
                                        cursor: "pointer",
                                    }} 
                                    align='left'
                                >
                                    <TableSortLabel
                                        active={sortBy === `${ageGroup}|${selectedYear}`}
                                        direction={sortBy === `${ageGroup}|${selectedYear}` ? sortOrder : 'asc'}
                                    >
                                        {`${ageGroup} (%)`}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
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
                                    {ageGroups.map((ageGroup) => (
                                        <TableCell key={`${country}-${ageGroup}-${selectedYear}`}>
                                            {data[country][ageGroup][selectedYear]}
                                        </TableCell>
                                        
                                    ))}
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
                                            zIndex: 1,
                                            backgroundColor: '#E0E0E0',
                                            fontWeight: 600
                                        }}
                                    >
                                        Other
                                    </TableCell>
                                    <TableCell
                                        colSpan={6}
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
                                            {ageGroups.map((ageGroup) => (
                                                <TableCell key={`${country}-${ageGroup}-${selectedYear}`}>
                                                    {data[country][ageGroup][selectedYear]}
                                                </TableCell>
                                            ))}
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

    const createChart = () => {

        // get maxValue for the filtered data, depending on the selectedYear and selectedCountryOrRegion
        // find the max value by iterating through each ageGroup
        // this max value will be used to determine the x axis
        // use flatmap to flatten the values into a single array
        const countryOrRegionData = ageGroupDataByCountry[selectedCountryOrRegion];
        const maxValue = Math.max(...ageGroups.flatMap( ageGroup => 
                parseFloat(countryOrRegionData[ageGroup][selectedYear])
            )
        );
        console.log("maxValue in barchart in section3:", maxValue);

        const margin = { top: 20, right: 80, bottom: 20, left: 100};
        const width = 900 - margin.left - margin.right;
        const height = 440 - margin.top - margin.bottom;

        const canvas = d3.select('#canvas3');

        // Remove any existing SVG elements inside the canvas
        canvas.selectAll('svg').remove();

        const svg = canvas.append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`)
        //x axis for value
        const xAxis = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([0, width])

        const xAxisFormat = d3.axisBottom(xAxis)
                            
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxisFormat)

        //y axis for age group

        const yAxis = d3.scaleBand()
                        .domain(ageGroups)
                        .range([height, 0])
                        .padding(0.4)

        const yAxisFormat = d3.axisLeft(yAxis)
                            
        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxisFormat)
        
        //tooltips
       const tooltip = d3.select("body").append("div")
       .attr("class", "tooltip-section3-chart")
       .style("opacity", 0)
       .style("position", "absolute")
       .style("background-color", "white")
       .style("box-shadow", "0px 1px 5px 0px rgba(0, 0, 0, 0.25)")
       .style("border-radius", "16px")
       .style("padding", "16px")
       .style("pointer-events", "none");

        // bars
        svg.selectAll(".bar")
            .data(ageGroups)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("y", d => yAxis(d))
            .attr("width", d => xAxis(parseFloat(countryOrRegionData[d][selectedYear])))
            .attr("height", yAxis.bandwidth())
            .attr("fill", "steelblue")
            .on("mouseover", (event, d) => {

                const value = parseFloat(countryOrRegionData[d][selectedYear]);

                tooltip.transition()
                            .duration(200)
                            .style("opacity", 1)
                
                tooltip.html(() => {
                    const tooltipContent = `<div style="font-weight: 600; font-size: 14px; line-height: 24px;" > ${selectedYear} </div><div style="font-weight: 500; font-size: 12px; line-height: 16px; margin: 0; padding: 0;">${d}: ${value.toFixed(3)}%</div>`;
                    return tooltipContent;
                })
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 80) + "px");
            
            })
            .on("mouseout", () => {
                tooltip.transition()
                            .duration(500)
                            .style("opacity", 0)
            })
        
        // labels
        svg.selectAll(".label")
            .data(ageGroups)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => xAxis(parseFloat(countryOrRegionData[d][selectedYear])) + 10)
            .attr("y", d => yAxis(d) + yAxis.bandwidth()/2 + 3)
            .attr("fill", "black")
            .style("font-size", "12px")
            .text( d => parseFloat(countryOrRegionData[d][selectedYear]).toFixed(3) + "%")

    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">{`Cancer Prevalence By Age (${selectedYear})`}</div>
            <div className="description" id="description">By breaking down the data by age group, we can see that the majority of cancers are in older people.</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={selectedTabOption} onChange={handleTabOptionChange}/>
                <FormControl size="small">
                    {selectedTabOption === "table" 
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
                                {Object.keys(ageGroupDataByCountry).map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                ))}
                                </Select>
                        )
                    }
                </FormControl>
            </div>
            <div className="canvas" id="canvas3">{selectedTabOption==="table" ? createTable(sortedAndFilteredDataByCountry) : createChart()}</div>
            <div className="slider-control" id="slider-control3">{createSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section3;