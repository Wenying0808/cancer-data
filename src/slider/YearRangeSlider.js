import React from "react";
import "./slider.css";
import { Box, Slider} from '@mui/material';

const YearRangeSlider = ({yearRange, handleYearRangeChange}) => {
    
    //display value for the slider
    function valueText(value){
        return value;
    }

    return(
        <>
            <div className="slider-label">1990</div>
                <Box sx={{ width: 600 }}>
                    <Slider 
                        value={yearRange} 
                        onChange={handleYearRangeChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valueText}
                        min={1990} 
                        max={2019}
                        disableSwap
                        color="primary"
                    />
                </Box>
            <div className="slider-label">2019</div>
        </>
    );
};

export default YearRangeSlider;