import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from 'topojson-client';
import iso3166Lookup from "iso3166-lookup";

const WorldMap = ({mapYear, dataByCountry, selectedContinent}) => {
    const continentCountryIds = {
        "World":[],
        "Africa": [
            12, 24, 72, 108, 120, 132, 140, 148, 174, 178, 180, 204, 226, 231, 232, 262, 266, 270,
            288, 324, 384, 404, 426, 430, 434, 450, 454, 466, 478, 480, 504, 508, 516, 562, 566, 624, 646, 686, 694,
            706, 710, 716, 728, 729, 732, 748, 768, 788, 800, 818, 834, 854, 894
        ],
        "Asia":[
            4, 31, 48, 50, 51, 64, 96, 104, 116, 144, 156, 158, 196, 268, 356, 360, 364, 368,
            376, 392, 398, 400, 408, 410, 414, 417, 418, 422, 426, 458, 462, 496,
            512, 524, 586, 608, 634, 643, 682, 690, 702, 704, 760, 762,
            764, 784, 792, 795, 860, 887
        ],
        "Europe":[
            8, 20, 40, 56, 70, 100, 112, 191, 203, 208, 233, 234, 246, 250, 276, 292, 300, 304, 336,
            348, 352, 372, 380, 428, 440, 442, 470, 492, 498, 499, 528, 578, 616,
            620, 642, 643, 688, 703, 705, 724, 752, 756, 804, 807, 826, 833
        ],
        "North America":[
            28, 44, 60, 84, 124, 136, 188, 192, 212, 214, 222, 308, 320, 332, 388, 484,
            500, 558, 591, 659, 662, 670, 780, 796, 840, 850
        ],
        "South America":[
            32, 68, 76, 152, 170, 218, 238, 254, 328, 600, 604, 740, 858, 862
        ],
        "Oceania":[
            36, 90, 184, 242, 258, 296, 316, 520, 540, 548, 554, 591, 598, 882
        ],
    }

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
        if (dataByCountry[country].hasOwnProperty(mapYear)){
            const value = dataByCountry[country][mapYear];
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

    const filteredMapFeatures = selectedContinent === "World"
    ? mapFeatures.features
    : mapFeatures.features.filter(feature => continentCountryIds[selectedContinent].includes(parseInt(feature.id)))

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
            </svg>
        </>
    )
};

export default WorldMap;