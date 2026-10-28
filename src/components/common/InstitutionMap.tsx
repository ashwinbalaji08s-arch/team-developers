import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Institution } from '../../types/index.ts';

interface InstitutionMapProps {
  institutions: Institution[];
  selectedId?: string;
  onSelectInstitution?: (institution: Institution) => void;
  heightClass?: string;
}

export const InstitutionMap: React.FC<InstitutionMapProps> = ({
  institutions,
  selectedId,
  onSelectInstitution,
  heightClass = 'h-[400px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center of India coordinates by default (approx 20.5937° N, 78.9629° E)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 78.5],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = markersGroup;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const bounds: [number, number][] = [];

    institutions.forEach(inst => {
      if (inst.latitude && inst.longitude) {
        bounds.push([inst.latitude, inst.longitude]);

        const isSelected = inst.id === selectedId;
        const score = inst.overall_compliance_score || 75;
        const color = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444';

        // Custom Leaflet DivIcon for futuristic pin
        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              width: ${isSelected ? '28px' : '22px'};
              height: ${isSelected ? '28px' : '22px'};
              background: ${color};
              border: 2px solid #0f172a;
              border-radius: 50%;
              box-shadow: 0 0 10px ${color}88;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              font-weight: 700;
              font-size: 10px;
              cursor: pointer;
            ">
              ${inst.category.charAt(0)}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([inst.latitude, inst.longitude], { icon: customIcon });

        const popupContent = `
          <div style="min-width: 180px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 600; margin-bottom: 2px;">
              ${inst.code} · ${inst.district}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #f8fafc; margin-bottom: 4px;">
              ${inst.name}
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">
              ${inst.category} (${inst.funding_category})
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; padding-top: 6px; border-top: 1px solid #334155;">
              <span style="color: #94a3b8;">Compliance:</span>
              <span style="font-weight: 700; color: ${color};">${score}%</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectInstitution) {
            onSelectInstitution(inst);
          }
        });

        markersGroup.addLayer(marker);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }

    return () => {
      // Keep map alive or clean up
    };
  }, [institutions, selectedId, onSelectInstitution]);

  return (
    <div className={`w-full ${heightClass} rounded-xl overflow-hidden border border-slate-800 relative z-0`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
