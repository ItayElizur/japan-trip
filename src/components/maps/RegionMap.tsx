import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet';

const REGION_ZOOM: Record<string, number> = {
  tokyo:    12,
  kyoto:    12,
  hokkaido: 7,
  alps:     9,
  tohoku:   8,
  kansai:   10,
  fuji:     10,
};

function mean(vals: number[]) {
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center[0], center[1], zoom]);
  return null;
}

export default function RegionMap({ rid, region }: { rid: string; region: any }) {
  const allAttractions = region.areas.flatMap((a: any) => a.attractions);
  const centerLat = mean(allAttractions.map((a: any) => a.lat));
  const centerLng = mean(allAttractions.map((a: any) => a.lng));
  const zoom = REGION_ZOOM[rid] ?? 10;

  return (
    <div className="jp-map-container" style={{ height: 300, marginBottom: '1.25rem', direction: 'ltr' }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapUpdater center={[centerLat, centerLng]} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {region.areas.map((area: any) => {
          const lats = area.attractions.map((a: any) => a.lat);
          const lngs = area.attractions.map((a: any) => a.lng);
          const lat = mean(lats);
          const lng = mean(lngs);
          return (
            <CircleMarker
              key={area.nameEn}
              center={[lat, lng]}
              radius={10}
              pathOptions={{
                fillColor: region.border,
                fillOpacity: 0.8,
                color: '#fff',
                weight: 2,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
                <span style={{ fontFamily: "'Heebo', sans-serif", fontSize: 11, fontWeight: 600 }}>
                  {area.nameHe}
                </span>
              </Tooltip>
              <Popup>
                <div style={{ fontFamily: "'Heebo', sans-serif", direction: 'rtl', minWidth: 140 }}>
                  <strong style={{ fontSize: 13 }}>{area.nameHe}</strong>
                  <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{area.nameEn}</div>
                  {area.attractions.map((a: any) => (
                    <div key={a.nameEn} style={{ fontSize: 12, padding: '2px 0', borderBottom: '1px solid #f0f0f0' }}>
                      {a.nameHe}
                    </div>
                  ))}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
