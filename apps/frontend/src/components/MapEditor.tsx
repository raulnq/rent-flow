import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';
import type { Marker as LeafletMarker } from 'leaflet';

// Fix for default marker icon in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type MapEditorProps = {
  latitude: number | null;
  longitude: number | null;
  onChange: (coords: {
    latitude: number | null;
    longitude: number | null;
  }) => void;
  disabled?: boolean;
};

const DEFAULT_CENTER: [number, number] = [-12.0464, -77.0428];
const DEFAULT_ZOOM = 12;

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom()); // Keep current zoom
  }, [map, center]);

  return null;
}

function SearchControl({
  onChange,
  disabled,
}: {
  onChange: (coords: { latitude: number; longitude: number }) => void;
  disabled?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (disabled) return;

    const provider = new OpenStreetMapProvider({
      params: {
        'accept-language': 'es',
        countrycodes: 'pe',
      },
    });

    const searchControl = GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: true,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'Enter address...',
    });

    map.addControl(searchControl);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleLocationFound = (result: any) => {
      const { x: lng, y: lat } = result.location;
      onChange({
        latitude: lat,
        longitude: lng,
      });
    };

    map.on('geosearch/showlocation', handleLocationFound);

    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation', handleLocationFound);
    };
  }, [map, onChange, disabled]);

  return null;
}

export function MapEditor({
  latitude,
  longitude,
  onChange,
  disabled,
}: MapEditorProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    latitude !== null && longitude !== null
      ? [latitude, longitude]
      : DEFAULT_CENTER
  );
  const initialZoom =
    latitude !== null && longitude !== null ? 14 : DEFAULT_ZOOM;
  const markerRef = useRef<LeafletMarker>(null);

  const handleSearchResult = (coords: {
    latitude: number;
    longitude: number;
  }) => {
    onChange(coords);
    setMapCenter([coords.latitude, coords.longitude]);
  };

  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const newPos = marker.getLatLng();
      onChange({
        latitude: newPos.lat,
        longitude: newPos.lng,
      });
      setMapCenter([newPos.lat, newPos.lng]);
    }
  };

  const position =
    latitude !== null && longitude !== null
      ? ([latitude, longitude] as [number, number])
      : null;

  return (
    <div
      className={`h-[400px] rounded-md overflow-hidden border border-border ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <MapContainer
        center={mapCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={!disabled}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />
        <SearchControl onChange={handleSearchResult} disabled={disabled} />
        {position && (
          <Marker
            position={position}
            draggable={!disabled}
            ref={markerRef}
            eventHandlers={{
              dragend: handleMarkerDragEnd,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
