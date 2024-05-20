import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from 'topojson-client';
import iso3166Lookup from "iso3166-lookup";

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

    // Define color scale with default domain (if no valid data)
    const colorScale = d3.scaleSequential(d3.interpolateOranges)
                            .domain([0, 30]) 

    //tooltip
    const tooltip = d3.select("body")
                        .append("div")
                        .append("id", "tooltip")
                        .style("position", "absolute")
                        .style("visibility", "hidden")
                        .style("background-color", "white")
                        .style("box-shadow", "0px 2px 20px 0px rgba(0, 0, 0, 0.35)")
                        .style("border-radius", "8px")
                        .style("padding", "16px")
                        .style("font-family", "sans-serif")
                        .style("z-index", 10)
                        .style("pointer-events", "none"); // Disable pointer events to prevent tooltip from interfering with mouse events
    return(
        <>
            <svg width="900px" height ="440px">
                <g>
                    {mapFeatures.features && mapFeatures.features.map((feature) => {
                        const countryId = feature.id;
                        const numberValue = selectedYearValueByCountry[countryId];
                        const countryName = iso3166Lookup.findNum3(countryId, "name");

                            return(
                                <path
                                    key={feature.id}
                                    id={feature.id}
                                    className={countryId}
                                    d={path(feature)}
                                    fill={numberValue ? colorScale(numberValue) : "gray"}
                                    stroke="white"
                                    strokeWidth={1}
                                    onMouseOver={(event)=>{
                                        const [px, py] = d3.pointer(event);
                                        tooltip.style("visibility", "visible")
                                                .html(
                                                        `${countryName}<br><br>${numberValue ? numberValue : "No data available"}`
                                                )
                                                .style("left", `${px + 300}px`)
                                                .style("top", `${py + 100}px`);
                                        
                                        // Change the stroke width and color on hover    
                                        d3.select(event.currentTarget).attr("stroke", "black");

                                    }}
                                    onMouseOut={(event) => {
                                        tooltip.style("visibility", "hidden")
                                        d3.select(event.currentTarget).attr("stroke", "white");
                                    }}
                                />
                            );
                    
                    })}
                </g>
            </svg>
        </>
    )
};

export default WorldMap;