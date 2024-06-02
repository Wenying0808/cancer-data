import React from 'react';
import Select from 'react-select';

const ReactMultiSelect = ({value, options, onChange}) => {
    return (
        <Select 
                isMulti
                closeMenuOnSelect={false}
                value = {value}
                options={options}
                onChange={onChange}
            />
    );
};

export default ReactMultiSelect;