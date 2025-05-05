import { useRef, useState } from 'react';
import { Select, message } from 'antd';

import L, { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import './map.css';

import mapPin from '../../assets/map-pin-solid.svg';
import ubikePin from '../../assets/map-marker-alt-solid.svg';

const MAP_CENTER = [25.03746, 121.564558];
const MAP_ZOOM = 14;
const TILE_LAYER_URL = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`;

const CUSTOM_ICONS = new Icon({
  iconUrl: mapPin,
  iconSize: [30, 34],
});

const UBIKE_ICONS = new Icon({
  iconUrl: ubikePin,
  iconSize: [30, 34],
});

export default function Map({ positions }) {
  const initSearchData = () =>
    positions.map(({ sna }) => ({
      value: sna,
      label: sna,
    }));

  const [messageApi, contextHolder] = message.useMessage();
  const [mapCenter, setMapCenter] = useState(MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(MAP_ZOOM);
  const [ubikePositions, setUbikePositions] = useState(positions);
  const [markerTarget, setMarkerTarget] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchData] = useState(initSearchData);
  const mapRef = useRef();

  const handleDefaultMap = () => {
    setMapCenter(MAP_CENTER);
    setMapZoom(MAP_ZOOM);
    setUbikePositions(positions);
    setMarkerTarget(null);
    setLocation(null);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        calculateDistance({ lat: latitude, lng: longitude }, positions);
        setMapCenter([latitude, longitude]);
        setLocation([latitude, longitude]);
        setMapZoom(16);
      });
    } else {
      messageApi.open({
        type: 'warning',
        content:
          'Geolocation is not enabled. Please enable to use this feature',
      });
    }
  };

  const onChange = (value) => {
    const searchPosition = positions.find((each) => each.sna.includes(value));
    if (searchPosition) {
      setMapCenter([searchPosition.latitude, searchPosition.longitude]);
      setMapZoom(18);
      setUbikePositions(positions);
      setMarkerTarget(searchPosition);
      setLocation(null);
    }
  };

  const changeCenter = (marker) => {
    setMarkerTarget(marker);
    setMapCenter([marker.latitude, marker.longitude]);
    setMapZoom(18);
  };

  // calculate distance
  const calculateDistance = (point, coordinates) => {
    if (!point || !coordinates) return;

    const centerPoint = L.latLng(point);
    // const centerPoint = L.latLng(MAP_CENTER); // 測試，可刪

    const withInThreeRadius = coordinates.filter((each) => {
      let target = L.latLng(each.latitude, each.longitude);
      let distance = centerPoint.distanceTo(target);
      if (distance < 3000 && each.available_return_bikes > 0) return each;
    });

    setUbikePositions(withInThreeRadius);
  };

  const handleListPositions = (position) => {
    const { latitude, longitude } = position;
    setMarkerTarget(position);
    setMapCenter([latitude, longitude]);
  };

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
  };

  return (
    <div className='mb-30'>
      {contextHolder}
      <h5>UBike</h5>
      <div className='map-container'>
        <Select
          showSearch
          allowClear
          placeholder='Select...'
          optionFilterProp='label'
          style={{ width: '100%', marginBottom: '30px' }}
          onChange={onChange}
          onClear={handleDefaultMap}
          options={searchData}
        />
        {/* map container */}
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          ref={mapRef}
          scrollWheelZoom={false}
          smoothWheelZoom={false}
          smoothSensitivity={1}
          attributionControl={false}
        >
          <TileLayer url={TILE_LAYER_URL} />
          <MarkerClusterGroup>
            {ubikePositions.map((each) => (
              <Marker
                key={each.sna}
                position={[each.latitude, each.longitude]}
                icon={UBIKE_ICONS}
                eventHandlers={{
                  click: () => changeCenter(each),
                  mouseover: (event) => event.target.openPopup(),
                }}
              >
                <Popup>
                  <span>
                    {each.sna}
                    <br />
                    可借：{each.available_rent_bikes} / 可停：
                    {each.available_return_bikes}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          {location && (
            <Marker position={location} icon={CUSTOM_ICONS}></Marker>
          )}
          {<ChangeView center={mapCenter} zoom={mapZoom} />}
        </MapContainer>
        {/* target information on right */}
        {markerTarget && (
          <div className='search-container'>
            <p>站名：{markerTarget.sna}</p>
            <p>地址：{markerTarget.ar}</p>
            <p>可借：{markerTarget.available_rent_bikes}</p>
            <p>可停：{markerTarget.available_return_bikes}</p>
            <p>總量：{markerTarget.total}</p>
          </div>
        )}
        {/* location lists on left */}
        {location && ubikePositions.length > 0 && (
          <div className='within3radius-container'>
            <ul>
              {ubikePositions.map((each) => (
                <li onClick={() => handleListPositions(each)} key={each.sna}>
                  {each.sna} | 可停：{each.available_return_bikes}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* user location & default */}
        <div className='location-icon'>
          {location ? (
            <i onClick={handleDefaultMap} className='far fa-compass' />
          ) : (
            <i onClick={getUserLocation} className='fas fa-location-arrow' />
          )}
        </div>
      </div>
    </div>
  );
}
