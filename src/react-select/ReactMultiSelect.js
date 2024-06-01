import React from 'react';
import Select from 'react-select';

const ReactMultiSelect = ({defaultValue, options, onChange}) => {
    return (
        <Select 
                isMulti
                closeMenuOnSelect={false}
                defaultValue = {defaultValue}
                options={options}
                onCHange={onChange}
            />
    );
};

export default ReactMultiSelect;