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

    //group data by country in an object
    const dataByCountry = {};
    // Mapping of cancer types to CSV columns

    const cancerMapping = {
        "Bladder Cancer": "Current number of cases of bladder cancer per 100 people, in both sexes aged age-standardized",
        "Brain and Central Nervous System Cancer": "Current number of cases of brain and central nervous system cancer per 100 people, in both sexes aged age-standardized",
        "Breast Cancer": "Current number of cases of breast cancer per 100 people, in both sexes aged age-standardized",
        "Cervical Cancer": "Current number of cases of cervical cancer per 100 people, in both sexes aged age-standardized",
        "Colon and Rectum Cancer": "Current number of cases of colon and rectum cancer per 100 people, in both sexes aged age-standardized",
        "Esophageal Cancer": "Current number of cases of esophageal cancer per 100 people, in both sexes aged age-standardized",
        "Gallbladder and Biliary Tract Cancer": "Current number of cases of gallbladder and biliary tract cancer per 100 people, in both sexes aged age-standardized",
        "Kidney Cancer": "Current number of cases of kidney cancer per 100 people, in both sexes aged age-standardized",
        "Larynx Cancer": "Current number of cases of larynx cancer per 100 people, in both sexes aged age-standardized",
        "Liver Cancer": "Current number of cases of liver cancer per 100 people, in both sexes aged age-standardized",
        "Lip and Oral Cavity Cancer": "Current number of cases of lip and oral cavity cancer per 100 people, in both sexes aged age-standardized",
        "Nasopharynx Cancer": "Current number of cases of nasopharynx cancer per 100 people, in both sexes aged age-standardized",
        "Non-Melanoma Skin Cancer": "Current number of cases of non-melanoma skin cancer per 100 people, in both sexes aged age-standardized",
        "Ovarian Cancer": "Current number of cases of ovarian cancer per 100 people, in both sexes aged age-standardized",
        "Pancreatic Cancer": "Current number of cases of pancreatic cancer per 100 people, in both sexes aged age-standardized",
        "Prostate Cancer": "Current number of cases of prostate cancer per 100 people, in both sexes aged age-standardized",
        "Stomach Cancer": "Current number of cases of stomach cancer per 100 people, in both sexes aged age-standardized",
        "Testicular Cancer": "Current number of cases of testicular cancer per 100 people, in both sexes aged age-standardized",
        "Thyroid Cancer": "Current number of cases of thyroid cancer per 100 people, in both sexes aged age-standardized",
        "Tracheal, Bronchus, and Lung Cancer": "Current number of cases of tracheal, bronchus, and lung cancer per 100 people, in both sexes aged age-standardized",
        "Uterine Cancer": "Current number of cases of uterine cancer per 100 people, in both sexes aged age-standardized"
    };
    // Get cancer types
    const cancerTypes = Object.keys(cancerMapping);

    section2Data.forEach((row) => {
        const country = row.Entity;
        const year = row.Year;
        //create an obejct for each country if it doesn't exist
        if(!dataByCountry[country]){
            dataByCountry[country]={}
        };
        //create year object to each country if it doesn't exist
        if(!dataByCountry[country][year]){
            dataByCountry[country][year]={}
        };

        cancerTypes.forEach(cancerType => {
            //create cancer type object to each country if it doesn't exist
            if(!dataByCountry[country][cancerType]){
                dataByCountry[country][cancerType]={}
            };
            dataByCountry[country][cancerType][year] = row[cancerMapping[cancerType]];
        })

        dataByCountry[country]["Code"] = row["Code"];
        cancerTypes.forEach(cancerType => {
            dataByCountry[country][year][cancerType] = row[cancerMapping[cancerType]];
        })
    })

    console.log("dataByCountry in section 2:", dataByCountry);


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