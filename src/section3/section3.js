import React, {useState, useEffect, useMemo} from "react";
import "../section/section.css";
import * as d3 from "d3";
import section3Dataset from './section3data.csv';
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearSlider from "../slider/YearSlider";


const Section3 = ({id, isActive}) => {
    const [section3Data, setSection3Data] = useState([]);
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [selectedYear, setSelectedYear] = useState(2019);
    

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
    const dataByCountry = useMemo(() => {
        const data = {};
        section3Data.forEach((row) => {
            const country = row.Entity;
            const year = row.Year;

            if(!data[country]){
                data[country] = {};
            };

            data[country]["Code"]=row.Code;

            ageGroups.forEach(ageGroup => {
                if(!data[country][ageGroup]){
                    data[country][ageGroup] = {};
                }
                data[country][ageGroup][year] = row[ageGroupMapping[ageGroup]]
            });
        })
        return data;
    }, [section3Data, ageGroupMapping, ageGroups])

    console.log("dataByCountry in Section3:", dataByCountry);


    const handleTabOptionChange = (event, newTabOption) => {
        if(newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
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

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">{`Cancer Prevalence By Age (${selectedYear})`}</div>
            <div className="description" id="description">By breaking down the data by age group, we can see that the majority of cancers are in older people.</div>
            <div className="control" id="control">
                <ToggleButtonTableChart value={selectedTabOption} onChange={handleTabOptionChange}/>
            </div>
            <div className="canvas" id="canvas3"></div>
            <div className="slider-control" id="slider-control3">{createSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section3;