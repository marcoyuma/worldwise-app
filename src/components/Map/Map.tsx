import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";

import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { Button } from "../Button/Button";
import { useGeolocate } from "../../hooks/useGeolocate";
import { useUrlPosition } from "../../hooks/useUrlPosition";
import { useCitiesContext } from "../../hooks/useCitiesContext/useCitiesContext";

export const Map = () => {
    // useSearchParams is a React Router hook used to fetch, update, and manage query parameters in a URL.
    // usually used for filtering
    // in our app case, we stored our data in the url
    // * but now we no longer using this because we split it into custom hook
    // const [searchParams] = useSearchParams();
    // * destructuring "lat" and "lng" and rename it as "mapLat" and "mapLng"
    const [mapLat, mapLng] = useUrlPosition();

    // * it's the same as if we use the below method but now it just cleaner
    // "get" method for getting the string name in argument properties. in below case is "lat" and "lng"
    // const mapLat = Number(searchParams.get("lat"));
    // const mapLng = Number(searchParams.get("lng"));

    // destructuting cities from global state
    const { cities } = useCitiesContext();

    // state to set the center of the map
    // we define the initial state as a tuple [number, number] so then it's should receive the exact two number inside the array. unlikely number[]
    const [mapPosition, setMapPosition] = useState<[number, number]>([40, 0]);

    // destructuring the useGeoLocation custom hooks
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocate();

    const { mapContainer, map } = styles;
    // console.log(mapLat, mapLng);

    // effect for set the "mapPosition" state based on 'mapLat' and 'mapLng' update which means it'll update when we click somewhere on the map and the new value from the 'useSearchparams()' hooks is taken and it's set as the new value of 'mapPosition' state
    // this effect handle the "mapPosition" state value for "center" map
    useEffect(() => {
        if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    }, [mapLat, mapLng]);
    // console.log(mapPosition);

    // effect for set the "mapPosition" state based on the "position as : geolocationPosition" state value.
    // handle the "center" value from the "useGeolocate" hooks. take the lat & lng value and set to the "mapPosition[number, number]" state
    useEffect(() => {
        if (geolocationPosition?.lat && geolocationPosition?.lng) {
            setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
        }
    }, [geolocationPosition]);

    // useEffect(() => {
    //     if (lat && lng) {
    //         setMapPosition([parseFloat(lat), parseFloat(lng)]);
    //     }
    //     console.log(lat, lng);
    // }, [lat, lng]);

    // const mapContainerProps: MapContainerProps = {
    //     className: map,
    //     center: mapPosition,
    // };
    // console.log(mapPosition);

    return (
        // when we click this component then the navigate function will be called and take us to whatever path we
        // passed as an argument in "navigate()" function
        <div id="map" className={mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "loading..." : "use ur position"}
                </Button>
            )}
            {/* we make mistake before by not looking at the official documentation for this library n thats cause a never solved error. next time we'll take a good look to the official documentation */}
            <MapContainer
                className={map}
                // this is where the center is before we use "ChangeCenter" component as method to change the center of the map dynamicly
                center={mapPosition}
                // center={[mapLat, mapLng]}
                zoom={6}
                scrollWheelZoom={true}
                attributionControl={false}
            >
                <TileLayer
                    // leaflet terbaru, attribution itu tidak diperlukan lagi
                    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {/* <Marker position={mapPosition}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
                {cities?.map(({ id, position, emoji, cityName }) => {
                    // validation if there's undefined on position
                    if (
                        !position ||
                        position.lat === undefined ||
                        position.lng === undefined
                    ) {
                        // console.warn("City position is undefined or incomplete:", city);
                        return null; // dont render anything if the condition is truth
                    }
                    return (
                        <Marker
                            position={[position.lat, position.lng]}
                            key={id}
                        >
                            <Popup>
                                <span>{emoji}</span> <span>{cityName}</span>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* component for set the center of the map depens on the lat and lng state */}
                <ChangeCenter position={mapPosition} />
                {/* detect the click from the map then navigate  */}
                <DetectClick />
            </MapContainer>
        </div>
    );
};

// always remember that this is the component method to set and manipulation the leaflet library position value
// component that handle center of the map dynamicly based on the "position[number, number]" props
const ChangeCenter = ({
    position,
    zoom,
}: {
    position: [number, number];
    zoom?: number;
}) => {
    // map is assign the "useMap" from leaflet as
    const map = useMap();
    map.setView(position, zoom);
    return null;
};

// handle the click then update the url and navigate to it (which means render based on the lat & lng props on the map)
const DetectClick = () => {
    // useNavigate from react router
    // return a function call navigate to move to other url by passing the path string as an argument
    const navigate = useNavigate();
    useMapEvents({
        click: (e: LeafletMouseEvent) => {
            console.log(e);
            // when the map is clicked, we navigate to the 'form?lat=${e.latlng.lat}&lng=${e.latlng.lng}'. that means we go to the page withou
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
            console.log(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });
    return null;
};
