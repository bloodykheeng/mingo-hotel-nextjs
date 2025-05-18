'use client';

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix marker icon issue in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/react-leaflet-images/marker-icon-2x.png",
    iconUrl: "/react-leaflet-images/marker-icon.png",
    shadowUrl: "/react-leaflet-images/marker-shadow.png",
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [12, -41],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

interface MapComponentProps {
    location: {
        lat: number;
        lng: number;
        name: string;
    };
}

const MapComponent: React.FC<MapComponentProps> = ({ location }) => {
    const { BaseLayer } = LayersControl;

    return (
        <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
        >
            <LayersControl>
                <BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </BaseLayer>
                <BaseLayer name="Terrain View">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={["mt1", "mt2", "mt3"]}
                    />
                </BaseLayer>
                <BaseLayer name="Satellite View">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={["mt1", "mt2", "mt3"]}
                    />
                </BaseLayer>
                <BaseLayer name="Hybrid View">
                    <TileLayer
                        url="https://{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
                        maxZoom={20}
                        subdomains={["mt1", "mt2", "mt3"]}
                    />
                </BaseLayer>
            </LayersControl>

            <Marker position={[location.lat, location.lng]}>
                <Popup>
                    <div>
                        <h3 className="font-bold text-lg">{location.name}</h3>
                        <p>Welcome to Mingo Hotel Kayunga Ltd</p>
                        <p>Your home away from home</p>
                        <a
                            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline mt-2 inline-block"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;