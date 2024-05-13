import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';


const ToggleButtonTableMap = ({value, onChange}) => {
    return (
        <ToggleButtonGroup value={value} onChange={onChange} exclusive >
            <ToggleButton value="table" sx={{gap:"8px"}}>
                <WindowOutlinedIcon/>
                Table
            </ToggleButton>
            <ToggleButton value="map" sx={{gap:"8px"}}>
                <PublicOutlinedIcon/>
                Map
            </ToggleButton>
        </ToggleButtonGroup>
    );
};


export default ToggleButtonTableMap;

