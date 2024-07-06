import { MapContainer, Marker, Popup, TileLayer, GeoJSON, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L, { divIcon } from 'leaflet';


function MyComponent() {
    const map = useMapEvents({
        click: (e) => {
            console.log(e);
        },
        locationfound: (location) => {
            console.log('location found:', location)
        },
    })
    return map;
};

export default function GeoFence() {
    const [data, setData] = useState();
    const [data1, setData1] = useState();
    const [selectedStates, setSelectedStates] = useState([]);
    useEffect(() => {
        fetch('/data/us-states1.json').then(res => res.json()).then(data => {
            setData(data);
            fetch('/data/us-states.json').then(res => res.json()).then(data1 => {
                setData1(data1);
            });
        });
        // write fetch api call here
    }, []);
    const setIcon = ({ properties }, latlng) => {
        console.log(properties);
        return L.marker(latlng, { icon: customMarkerIcon(properties.Name) });
    };
    const customMarkerIcon = (name) => console.log(name) || divIcon({
        html: name,
        className: "icon"
    });
   
    const onEachFeature = (feature, layer) => {
        console.log(feature);
        layer.on('click', function () {
            const stateName = feature.properties.name;
            if (selectedStates.includes(stateName)) {
                let index = selectedStates.indexOf(stateName);
                selectedStates.splice(index, 1);
                setSelectedStates([...selectedStates]);
                layer.setStyle({ color: 'red' });

            } else {
                layer.setStyle({ color: 'blue' });
                selectedStates.push(stateName);
                setSelectedStates([...selectedStates]);
            }
        });
    };

    const setColor = ({ properties }) => {
        return { weight: 1 };
    };

    const handleSubmit = () => {
        console.log(selectedStates);
        // add method to fetch data
        fetch('https://httpbin.org/post', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedStates)
        }).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }
    return (
        <div style={{ display: 'flex' }}>
            <div id="sidebar" style={{ width: '75%' }}>
                {data && data1 && <MapContainer style={{ height: '100vh', width: '100%' }}
                    // center={[51.505, -0.09]} 
                    zoom={4}
                    scrollWheelZoom={false}
                    center={[37.8, -96]}
                    maxBoundsViscosity={1.0}
                    zoomControl={false}
                    dragging={false}
                    touchZoom={false}
                    doubleClickZoom={false}
                    boxZoom={false}
                    keyboard={false}
                    id='mapId'
                >
                    {/* <MyComponent /> */}
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* <Marker position={[37.8, -96]} >
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker> */}
                    <GeoJSON attribution="© OpenStreetMap" data={data} pointToLayer={setIcon} />
                    <GeoJSON attribution="© OpenStreetMap" onEachFeature={onEachFeature} data={data1} style={setColor} />
                </MapContainer>}
            </div>
            <div id="selectedStates" style={{ width: '25%' }}>
                <h2 style={{ margin: '10px' }}>Selected States</h2>
                {selectedStates.length> 0 && selectedStates.map((state, i) =>
                    <p key={i} style={{ color: 'blue', padding: '10px', border: '1px solid black', margin: '10px', borderRadius: '5px', fontWeight: 'bold', textAlign: 'center', width: '95%' }}>{state}</p>
                )} 
                <button onClick={handleSubmit} style={{ margin: '10px', padding: '10px', border: '1px solid black', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
            </div>
        </div>
    );
};