import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from 'topojson-client';

const WorldMap = ({mapYear, dataByCountry}) =>{

    const worldAltasURL="https://unpkg.com/world-atlas@1.1.4/world/50m.json";
    const [mapData, setMapData] = useState([]);
    const [mapFeatures, setMapFeatures] = useState([]);

    const projection = geoEqualEarth();
    const path = geoPath(projection);

    useEffect(() => {
        fetch(worldAltasURL)
        .then((response) => response.json())
        .then((topoJSONData) => {
            setMapData(topoJSONData);
            console.log("topoJSONData",topoJSONData);
            const worldFeatures = topojson.feature(topoJSONData, topoJSONData.objects.countries);
            setMapFeatures(worldFeatures);
            console.log("data", worldFeatures);
            
        })
        .catch((error) => {
            console.error("Error fetching world atlas data:", error);
        });
    }, []);


 
    const selectedYearValueByCountry = {};
    let minOfSelectedYearValueByCountry = 100;
    let maxOfSelectedYearValueByCountry = 0;

    //store country id as key and value of the seledted mapYear as key value
    for (const country in dataByCountry){
        if (dataByCountry[country].hasOwnProperty(mapYear)){
            const value = dataByCountry[country][mapYear];
            const countryId = dataByCountry[country].id;
            selectedYearValueByCountry[countryId] = value;
            const numberValue = parseFloat(value);

            /*console.log("value for each country", mapYear, country, numberValue);*/
            minOfSelectedYearValueByCountry = Math.min(numberValue, minOfSelectedYearValueByCountry);
            maxOfSelectedYearValueByCountry = Math.max(numberValue, maxOfSelectedYearValueByCountry);
        }
    }

    console.log("mapFeatures", mapFeatures);
    console.log("selectedYearValueByCountry", selectedYearValueByCountry);
    console.log("minOfSelectedYearValueByCountry", minOfSelectedYearValueByCountry);
    console.log("maxOfSelectedYearValueByCountry", maxOfSelectedYearValueByCountry);
    console.log("Data for country 840:", selectedYearValueByCountry[840]); // Log data for country 840
    console.log("Data for country 826:", selectedYearValueByCountry[826]);
    console.log("Data for country 804:", selectedYearValueByCountry[804]);

     // Define color scale with default domain (if no valid data)
    const colorScale = d3.scaleSequential(d3.interpolateOranges)
                            .domain([minOfSelectedYearValueByCountry, maxOfSelectedYearValueByCountry]) 

    return(
        <>
            <svg width="900px" height ="480px">
                <g>
                    {mapFeatures.features && mapFeatures.features.map((feature) => {
                        const countryId = feature.id;
                        const numberValue = selectedYearValueByCountry[countryId];

                            return(
                                <path
                                    key={feature.id}
                                    id={feature.id}
                                    d={path(feature)}
                                    fill={colorScale(numberValue)}
                                    stroke="white"
                                />
                            );
                    
                    })}
                </g>
            </svg>
        </>
    )
};

export default WorldMap;