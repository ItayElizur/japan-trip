import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import DATA from '../../data/regions';

const REGION_CENTERS: Record<string, [number, number]> = {
  tokyo:    [35.68,  139.72],
  kyoto:    [35.01,  135.77],
  hokkaido: [43.50,  142.50],
  alps:     [36.20,  137.80],
  tohoku:   [38.50,  140.50],
  kansai:   [34.50,  135.50],
  fuji:     [35.36,  138.73],
};

export default function JapanOverviewMap({ setActiveRegion }: { setActiveRegion: (rid: string) => void }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 10 }}>
        לחץ על אזור במפה כדי לעבור אליו
      </div>
      <div className="jp-map-container" style={{ height: 420, direction: 'ltr' }}>
        <MapContainer
          center={[36.5, 137.5]}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Object.entries(DATA).map(([rid, rd]: [string, any]) => {
            const center = REGION_CENTERS[rid];
            if (!center) return null;
            return (
              <CircleMarker
                key={rid}
                center={center}
                radius={18}
                pathOptions={{
                  fillColor: rd.border,
                  fillOpacity: 0.85,
                  color: '#fff',
                  weight: 2,
                }}
                eventHandlers={{ click: () => setActiveRegion(rid) }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                  <span style={{ fontFamily: "'Heebo', sans-serif", fontSize: 12, fontWeight: 600 }}>
                    {rd.nameHe}
                  </span>
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
        {Object.entries(DATA).map(([rid, rd]: [string, any]) => (
          <button
            key={rid}
            className="jp-region-btn"
            onClick={() => setActiveRegion(rid)}
            style={{ borderColor: rd.border, color: rd.textColor, background: rd.color }}
          >
            {rd.nameHe}
          </button>
        ))}
      </div>
    </div>
  );
}
