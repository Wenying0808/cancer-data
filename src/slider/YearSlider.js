import React from "react";
import "./slider.css";
import { Box, Slider, styled } from '@mui/material';

const CustomSlider = styled(Slider)({
    color: "#f50057", // Selected track color
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid rgba(71, 88, 220, 1)',
      boxShadow: '1 1 0 4px rgba(0, 0, 0, 0.25)',
      '&:hover': {
        boxShadow: '0 0 0 8px rgba(71, 88, 220, 0.2)', // Thumb hover effect
      },
    },
    '& .MuiSlider-track': {
        color: '#4758DC',
      height: 8,
      borderRadius: 4,
    },
    '& .MuiSlider-rail': {
      color: '#4758DC',
      height: 8,
      borderRadius: 4,
    },
    '& .MuiSlider-valueLabel': {
      left: 'calc(-50% px)',
      top: -20,
      backgroundColor: '#EFEFEF',
      boxShadow: '2 2 0 4px rgba(0, 0, 0, 0.25)',
      '& *': {
        background: 'transparent',
        color: '#000',
      },
    },
});

const YearSlider = ({year, handleYearChange}) => {
    
    //display value for the slider
    function valueText(value){
        return value;
    }

    return(
        <>
            <div className="slider-label">1990</div>
                <Box sx={{ width: 600 }}>
                    <CustomSlider
                        track={false}
                        value={year} 
                        onChange={handleYearChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valueText}
                        min={1990} 
                        max={2019}
                        color="secondary"
                    />
                </Box>
            <div className="slider-label">2019</div>
        </>
    );
};

export default YearSlider;