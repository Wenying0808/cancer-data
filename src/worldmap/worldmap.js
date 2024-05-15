import React, {useState, useEffect} from "react";
import * as d3 from "d3";
import { geoEqualEarth, geoPath } from "d3-geo";
import * as topojson from 'topojson-client';




const WorldMap = () =>{

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

    return(
        <>
            <svg width="900px" height ="480px">
                <g>
                    {mapFeatures.features && mapFeatures.features.map((feature)=>(
                        <path
                            key={feature.id}
                            id={feature.id}
                            d={path(feature)}
                            fill="black"
                            stroke="white"
                        >

                        </path>
                    ))}
                </g>
            </svg>
        </>
    )

};

export default WorldMap;