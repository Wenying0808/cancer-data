import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from 'topojson-client';
import iso3166Lookup from "iso3166-lookup";
import continentCountryIds from "./ContinentCountryId";

const WorldMap = ({mapYear, dataByCountry, selectedContinent}) => {
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
            console.log("worldFeatures data", worldFeatures);
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
        if (dataByCountry[country]["Year Data"].hasOwnProperty(mapYear)){
            const value = dataByCountry[country]["Year Data"][mapYear];
            const countryId = dataByCountry[country].id;
            selectedYearValueByCountry[countryId] = value;
            const numberValue = parseFloat(value);

            /*console.log("value for each country", mapYear, country, numberValue);*/
            minOfSelectedYearValueByCountry = Math.min(numberValue, minOfSelectedYearValueByCountry);
            maxOfSelectedYearValueByCountry = Math.max(numberValue, maxOfSelectedYearValueByCountry);
        }
    };

    console.log("mapFeatures", mapFeatures);
    console.log("selectedYearValueByCountry", selectedYearValueByCountry);
    console.log("minOfSelectedYearValueByCountry", minOfSelectedYearValueByCountry);
    console.log("maxOfSelectedYearValueByCountry", maxOfSelectedYearValueByCountry);

    const filteredMapFeatures = 
        selectedContinent === "World"
        ? (mapFeatures.features || []) // Provide a default empty array if mapFeatures.features is undefined
        : (mapFeatures.features || []).filter(feature => continentCountryIds[selectedContinent].includes(parseInt(feature.id)));

    // Define color scale with default domain (if no valid data)
    const colorScale = d3.scaleSequential(d3.interpolateOranges)
                            .domain([minOfSelectedYearValueByCountry, maxOfSelectedYearValueByCountry])


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
                    {filteredMapFeatures && filteredMapFeatures.map((feature) => {
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

                {/*legend*/}
                <g transform="translate(10, 120)">
                    {d3.range(0, maxOfSelectedYearValueByCountry, (maxOfSelectedYearValueByCountry - 0)/10).reverse().map((d, i)=>(
                        <g key={i} transform={`translate(0, ${i * 20})`}>
                            <rect width="20px" height="20px" fill={colorScale(d)}></rect>
                            <text x="28px" y="20px" fontSize="10px">{d.toFixed()}</text>
                        </g>
                    ))}
                    <g transform="translate(0, 240)">
                        <rect width="20px" height="20px" fill="gray"></rect>
                        <text x="28px" y="14px" fontSize="10px">No Data</text>
                    </g>
                </g>
            </svg>
        </>
    )
};

export default WorldMap;