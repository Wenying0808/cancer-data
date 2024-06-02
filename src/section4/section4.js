import React, {useState, useEffect, useMemo} from "react";
import * as d3 from "d3";
import "../section/section.css";
import section4Dataset from './section4data.csv';
import ToggleButtonTableMapChart from "../toggleButton/toggleButtonTableMapChart";
import YearRangeSlider from "../slider/YearRangeSlider";
import YearSlider from "../slider/YearSlider";
import WorldMap from "../worldmap/worldmap";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "../worldmap/ContinentCountryId";
import ReactMultiSelect from "../react-select/ReactMultiSelect";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomColorPalette from "../color/colorPalette";



const Section4 = ({id, isActive}) => {
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [section4Data, setSection4Data] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const [mapYear, setMapYear] = useState(2019);
    const[selectedContinent, setSelectedContinent] = useState("World");
    const[selectedCountryOrRegion, setSelectedCountryOrRegion] = useState("European Region (WHO)");
    const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);


    // fetch data from csv
    useEffect(() => {
        d3.csv(section4Dataset).then(function(data, error){
            if(error){
                console.log("fetch section4data from csv file:", error)
            }else{
                setSection4Data(data);
            };
        });
    }, []);
    console.log("Section4 Fetched CSV Data:", section4Data);

    // group data by country
    const burdenDataByCountry = useMemo(() => {
        const dataByCountry = {};
        section4Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;

            if(!dataByCountry[country]){
                dataByCountry[country] = {};
            };
            if(!dataByCountry[country]["Year Data"]){
                dataByCountry[country]["Year Data"] = {};
            };
            
            dataByCountry[country]["Year Data"][year] = row["DALYs (Disability-Adjusted Life Years) - Neoplasms - Sex: Both - Age: Age-standardized (Rate)"];  
            dataByCountry[country]["Code"] = row.Code;
            dataByCountry[country]["Entity"] = row.Entity;
            
            if(!dataByCountry[country]["id"]){
                const countryDetail = iso3166Lookup.findAlpha3(row.Code);
                if(countryDetail) {
                dataByCountry[country]["id"] = countryDetail.num3;
                }
            };
            
        });
        return dataByCountry;
    }, [section4Data]);

    console.log("section4 burdenDataByCountry", burdenDataByCountry);
    console.log("section4 Object.entries(burdenDataByCountry)", Object.entries(burdenDataByCountry));

    // generate options for multiSelect

    const multiSelectOptions = useMemo(() => {
        return Object.keys(burdenDataByCountry).map((key) => ({
            label: key,
            value: key
        }));
    }, [burdenDataByCountry]);
    console.log("section4 multiSelectOptions",  multiSelectOptions);

    // set default value for selectedMultipleOptions
    useEffect(() => {
        const defaultOptions = [
                multiSelectOptions.find(option => option.value === "African Region (WHO)"),
                multiSelectOptions.find(option => option.value === "Eastern Mediterranean Region (WHO)"),
                multiSelectOptions.find(option => option.value === "European Region (WHO)"),
                multiSelectOptions.find(option => option.value === "Region of the Americas (WHO)"),
                multiSelectOptions.find(option => option.value === "Western Pacific Region (WHO)"),
        ].filter(Boolean); // filter out undefined values
        setSelectedMultiOptions(defaultOptions);
    }, [multiSelectOptions]);
    console.log("section4  selectedMultiOptions",  selectedMultiOptions);

    // filter datByCountry by selectedContinent for table and map
    const filteredBurdenDataByCountry = useMemo(() => {
        // convert object to key-value pair array, the first array is country, and the second array is its data
        const filteredData = Object.entries(burdenDataByCountry).filter(([country, data]) => {
            const countryCode = data["Code"];
            const countryId = iso3166Lookup.findAlpha3(countryCode, "num3");
            const countriesInSelectedContinent = continentCountryIds[selectedContinent];

            if(selectedContinent === "World"){
                return true;
            } else {
                return countriesInSelectedContinent && countriesInSelectedContinent.includes(parseInt(countryId))
            }
        });
        return Object.fromEntries(filteredData);

    }, [burdenDataByCountry, selectedContinent]);

    console.log("section4 filteredBurdenDataByCountry", filteredBurdenDataByCountry);

    // filter datByCountry by selectedMultipleOptions for chart
    const filteredBurdenDataByCountryForChart = useMemo(() => {
        const selectedCountries = selectedMultiOptions.map(option => option?.value);

        // convert object to key-value pair array, the first array is country, and the second array is its data

        const filteredData = Object.entries(burdenDataByCountry).filter(([country, data]) => {
            return selectedCountries.includes(country);
        });
        return Object.fromEntries(filteredData);

    }, [burdenDataByCountry, selectedMultiOptions]);

    console.log("section4 filteredBurdenDataByCountryForChart", filteredBurdenDataByCountryForChart);
   
    //transform data which is suitable for rechart
    const transformedDataForChart = useMemo(() => {
        // Handle case where filtered data is empty
        if (Object.keys(filteredBurdenDataByCountryForChart).length === 0) return [];

        const firstCountry = Object.keys(filteredBurdenDataByCountryForChart)[0];
        const years = Object.keys(filteredBurdenDataByCountryForChart[firstCountry]["Year Data"]);

        //filter data based on the selected yearRange
        const filteredYears =years.filter(year => year >= yearRange[0] && year <= yearRange[1]);
        const result = filteredYears.map(year => {
            const yearData = { year };
            Object.keys(filteredBurdenDataByCountryForChart).forEach(country => {
                yearData[country] = parseFloat(filteredBurdenDataByCountryForChart[country]["Year Data"][year])
            });
            return yearData;
        });
        return result;

    }, [filteredBurdenDataByCountryForChart, yearRange]);

    console.log("section4 transformedDataForChart", transformedDataForChart);
   

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

    const handleMultiSelectChange = (selectedOptions) => {
        setSelectedMultiOptions(selectedOptions);
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
                                {`${yearRange[0]}`}
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
                                {`${yearRange[1]}`}
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
                                            backgroundColor: '#F5F5F5',
                                        }}
                                    >
                                        {country}
                                    </TableCell>
                                    <TableCell>
                                        {data[country]["Year Data"][yearRange[0]]}
                                    </TableCell>
                                    <TableCell>
                                        {data[country]["Year Data"][yearRange[1]]}
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
                                                {data[country]["Year Data"][yearRange[0]]}
                                            </TableCell>
                                            <TableCell>
                                                {data[country]["Year Data"][yearRange[1]]}
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

    const createMap = () => {
        return(<WorldMap mapYear={mapYear} dataByCountry={burdenDataByCountry} selectedContinent={selectedContinent}/>);
    };

    const createChart = (data) => {
        
        const selectedCountries = selectedMultiOptions.map(option => option?.value);
        return(
            <ResponsiveContainer width={900} height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend  layout="horizontal" />
                    {selectedCountries.map((country, index) => (
                        <Line 
                            key={country} 
                            type="monotone" 
                            dataKey={country} 
                            stroke={CustomColorPalette[index % CustomColorPalette.length]} 
                            activeDot={{ r: 8 }} 
                        />
                    ))}
                </LineChart>
         </ResponsiveContainer>
        );   
    };


    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">
                {selectedTabOption !=="map" ? `Disease Burden Rates From Cancers (${yearRange[0]} - ${yearRange[1]})` : `Disease Burden Rates From Cancers (${mapYear})`}
            </div>
            <div className="description" id="description">
                Disability-Adjusted Life Years (DALYs) per 100,000 individuals from all cancer types.
            </div>
            <div className="control" id="control">
                <ToggleButtonTableMapChart value={selectedTabOption} onChange={handleTabOptionChange}/>
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
                        : selectedTabOption === "map" 
                            ? (
                                <Select sx={{width: "250px"}} value={selectedCountryOrRegion} onChange={handleCountryOrRegionChange}>
                                    {Object.keys(burdenDataByCountry).map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                    ))}
                                    </Select>
                            ) 
                            : (
                                <ReactMultiSelect value={selectedMultiOptions} options={multiSelectOptions} onChange={handleMultiSelectChange}/>
                            )
                    }
                </FormControl>
            </div>
            <div className="canvas" id="canvas4">
                {selectedTabOption === "table" ? createTable(filteredBurdenDataByCountry) 
                    : selectedTabOption === "map" ?  createMap()
                        : createChart(transformedDataForChart)
                }
            </div>
            <div className="slider-control" id="slider-control4">{selectedTabOption !== "map" ? createTableChartSlider() : createMapSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section4;