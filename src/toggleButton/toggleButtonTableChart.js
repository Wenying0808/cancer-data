import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';


const ToggleButtonTableChart = ({value, onChange}) => {
    return (
        <ToggleButtonGroup size="small" value={value} onChange={onChange} exclusive>
            <ToggleButton value="table" sx={{gap:"8px"}}>
                <WindowOutlinedIcon fontSize="small"/>
                Table
            </ToggleButton>
            <ToggleButton value="chart" sx={{gap:"8px"}}>
                <InsertChartOutlinedIcon fontSize="small"/>
                Chart
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ToggleButtonTableChart;
