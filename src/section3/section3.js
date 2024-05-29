import React, {useState} from "react";
import "../section/section.css";
import ToggleButtonTableChart from "../toggleButton/toggleButtonTableChart";
import YearSlider from "../slider/YearSlider";


const Section3 = ({id, isActive}) => {

    const [selectedYear, setSelectedYear] = useState(2019);
    const [selectedTabOption, setSelectedTabOption] = useState("table");


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