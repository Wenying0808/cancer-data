import React, {useEffect, useState, useMemo} from "react";
import * as d3 from "d3";
import section2Dataset from './section2data.csv';
import "../section/section.css";
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearRangeSlider from "../slider/YearRangeSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "../worldmap/ContinentCountryId";

const Section2 = ({id, isActive}) => {

    const[section2Data, setSection2Data] = useState([]);
    const[selectedTabOption, setSelectedTabOption] = useState("table");
    const[selectedContinent, setSelectedContinent] = useState("World");
    const[selectedCountryOrRegion, setSelectedCountryOrRegion] = useState("European Region (WHO)")
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

    console.log("Section2 Fetched CSV Data:", section2Data);

    // Mapping of cancer types to CSV columns
    const cancerMapping = useMemo(() => ({
        "Bladder Cancer": "Current number of cases of bladder cancer per 100 people, in both sexes aged age-standardized",
        "Brain & Central Nervous System Cancer": "Current number of cases of brain and central nervous system cancer per 100 people, in both sexes aged age-standardized",
        "Breast Cancer": "Current number of cases of breast cancer per 100 people, in both sexes aged age-standardized",
        "Cervical Cancer": "Current number of cases of cervical cancer per 100 people, in both sexes aged age-standardized",
        "Colon & Rectum Cancer": "Current number of cases of colon and rectum cancer per 100 people, in both sexes aged age-standardized",
        "Esophageal Cancer": "Current number of cases of esophageal cancer per 100 people, in both sexes aged age-standardized",
        "Gallbladder & Biliary Tract Cancer": "Current number of cases of gallbladder and biliary tract cancer per 100 people, in both sexes aged age-standardized",
        "Kidney Cancer": "Current number of cases of kidney cancer per 100 people, in both sexes aged age-standardized",
        "Larynx Cancer": "Current number of cases of larynx cancer per 100 people, in both sexes aged age-standardized",
        "Liver Cancer": "Current number of cases of liver cancer per 100 people, in both sexes aged age-standardized",
        "Lip & Oral Cavity Cancer": "Current number of cases of lip and oral cavity cancer per 100 people, in both sexes aged age-standardized",
        "Nasopharynx Cancer": "Current number of cases of nasopharynx cancer per 100 people, in both sexes aged age-standardized",
        "Non-Melanoma Skin Cancer": "Current number of cases of non-melanoma skin cancer per 100 people, in both sexes aged age-standardized",
        "Ovarian Cancer": "Current number of cases of ovarian cancer per 100 people, in both sexes aged age-standardized",
        "Pancreatic Cancer": "Current number of cases of pancreatic cancer per 100 people, in both sexes aged age-standardized",
        "Prostate Cancer": "Current number of cases of prostate cancer per 100 people, in both sexes aged age-standardized",
        "Stomach Cancer": "Current number of cases of stomach cancer per 100 people, in both sexes aged age-standardized",
        "Testicular Cancer": "Current number of cases of testicular cancer per 100 people, in both sexes aged age-standardized",
        "Thyroid Cancer": "Current number of cases of thyroid cancer per 100 people, in both sexes aged age-standardized",
        "Tracheal, Bronchus & Lung Cancer": "Current number of cases of tracheal, bronchus, and lung cancer per 100 people, in both sexes aged age-standardized",
        "Uterine Cancer": "Current number of cases of uterine cancer per 100 people, in both sexes aged age-standardized"
    }), []);
    // Get cancer types
    const cancerTypes = Object.keys(cancerMapping);


    const typeDataByCountry = useMemo(() => {
        const dataByCountry = {};
        section2Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;
            //create an obejct for each country if it doesn't exist
            if(!dataByCountry[country]){
                dataByCountry[country]={};
            };
            dataByCountry[country]["Code"]=row.Code;
            cancerTypes.forEach(cancerType => {
                //create cancer type object to each country if it doesn't exist
                if(!dataByCountry[country][cancerType]){
                    dataByCountry[country][cancerType]={};
                };
                dataByCountry[country][cancerType][year] = row[cancerMapping[cancerType]];
            });
        });
        console.log("dataByCountry in Section2:", dataByCountry);
        return dataByCountry;
    }, [section2Data, cancerMapping, cancerTypes]);

  
    console.log("typeDataByCountry in Section2:", typeDataByCountry);

    //filter typeDataByCountry by the selected continent
    const filteredTypeDataByCountry = useMemo(() => {
        /*const filtered = [...Object.values(typeDataByCountry)];*///this approach lost the original key
        const filteredEntries = Object.entries(typeDataByCountry).filter(([country, data]) => {

            const countryCode = data['Code'];
            const countryId = iso3166Lookup.findAlpha3(countryCode, "num3");
            const countriesInSelectedContinent = continentCountryIds[selectedContinent];

            if (selectedContinent === "World"){
                return true;
            } else {
                    return countriesInSelectedContinent && countriesInSelectedContinent.includes(parseInt(countryId));
            }
        })
        return Object.fromEntries(filteredEntries);
    },[typeDataByCountry, selectedContinent]);
    console.log("filteredTypeDataByCountry in Section2:", filteredTypeDataByCountry);

    //change the tab option
    const handleTabOptionChange = (event, newOption) => {
        if(newOption !== null){
            setSelectedTabOption(newOption)
        }
    };

    //change the region for table
    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value)
    };

    //change the region for chart
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

    //create slider for table and chart
    const createSlider = () => {
        return(
            <YearRangeSlider yearRange={yearRange} handleYearRangeChange={handleYearRangeChange}/>
        ) 
    };

    //create table
    const createTable = (data) => {

        //remove line chart before rendering table
        d3.select('#canvas2').selectAll('svg').remove();

        return(
            <div style={{ maxHeight: "440px", overflowY: "auto" }}>
                <Table stickyHeader>
                    {/*table header: country, cancer type, table subheader: year 1 and year 2 */}
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                rowSpan={2} 
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
                            {cancerTypes.map((type) => (
                                <TableCell 
                                    key={type} 
                                    colSpan={2} 
                                    sx={{ 
                                        minWidth: '300px',
                                        backgroundColor: '#FBFBFB',
                                        position: 'sticky',
                                        top: 0,
                                        left: 182,
                                        zIndex: 1,
                                        fontWeight:600,
                                    }} 
                                    align='center'
                                >
                                    {type}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            {cancerTypes.map((type) => (
                                yearRange.map((year) => (
                                    <TableCell 
                                        key={`${type}-${year}`}
                                        sx={{
                                            backgroundColor: '#FBFBFB',
                                            position: 'sticky',
                                            top: 56.5,
                                            left: 182,
                                            zIndex: 1,
                                        }} 
                                    >
                                        {`${year} (%)`}
                                    </TableCell>
                                ))
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
                                            top: 113.5,
                                            zIndex: 1,
                                            backgroundColor: '#F5F5F5',
                                        }}
                                    >
                                        {country}
                                    </TableCell>
                                    {cancerTypes.map((type) => (
                                        yearRange.map((year) => (
                                            <TableCell key={`${country}-${type}-${year}`}>
                                                {data[country][type][year]}
                                            </TableCell>
                                        ))
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
                                            top: 114,
                                            zIndex: 1,
                                            backgroundColor: '#E0E0E0',
                                            fontWeight: 600
                                        }}
                                    >
                                        Other
                                    </TableCell>
                                    <TableCell
                                        colSpan={21*2}
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
                                                    top: 114,
                                                    zIndex: 1,
                                                    backgroundColor: '#F5F5F5',
                                                }}
                                            >
                                                {country}
                                            </TableCell>
                                            {cancerTypes.map((type) => (
                                                yearRange.map((year) => (
                                                    <TableCell key={`${country}-${type}-${year}`}>
                                                        {data[country][type][year]}
                                                    </TableCell>
                                                ))
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

        const countryOrRegionData = typeDataByCountry[selectedCountryOrRegion];

        // find the max value by iterating through each cancer type across the selected year range
        // this max value will be used to determine the y axis
        // use flatmap to flatten the values into a single array
        const maxValue = Math.max(
            ...cancerTypes.flatMap(cancerType => 
                yearRange.map(year => parseFloat(countryOrRegionData[cancerType][year]))
            )
        );
        console.log("maxValue for chart in Section 2: ", maxValue);

        const margin = { top:20, right: 220, bottom: 40, left: 40};
        const width = 900 - margin.left - margin.right;
        const height = 440 - margin.top - margin.bottom;

        const canvas = d3.select('#canvas2');
        
        // Remove any existing SVG elements inside the canvas
        canvas.selectAll('svg').remove();

        const svg = canvas.append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", `translate(${margin.left},${margin.top})`)
        
        //x axis
        const xAxis = d3.scaleLinear()
                    .domain(d3.extent(yearRange))
                    .range([0, width])

        const xAxisFormat = d3.axisBottom(xAxis)
                                .ticks(d3.max(yearRange) - d3.min(yearRange))  // Ensures a tick for each year
                                .tickFormat( d => d.toString()) // remove the comma from the year label

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxisFormat)
        
        //y axis
        const yAxis = d3.scaleLinear()
                    .domain([0, maxValue])
                    .range([height, 0])
        const yAxisFormat = d3.axisLeft(yAxis)
                                .tickFormat(d => `${d}%`)

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxisFormat)

        //line generator
        const line = d3.line()
                        .x(d => xAxis(d.year))
                        .y(d => yAxis(d.value))
        
        //color platte
        const customColorPalette = [
            "#DD8585",  
            "#E24A4A",  
            "#C2042A",  
            "#72080E",  
            "#EE82EE",  
            "#C617C6",  
            "#FFA500",  
            "#FC7E00",  
            "#DB5D16",  
            "#8C776C",  
            "#6F3307",  
            "#0EC66E", 
            "#3FA422",  
            "#046304",
            "#7A94E7",  
            "#05B0FC", 
            "#2C5DDD", 
            "#00208F",  
            "#735BD2",  
            "#561AB8",  
            "#5D0089",  
        ];

        //define color for each line
        const color = d3.scaleOrdinal()
                        .domain(cancerTypes)
                        .range(customColorPalette)
        
        //add vertical lines for each tick on x axis, depending on the selected year range
        const allYearsFromYearRange = d3.range(yearRange[0], yearRange[1]+1); 
        console.log("allYearsFromYearRange in Section 2: ", allYearsFromYearRange); //generates [1990, 1991, ..., 2019]

        svg.selectAll(".vertical-line")
            .data(allYearsFromYearRange)
            .enter()
            .append("line")
            .attr("class", "vertical-line")
            .attr("x1", d => xAxis(d))
            .attr("x2", d => xAxis(d))
            .attr("y1", d => 0)
            .attr("y2", height)
            .attr("stroke", "#FBFBFB")
            .attr("stroke-width", 1);

        svg.selectAll(".vertical-band")
            .data(allYearsFromYearRange)
            .enter()
            .append("line")
            .attr("class", "vertical-band")
            .attr("x1", d => xAxis(d))
            .attr("x2", d => xAxis(d))
            .attr("y1", d => 0)
            .attr("y2", height)
            .attr("stroke", "#E0E0E0")
            .attr("stroke-width", 10)
            .attr("stroke-opacity", 0);
        
        //prepare data for each cancer type & create lines for each cancertype using line generator
        cancerTypes.forEach(cancerType => {
            const dataForEachCancerType = yearRange.map(year => (
                {
                    year: year,
                    value: parseFloat(typeDataByCountry[selectedCountryOrRegion][cancerType][year]) || 0 // handle missing data
                }
            ));
            // the ouput data looks like dataForEachCancerType = [{year: 1990, value: 0.02}, {year: 1991, value: 0.02}, ...]

            svg.append("path")
                .datum(dataForEachCancerType)
                .attr("fill", "none")
                .attr("stroke", color(cancerType))
                .attr("stroke-width", 1.5)
                .attr("d", line) // attribute d specifies the path to be drawn
                .attr("class", "line")
                .attr("id", `${cancerType}`)
            
            //add labels to line
            svg.append("text")
                .datum(dataForEachCancerType[dataForEachCancerType.length-1]) // Last data point
                .attr("transform", d => `translate(${xAxis(d.year)},${yAxis(d.value)})`)
                .attr("x", 20)
                .attr("dy", "0.35em")
                .attr("fill", color(cancerType))
                .style("font-size", "10px")
                .text(cancerType)
        })

        

        //tooltip
        const tooltip = d3.select("body").append("div")
                                .attr("class", "tooltip-section2-chart")
                                .style("opacity", 0)
                                .style("position", "absolute")
                                .style("background-color", "white")
                                .style("box-shadow", "0px 1px 5px 0px rgba(0, 0, 0, 0.25)")
                                .style("border-radius", "16px")
                                .style("padding", "16px")
                                .style("pointer-events", "none");
        
        // show tooltip when hovering on the vertical line
        // Add event listeners for vertical lines to show tooltip on hover
        svg.selectAll(".vertical-band")
            .on("mouseover", (event, year) => {
                const yearData = cancerTypes.map(cancerType => (
                    {
                        type: cancerType,
                        value: parseFloat(typeDataByCountry[selectedCountryOrRegion][cancerType][year]).toFixed(4)
                    }
                ));
                //sort from largest to loweset
                const sortedYearData = yearData.sort((a,b) => b.value - a.value);

                tooltip.transition()
                            .duration(200)
                            .style("opacity", 1)
                
                tooltip.html(() => {
                    const tooltipContent = `<div style="font-weight: 600; font-size: 14px; line-height: 24px;" > ${year} </div><br>` + 
                                            sortedYearData.map( d => 
                                                `<div style="display: flex; flex-direction: row; align-items: center; gap: 8px; padding: 3px 0; ">
                                                    <div style=" width: 16px; height: 16px; background-color: ${color(d.type)}; "></div>
                                                    <div style="font-weight: 500; font-size: 12px; line-height: 16px; margin: 0; padding: 0;">${d.type}: ${d.value}</div>   
                                                </div>`
                                            ).join("")
                    return tooltipContent;
                })
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 200) + "px");

            })
            .on("mouseout", () => {
                tooltip.transition()
                            .duration(500)
                            .style("opacity", 0)
            })
    };


    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">{`Prevalence Of Cancer By Type (${yearRange[0]} - ${yearRange[1]})`}</div>
            <div className="description" id="description">This related chart shows the estimated number of people with each type of cancer:</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={selectedTabOption} onChange={handleTabOptionChange}/>
                <FormControl size="small">
                    {selectedTabOption === 'table' 
                    ?
                        (
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
                    :
                        (
                            <Select sx={{width: "250px"}} value={selectedCountryOrRegion} onChange={handleCountryOrRegionChange}>
                               {Object.keys(typeDataByCountry).map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                               ))}
                            </Select>
                        )
                    }
                    
                </FormControl>
            </div>
            <div className="canvas" id="canvas2">{selectedTabOption==="table" ? createTable(filteredTypeDataByCountry) : createChart()}</div>
            <div className="slider-control" id="slider-control2">{createSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section2;