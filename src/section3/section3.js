import React, {useState, useEffect, useMemo} from "react";
import "../section/section.css";
import * as d3 from "d3";
import section3Dataset from './section3data.csv';
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearSlider from "../slider/YearSlider";
import { Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl } from '@mui/material';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "../worldmap/ContinentCountryId";


const Section3 = ({id, isActive}) => {
    const [section3Data, setSection3Data] = useState([]);
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [selectedYear, setSelectedYear] = useState(2019);
    const[selectedContinent, setSelectedContinent] = useState("World");
    

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
    const AgeGroupDataByCountry = useMemo(() => {
        const dataByCountry = {};
        section3Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;

            if(!dataByCountry[country]){
                dataByCountry[country] = {};
            };

            dataByCountry[country]["Code"]=row.Code;

            ageGroups.forEach(ageGroup => {
                if(!dataByCountry[country][ageGroup]){
                    dataByCountry[country][ageGroup] = {};
                }
                dataByCountry[country][ageGroup][year] = row[ageGroupMapping[ageGroup]]
            });
        })
        return dataByCountry;
    }, [section3Data, ageGroupMapping, ageGroups])

    console.log("AgeGroupDataByCountry in Section3:", AgeGroupDataByCountry);
    console.log("Object.entries(AgeGroupDataByCountr) in Section3:", Object.entries(AgeGroupDataByCountry));


    //filter table data by selected continent
    const filteredAgeGroupDataByCountry = useMemo(() => {
        //convert object to key-value pair array, the first array is country, and the second array is its data
        const filteredData = Object.entries(AgeGroupDataByCountry).filter(([country, data]) => {

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
        
    }, [AgeGroupDataByCountry, selectedContinent]);
    console.log("filteredAgeGroupDataByCountry in section2", filteredAgeGroupDataByCountry);

    const handleTabOptionChange = (event, newTabOption) => {
        if(newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
    };

    const handleContinentChange = (event) => {
        setSelectedContinent(event.target.value)
    }

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
        return(
            <div style={{ maxHeight: "440px", overflowY: "auto" }}>
                <Table stickyHeader>
                    {/*table header: country, age group */}
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                sx={{
                                    minWidth: '150px',
                                    backgroundColor: '#FBFBFB',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 2,
                                    left: 0,
                                    fontWeight: 600
                                }}
                            >
                                Country / Region
                            </TableCell>
                            {ageGroups.map((ageGroup) => (
                                <TableCell 
                                    key={ageGroup} 
                                    sx={{ 
                                        minWidth: '150px',
                                        backgroundColor: '#FBFBFB',
                                        position: 'sticky',
                                        top: 0,
                                        left: 182,
                                        zIndex: 2,
                                        fontWeight:600,
                                    }} 
                                    align='left'
                                >
                                    {ageGroup}
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

    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">{`Cancer Prevalence By Age (${selectedYear})`}</div>
            <div className="description" id="description">By breaking down the data by age group, we can see that the majority of cancers are in older people.</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={selectedTabOption} onChange={handleTabOptionChange}/>
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
                        <Select>  

                        </Select>
                    )
                }
            </div>
            <div className="canvas" id="canvas3">{selectedTabOption==="table" ? createTable(filteredAgeGroupDataByCountry) : createChart()}</div>
            <div className="slider-control" id="slider-control3">{createSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section3;