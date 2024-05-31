import React, {useState} from "react";
import "../section/section.css";
import ToggleButtonTableMapChart from "../toggleButton/toggleButtonTableMapChart";
import YearRangeSlider from "../slider/YearRangeSlider";
import YearSlider from "../slider/YearSlider";


const Section4 = ({id, isActive}) => {
    const [selectedTabOption, setSelectedTabOption] = useState("table");
    const [section4Data, setSection4Data] = useState([]);
    const [yearRange, setYearRange] = useState([1990, 2019]);
    const [mapYear, setMapYear] = useState(2019);

    const handleTabOptionChange = (event, newTabOption) => {
        if(newTabOption !== selectedTabOption){
            setSelectedTabOption(newTabOption);
        }
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
        return (<YearSlider year={yearRange} handleYearChange={handleYearRangeChange}></YearSlider>);
    };

    const createMapSlider = () => {
        return (<YearSlider year={mapYear} handleYearChange={handleMapYearChange}></YearSlider>);
    };

    return(
        <section id={id} className={`section ${isActive ? "active" : ""}`}>
            <div className="title" id="title">The global disease burden from cancer</div>
            <div className="description" id="description">
                Disability-Adjusted Life Years (DALYs) per 100,000 individuals from all cancer types.
            </div>
            <div className="control" id="control">
                <ToggleButtonTableMapChart value={selectedTabOption} onChange={handleTabOptionChange}/>
            </div>
            <div className="canvas" id="canvas4"></div>
            <div className="slider-control" id="slider-control4">{selectedTabOption === "map" ? createMapSlider() : createTableChartSlider()}</div>
            <div className="resource" id="resource">Data source: IHME, Global Burden of Disease (2019)</div>
        </section>
    )
};

export default Section4;