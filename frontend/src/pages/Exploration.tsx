import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getExplorationZones, getExplorationZone } from '../services/api'
import { X, Layers, Target, Info, BarChart2, Pickaxe, Drill, Mountain, Eye, CheckSquare, Square } from 'lucide-react'

// Fix leaflet default icon issue
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
const DefaultIcon = L.icon({ iconUrl, shadowUrl, iconSize: [25,41], iconAnchor: [12,41] })
L.Marker.prototype.options.icon = DefaultIcon

// Custom SVG Icon for Active Mines
const createMineIcon = (status: string) => {
  const color = status === 'Active' ? '#f97316' : '#94a3b8'
  return L.divIcon({
    className: 'custom-mine-icon',
    html: `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 0 10px ${color}88; cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f1629" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2l6 6-4 4-6-6 4-4z"></path>
          <path d="M3 21l9-9"></path>
          <path d="M12.5 15.5L8 20"></path>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  })
}

const DEMO_ZONES = [
  { id:"MN-TARGET-01", name:"Balaghat North Extension", lat:22.05, lon:80.18, prospectivity_score:91, confidence:84, priority:"VERY HIGH", color:"#ef4444",
    polygon:[[22.03,80.14],[22.03,80.22],[22.07,80.22],[22.07,80.14]],
    evidence:{satellite:"Strong",geological:"Strong",terrain:"Moderate",historical:"Strong"},
    feature_importance:{spectral_signature:31,geology:27,structural_proximity:18,terrain:12,historical_evidence:12},
    recommendation:"Prioritize exploratory diamond drilling. High alteration index and fault intersections.", mn_grade_estimate:31.2, area_km2:3.2 },
  { id:"MN-TARGET-09", name:"Sitasaongi North", lat:21.30, lon:79.88, prospectivity_score:88, confidence:82, priority:"VERY HIGH", color:"#ef4444",
    polygon:[[21.28,79.85],[21.28,79.91],[21.32,79.91],[21.32,79.85]],
    evidence:{satellite:"Strong",geological:"Strong",terrain:"Strong",historical:"Strong"},
    feature_importance:{spectral_signature:30,geology:28,structural_proximity:17,terrain:13,historical_evidence:12},
    recommendation:"Critical priority — drill intercepts from adjacent areas confirm strong manganese horizon.", mn_grade_estimate:30.8, area_km2:3.5 },
  { id:"MN-TARGET-02", name:"Dongri Buzurg South", lat:21.98, lon:79.85, prospectivity_score:83, confidence:79, priority:"HIGH", color:"#f97316",
    polygon:[[21.96,79.82],[21.96,79.88],[22.00,79.88],[22.00,79.82]],
    evidence:{satellite:"Strong",geological:"Strong",terrain:"Moderate",historical:"Moderate"},
    feature_importance:{spectral_signature:28,geology:30,structural_proximity:20,terrain:11,historical_evidence:11},
    recommendation:"Schedule magnetic survey & exploratory core drillholes in Q1 cycle.", mn_grade_estimate:27.8, area_km2:2.8 },
  { id:"MN-TARGET-03", name:"Ukwa Central Extension", lat:21.65, lon:79.62, prospectivity_score:76, confidence:78, priority:"HIGH", color:"#f97316",
    polygon:[[21.63,79.59],[21.63,79.65],[21.67,79.65],[21.67,79.59]],
    evidence:{satellite:"Moderate",geological:"Strong",terrain:"Moderate",historical:"Moderate"},
    feature_importance:{spectral_signature:26,geology:29,structural_proximity:22,terrain:12,historical_evidence:11},
    recommendation:"High potential zone. Gondite band continuity confirmed by geological mapping.", mn_grade_estimate:25.4, area_km2:4.1 },
  { id:"MN-TARGET-07", name:"Tirodi Extension Block", lat:21.75, lon:79.98, prospectivity_score:72, confidence:74, priority:"HIGH", color:"#f97316",
    polygon:[[21.73,79.95],[21.73,80.01],[21.77,80.01],[21.77,79.95]],
    evidence:{satellite:"Moderate",geological:"Strong",terrain:"Moderate",historical:"Moderate"},
    feature_importance:{spectral_signature:27,geology:28,structural_proximity:21,terrain:12,historical_evidence:12},
    recommendation:"Strong structural fold control evident. Target synclinal fold limbs.", mn_grade_estimate:24.6, area_km2:2.7 },
  { id:"MN-TARGET-04", name:"Kandri Northeast", lat:21.42, lon:79.38, prospectivity_score:67, confidence:72, priority:"MODERATE", color:"#eab308",
    polygon:[[21.40,79.35],[21.40,79.41],[21.44,79.41],[21.44,79.35]],
    evidence:{satellite:"Moderate",geological:"Moderate",terrain:"Low",historical:"Moderate"},
    feature_importance:{spectral_signature:23,geology:31,structural_proximity:20,terrain:14,historical_evidence:12},
    recommendation:"Conduct 1:5000 geological mapping and soil geochemistry before drilling.", mn_grade_estimate:22.1, area_km2:2.4 },
  { id:"MN-TARGET-10", name:"Beldongri Southeast", lat:22.22, lon:80.05, prospectivity_score:63, confidence:68, priority:"MODERATE", color:"#eab308",
    polygon:[[22.20,80.02],[22.20,80.08],[22.24,80.08],[22.24,80.02]],
    evidence:{satellite:"Moderate",geological:"Moderate",terrain:"Low",historical:"Moderate"},
    feature_importance:{spectral_signature:24,geology:29,structural_proximity:22,terrain:13,historical_evidence:12},
    recommendation:"Moderate prospectivity. Low gravity anomaly warrants shallow scout drilling.", mn_grade_estimate:21.5, area_km2:2.1 },
  { id:"MN-TARGET-05", name:"Chikla South Block", lat:21.89, lon:79.15, prospectivity_score:58, confidence:65, priority:"MODERATE", color:"#eab308",
    polygon:[[21.87,79.12],[21.87,79.18],[21.91,79.18],[21.91,79.12]],
    evidence:{satellite:"Weak",geological:"Moderate",terrain:"Low",historical:"Weak"},
    feature_importance:{spectral_signature:21,geology:28,structural_proximity:25,terrain:14,historical_evidence:12},
    recommendation:"Subsurface continuity under alluvium needs induced polarization (IP) testing.", mn_grade_estimate:19.8, area_km2:1.9 },
  { id:"MN-TARGET-06", name:"Munsar West", lat:22.14, lon:79.52, prospectivity_score:48, confidence:60, priority:"LOW", color:"#22c55e",
    polygon:[[22.12,79.49],[22.12,79.55],[22.16,79.55],[22.16,79.49]],
    evidence:{satellite:"Weak",geological:"Moderate",terrain:"Low",historical:"Weak"},
    feature_importance:{spectral_signature:19,geology:32,structural_proximity:25,terrain:13,historical_evidence:11},
    recommendation:"Low immediate priority. Monitor for regional survey updates.", mn_grade_estimate:16.5, area_km2:1.5 },
  { id:"MN-TARGET-08", name:"Gumgaon Block A", lat:21.55, lon:79.78, prospectivity_score:42, confidence:58, priority:"LOW", color:"#22c55e",
    polygon:[[21.53,79.75],[21.53,79.81],[21.57,79.81],[21.57,79.75]],
    evidence:{satellite:"Weak",geological:"Low",terrain:"Low",historical:"Weak"},
    feature_importance:{spectral_signature:20,geology:30,structural_proximity:26,terrain:14,historical_evidence:10},
    recommendation:"Insufficient evidence. Deprioritize for current exploration cycle.", mn_grade_estimate:14.2, area_km2:1.8 },
]

// MOIL Active Mines in Sausar Belt
const MOIL_MINES = [
  { id: "MINE-01", name: "Balaghat Mine", lat: 21.90, lon: 80.20, type: "Underground (Asia's Deepest)", capacity: "500,000 t/yr", grade: "44.5% Mn", status: "Active", reserves: "18.4 Mt", depth: "420m" },
  { id: "MINE-02", name: "Dongri Buzurg Mine", lat: 21.55, lon: 79.72, type: "Mechanized Opencast", capacity: "400,000 t/yr", grade: "38.2% Mn", status: "Active", reserves: "14.2 Mt", depth: "110m" },
  { id: "MINE-03", name: "Chikla Mine", lat: 21.58, lon: 79.75, type: "Underground", capacity: "300,000 t/yr", grade: "40.1% Mn", status: "Active", reserves: "9.8 Mt", depth: "260m" },
  { id: "MINE-04", name: "Tirodi Mine", lat: 21.72, lon: 79.92, type: "Opencast & Underground", capacity: "250,000 t/yr", grade: "36.0% Mn", status: "Active", reserves: "7.5 Mt", depth: "140m" },
  { id: "MINE-05", name: "Kandri Mine", lat: 21.44, lon: 79.31, type: "Mechanized Opencast", capacity: "220,000 t/yr", grade: "42.0% Mn", status: "Active", reserves: "6.1 Mt", depth: "95m" },
  { id: "MINE-06", name: "Mansar Mine", lat: 21.40, lon: 79.28, type: "Opencast", capacity: "150,000 t/yr", grade: "35.8% Mn", status: "Active", reserves: "4.9 Mt", depth: "75m" },
  { id: "MINE-07", name: "Ukwa Mine", lat: 21.96, lon: 80.45, type: "Underground (Incline)", capacity: "200,000 t/yr", grade: "37.5% Mn", status: "Active", reserves: "8.3 Mt", depth: "180m" },
  { id: "MINE-08", name: "Gumgaon Mine", lat: 21.41, lon: 79.02, type: "Mechanized Underground", capacity: "180,000 t/yr", grade: "39.5% Mn", status: "Active", reserves: "5.2 Mt", depth: "210m" },
  { id: "MINE-09", name: "Sitasaongi Mine", lat: 21.57, lon: 79.78, type: "Underground", capacity: "160,000 t/yr", grade: "38.0% Mn", status: "Active", reserves: "4.1 Mt", depth: "190m" },
  { id: "MINE-10", name: "Beldongri Mine", lat: 21.35, lon: 79.33, type: "Opencast", capacity: "100,000 t/yr", grade: "34.0% Mn", status: "Active", reserves: "2.8 Mt", depth: "60m" }
]

// Geological Formations (Sausar Group Stratigraphy)
const GEOLOGY_FORMATIONS = [
  {
    id: "GEO-MANSAR",
    name: "Mansar Formation (Ore-Bearing Gondite)",
    rock_type: "Quartz-muscovite schist with Gondite & Bedded Mn-Ore",
    age: "Paleoproterozoic (~1.8 Ga)",
    potential: "Prime Economic Horizon (35% - 48% Mn)",
    color: "#a855f7",
    polygon: [
      [21.80, 79.60], [21.95, 80.00], [22.10, 80.35], [22.05, 80.40], [21.88, 80.05], [21.72, 79.65]
    ]
  },
  {
    id: "GEO-TIRODI",
    name: "Tirodi Biotite Gneiss (Basement Complex)",
    rock_type: "Granitoid gneiss, amphibolite & migmatites",
    age: "Neoarchean-Paleoproterozoic Basement",
    potential: "Host / Basement Rocks (Barren)",
    color: "#64748b",
    polygon: [
      [21.60, 79.40], [21.78, 79.85], [21.90, 80.15], [21.82, 80.25], [21.65, 79.90], [21.50, 79.50]
    ]
  },
  {
    id: "GEO-SITASAONGI",
    name: "Sitasaongi Formation (Basal Clastics)",
    rock_type: "Quartzite, quartz-muscovite schist & feldspathic quartzite",
    age: "Paleoproterozoic",
    potential: "Footwall marker horizon for manganese beds",
    color: "#06b6d4",
    polygon: [
      [21.35, 79.20], [21.50, 79.55], [21.68, 79.90], [21.62, 79.96], [21.42, 79.60], [21.28, 79.25]
    ]
  },
  {
    id: "GEO-LOHANGI",
    name: "Lohangi Formation (Carbonate Horizon)",
    rock_type: "Calcite / Dolomitic Marble & Calc-silicate rocks",
    age: "Paleoproterozoic",
    potential: "Associated with piedmontite & secondary manganese wad",
    color: "#f59e0b",
    polygon: [
      [21.25, 79.10], [21.40, 79.40], [21.55, 79.70], [21.48, 79.76], [21.32, 79.45], [21.18, 79.15]
    ]
  },
  {
    id: "GEO-CHORBAOLI",
    name: "Chorbaoli Formation (Quartzitic Ridge)",
    rock_type: "Micaceous quartzite and quartz-muscovite schist",
    age: "Paleoproterozoic",
    potential: "Hanging-wall structural caprock",
    color: "#3b82f6",
    polygon: [
      [21.95, 79.70], [22.15, 80.10], [22.25, 80.30], [22.20, 80.35], [22.05, 80.15], [21.85, 79.75]
    ]
  }
]

// Exploratory Drill Holes
const DRILL_HOLES = [
  { id: "DH-BAL-101", lat: 22.045, lon: 80.175, depth: 145, mn_grade: 41.2, fe_grade: 6.8, recovery: 98, rock: "Mansar Ore Bed", status: "Mineralized" },
  { id: "DH-BAL-102", lat: 22.055, lon: 80.190, depth: 180, mn_grade: 38.5, fe_grade: 7.4, recovery: 95, rock: "Mansar Gondite", status: "Mineralized" },
  { id: "DH-BAL-103", lat: 22.035, lon: 80.160, depth: 110, mn_grade: 29.4, fe_grade: 9.1, recovery: 92, rock: "Schist Contact", status: "Low Grade" },
  { id: "DH-DNG-201", lat: 21.975, lon: 79.840, depth: 95,  mn_grade: 36.8, fe_grade: 8.0, recovery: 94, rock: "Bedded Braunnite", status: "Mineralized" },
  { id: "DH-DNG-202", lat: 21.990, lon: 79.865, depth: 130, mn_grade: 34.2, fe_grade: 8.5, recovery: 91, rock: "Pyrolusite Horizon", status: "Mineralized" },
  { id: "DH-SIT-301", lat: 21.295, lon: 79.875, depth: 160, mn_grade: 43.1, fe_grade: 5.9, recovery: 97, rock: "High Grade Braunnite", status: "Mineralized" },
  { id: "DH-SIT-302", lat: 21.310, lon: 79.895, depth: 125, mn_grade: 39.7, fe_grade: 6.4, recovery: 96, rock: "Mansar Gondite", status: "Mineralized" },
  { id: "DH-UKW-401", lat: 21.645, lon: 79.615, depth: 115, mn_grade: 32.6, fe_grade: 9.8, recovery: 90, rock: "Gondite / Schist", status: "Mineralized" },
  { id: "DH-UKW-402", lat: 21.660, lon: 79.635, depth: 140, mn_grade: 26.8, fe_grade: 11.2, recovery: 88, rock: "Quartzite Wall", status: "Low Grade" },
  { id: "DH-TIR-501", lat: 21.745, lon: 79.970, depth: 105, mn_grade: 35.0, fe_grade: 8.2, recovery: 93, rock: "Mn-Ore Lens", status: "Mineralized" },
  { id: "DH-TIR-502", lat: 21.760, lon: 79.995, depth: 155, mn_grade: 31.5, fe_grade: 8.9, recovery: 89, rock: "Gneissic Contact", status: "Mineralized" },
  { id: "DH-KAN-601", lat: 21.415, lon: 79.370, depth: 85,  mn_grade: 28.3, fe_grade: 10.4, recovery: 91, rock: "Schist Horizon", status: "Low Grade" },
  { id: "DH-BEL-701", lat: 22.215, lon: 80.045, depth: 90,  mn_grade: 24.8, fe_grade: 12.0, recovery: 86, rock: "Calc-Silicate", status: "Low Grade" },
  { id: "DH-CHK-801", lat: 21.885, lon: 79.140, depth: 110, mn_grade: 27.2, fe_grade: 10.1, recovery: 87, rock: "Mansar Gondite", status: "Low Grade" },
  { id: "DH-MUN-901", lat: 22.135, lon: 79.515, depth: 75,  mn_grade: 18.5, fe_grade: 14.5, recovery: 82, rock: "Barren Schist", status: "Barren" },
  { id: "DH-GUM-001", lat: 21.545, lon: 79.770, depth: 80,  mn_grade: 16.2, fe_grade: 15.0, recovery: 80, rock: "Tirodi Gneiss", status: "Barren" },
]

const EV_COLORS: any = { Strong:'#22c55e', Moderate:'#f59e0b', Low:'#ef4444', Weak:'#94a3b8' }
const PRIOR_COLORS: any = { 'VERY HIGH':'badge-high', HIGH:'badge-medium', MODERATE:'badge-info', LOW:'badge-low' }

function MapBounds({ zones }: { zones: any[] }) {
  const map = useMap()
  useEffect(() => {
    if (zones.length > 0) {
      const bounds = L.latLngBounds(zones.map(z => [z.lat, z.lon] as [number, number]))
      map.fitBounds(bounds, { padding: [60, 60] })
    }
  }, [zones, map])
  return null
}

export default function Exploration() {
  const [zones, setZones] = useState<any[]>(DEMO_ZONES)
  const [selected, setSelected] = useState<any>(null)
  const [selectedType, setSelectedType] = useState<'zone' | 'mine' | 'drill' | 'geo'>('zone')
  const [showLayers, setShowLayers] = useState(true)
  const [layers, setLayers] = useState({ 
    prospectivity: true, 
    geology: true, 
    drillHoles: true, 
    mines: true 
  })

  const [basemap, setBasemap] = useState<'satellite' | 'dark' | 'topo' | 'osm'>('satellite')

  const basemapUrls: Record<string, { url: string; attribution: string; opacity: number }> = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Esri World Imagery • Sentinel-2 L2A Composite',
      opacity: 0.85
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      opacity: 0.8
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'OpenTopoMap • SRTM Elevation Contours',
      opacity: 0.65
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      opacity: 0.6
    }
  }

  useEffect(() => {
    getExplorationZones().then(d => { if (d.zones?.length) setZones(d.zones) }).catch(() => {})
  }, [])

  const handleZoneClick = (zone: any) => {
    setSelectedType('zone')
    getExplorationZone(zone.id).then(setSelected).catch(() => setSelected(zone))
  }

  const handleMineClick = (mine: any) => {
    setSelectedType('mine')
    setSelected(mine)
  }

  const handleDrillClick = (drill: any) => {
    setSelectedType('drill')
    setSelected(drill)
  }

  const handleGeoClick = (geo: any) => {
    setSelectedType('geo')
    setSelected(geo)
  }

  const priorityOrder: any = { 'VERY HIGH': 0, HIGH: 1, MODERATE: 2, LOW: 3 }
  const sorted = [...zones].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)] animate-fade-in">
      {/* Sidebar Controls */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">GIS Geological Explorer</h1>
            <p className="text-xs text-text-muted">Space & Field Prospectivity Mapping</p>
          </div>
          <span className="demo-badge text-xs">LIVE GIS</span>
        </div>

        {/* Layer Toggles Box */}
        <div className="card p-3 space-y-2 border-surface-border">
          <div className="flex items-center justify-between text-xs font-bold text-text-primary mb-1">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-accent-blue" /> GIS Layer Controls</span>
            <button onClick={() => setShowLayers(!showLayers)} className="text-text-muted hover:text-text-primary text-[10px] underline">
              {showLayers ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showLayers && (
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center justify-between p-1.5 rounded hover:bg-surface-muted/50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-accent-orange"></span>
                  <span className="text-text-secondary font-medium">AI Prospectivity Targets</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.prospectivity} 
                  onChange={e => setLayers(prev => ({ ...prev, prospectivity: e.target.checked }))}
                  className="accent-accent-orange w-3.5 h-3.5 cursor-pointer" 
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-surface-muted/50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                  <span className="text-text-secondary font-medium">Sausar Geology Formations</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.geology} 
                  onChange={e => setLayers(prev => ({ ...prev, geology: e.target.checked }))}
                  className="accent-purple-500 w-3.5 h-3.5 cursor-pointer" 
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-surface-muted/50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-green-400 bg-green-500/40"></span>
                  <span className="text-text-secondary font-medium">Exploration Drillholes ({DRILL_HOLES.length})</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.drillHoles} 
                  onChange={e => setLayers(prev => ({ ...prev, drillHoles: e.target.checked }))}
                  className="accent-green-500 w-3.5 h-3.5 cursor-pointer" 
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded hover:bg-surface-muted/50 cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500 flex items-center justify-center text-[8px] font-bold text-black">M</span>
                  <span className="text-text-secondary font-medium">Active MOIL Mines ({MOIL_MINES.length})</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={layers.mines} 
                  onChange={e => setLayers(prev => ({ ...prev, mines: e.target.checked }))}
                  className="accent-orange-500 w-3.5 h-3.5 cursor-pointer" 
                />
              </label>
            </div>
          )}
        </div>

        {/* Target Zone List */}
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-1">
          High-Potential Zones ({sorted.length})
        </div>
        <div className="space-y-2 flex-1">
          {sorted.map(zone => (
            <button key={zone.id} onClick={() => handleZoneClick(zone)}
              className={`card-hover w-full text-left p-3 transition-all ${selected?.id === zone.id && selectedType === 'zone' ? 'border-orange-500/80 bg-surface-muted/60' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{zone.name}</div>
                  <div className="text-xs font-mono text-text-muted">{zone.id}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold" style={{ color: zone.color }}>{zone.prospectivity_score}</div>
                  <div className="text-[10px] text-text-muted">score</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className={PRIOR_COLORS[zone.priority] || 'badge-low'}>{zone.priority}</span>
                <span className="text-xs text-text-muted">{zone.confidence}% conf.</span>
              </div>
              <div className="mt-2 progress-bar">
                <div className="progress-bar-fill" style={{ width: `${zone.prospectivity_score}%`, backgroundColor: zone.color }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main GIS Map */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-surface-border">
        
        {/* Floating Basemap Selector */}
        <div className="absolute top-4 right-4 z-[1000] flex rounded-lg bg-bg-900/90 backdrop-blur-md p-1 border border-surface-border shadow-xl text-xs">
          <button
            onClick={() => setBasemap('satellite')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              basemap === 'satellite' ? 'bg-accent-orange text-black font-bold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setBasemap('dark')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              basemap === 'dark' ? 'bg-accent-blue text-white font-bold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            🗺️ Dark GIS
          </button>
          <button
            onClick={() => setBasemap('topo')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              basemap === 'topo' ? 'bg-purple-600 text-white font-bold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            ⛰️ Topo
          </button>
          <button
            onClick={() => setBasemap('osm')}
            className={`px-2.5 py-1 rounded font-semibold transition-all ${
              basemap === 'osm' ? 'bg-surface-hover text-text-primary font-bold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            🧭 Streets
          </button>
        </div>

        <MapContainer center={[21.75, 79.8]} zoom={9} className="w-full h-full" style={{ background: '#0a0f1d' }}>
          <TileLayer
            key={basemap}
            url={basemapUrls[basemap].url}
            attribution={basemapUrls[basemap].attribution}
            opacity={basemapUrls[basemap].opacity}
          />
          <MapBounds zones={zones} />

          {/* 1. Geology Formations Layer */}
          {layers.geology && GEOLOGY_FORMATIONS.map(geo => (
            <Polygon 
              key={geo.id}
              positions={geo.polygon.map(p => [p[0], p[1]] as [number, number])}
              pathOptions={{ 
                color: geo.color, 
                fillColor: geo.color, 
                fillOpacity: selected?.id === geo.id ? 0.45 : 0.20, 
                weight: selected?.id === geo.id ? 3 : 1.5,
                dashArray: '4, 4'
              }}
              eventHandlers={{ click: () => handleGeoClick(geo) }}
            >
              <Tooltip sticky>
                <div style={{ color: '#0f1629', fontWeight: 600, fontSize: 12 }}>
                  <span style={{ color: geo.color, fontWeight: 'bold' }}>Geology: </span>{geo.name}<br/>
                  <span style={{ fontSize: 10, color: '#475569' }}>{geo.rock_type}</span>
                </div>
              </Tooltip>
            </Polygon>
          ))}

          {/* 2. Prospectivity Target Zones Layer */}
          {layers.prospectivity && zones.map(zone => (
            <Polygon 
              key={zone.id}
              positions={zone.polygon.map((p: number[]) => [p[0], p[1]] as [number, number])}
              pathOptions={{ 
                color: zone.color, 
                fillColor: zone.color, 
                fillOpacity: selected?.id === zone.id ? 0.55 : 0.35, 
                weight: selected?.id === zone.id ? 3 : 2 
              }}
              eventHandlers={{ click: () => handleZoneClick(zone) }}
            >
              <Tooltip sticky>
                <div style={{ color: '#0f1629', fontWeight: 600, fontSize: 12 }}>
                  🎯 {zone.name}<br/>
                  Prospectivity: <strong>{zone.prospectivity_score}%</strong> ({zone.priority})
                </div>
              </Tooltip>
            </Polygon>
          ))}

          {/* 3. Exploratory Drillholes Layer */}
          {layers.drillHoles && DRILL_HOLES.map(dh => {
            const circleColor = dh.mn_grade >= 35 ? '#22c55e' : (dh.mn_grade >= 25 ? '#f59e0b' : '#94a3b8')
            return (
              <CircleMarker
                key={dh.id}
                center={[dh.lat, dh.lon]}
                radius={selected?.id === dh.id ? 8 : 5}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: circleColor,
                  fillOpacity: 0.9,
                  weight: 1.5
                }}
                eventHandlers={{ click: () => handleDrillClick(dh) }}
              >
                <Tooltip direction="top" offset={[0, -5]}>
                  <div style={{ color: '#0f1629', fontSize: 11, fontWeight: 600 }}>
                    <strong>{dh.id}</strong> ({dh.rock})<br/>
                    Mn Grade: <span style={{ color: circleColor }}>{dh.mn_grade}%</span> | Depth: {dh.depth}m
                  </div>
                </Tooltip>
              </CircleMarker>
            )
          })}

          {/* 4. Active MOIL Mines Layer */}
          {layers.mines && MOIL_MINES.map(mine => (
            <Marker
              key={mine.id}
              position={[mine.lat, mine.lon]}
              icon={createMineIcon(mine.status)}
              eventHandlers={{ click: () => handleMineClick(mine) }}
            >
              <Tooltip direction="top" offset={[0, -14]}>
                <div style={{ color: '#0f1629', fontSize: 11, fontWeight: 'bold' }}>
                  ⛏️ {mine.name} ({mine.grade})<br/>
                  <span style={{ fontSize: 10, color: '#475569' }}>Capacity: {mine.capacity}</span>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 card p-3 z-[1000] text-xs space-y-2 max-w-[240px] backdrop-blur-md bg-bg-900/90 border-surface-border">
          <div className="text-text-muted font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-accent-orange" /> GIS Legend</span>
            <span className="text-[10px] text-accent-blue font-mono">MOIL BELT</span>
          </div>
          
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 border border-white flex-shrink-0"></span>
              <span className="text-text-secondary">Active MOIL Mines ({MOIL_MINES.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white flex-shrink-0"></span>
              <span className="text-text-secondary">Drillhole (&gt;35% Mn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white flex-shrink-0"></span>
              <span className="text-text-secondary">Drillhole (25-35% Mn)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-purple-500/60 border border-purple-400 flex-shrink-0"></span>
              <span className="text-text-secondary">Mansar Formation (Ore-Bed)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-red-500/60 border border-red-500 flex-shrink-0"></span>
              <span className="text-text-secondary">High AI Target Zone</span>
            </div>
          </div>
          
          <div className="text-text-muted/70 text-[10px] pt-1.5 border-t border-surface-border leading-tight">
            Multi-spectral Sentinel-2 + Geophysical + UNFC Borehole Integration.
          </div>
        </div>
      </div>

      {/* Dynamic Detail Panel */}
      {selected && (
        <div className="w-80 flex-shrink-0 card overflow-y-auto animate-slide-in space-y-4">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-accent-orange">
                {selectedType === 'zone' && <Target className="w-3.5 h-3.5" />}
                {selectedType === 'mine' && <Pickaxe className="w-3.5 h-3.5" />}
                {selectedType === 'drill' && <Drill className="w-3.5 h-3.5" />}
                {selectedType === 'geo' && <Mountain className="w-3.5 h-3.5" />}
                <span>{selected.id}</span>
              </div>
              <div className="text-sm font-bold text-text-primary mt-0.5">{selected.name}</div>
            </div>
            <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text-primary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ZONE DETAILS */}
          {selectedType === 'zone' && (
            <>
              <div className="flex items-center gap-4 p-3 rounded-lg" style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}30` }}>
                <div className="text-4xl font-black" style={{ color: selected.color }}>{selected.prospectivity_score}</div>
                <div>
                  <div className="text-xs text-text-muted">Prospectivity Score</div>
                  <div className={PRIOR_COLORS[selected.priority] || 'badge-low'}>{selected.priority}</div>
                  <div className="text-xs text-text-muted mt-1">{selected.confidence}% confidence</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Space & Field Evidence
                </div>
                <div className="space-y-1.5">
                  {selected.evidence && Object.entries(selected.evidence).map(([k, v]: any) => (
                    <div key={k} className="flex items-center justify-between text-xs p-1.5 rounded bg-surface-muted/40">
                      <span className="text-text-muted capitalize">{k} Evidence</span>
                      <span className="font-semibold" style={{ color: EV_COLORS[v] || '#94a3b8' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5" /> Feature Importance (ML)
                </div>
                <div className="space-y-2">
                  {selected.feature_importance && Object.entries(selected.feature_importance).map(([k, v]: any) => (
                    <div key={k}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-text-muted capitalize">{k.replace(/_/g,' ')}</span>
                        <span className="text-accent-orange font-mono">{v}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill bg-accent-orange" style={{ width: `${v * 3}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Est. Mn Grade</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.mn_grade_estimate}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Target Area</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.area_km2} km²</div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-accent-orange/20 bg-accent-orange/5">
                <div className="text-xs font-semibold text-accent-orange mb-1">Prescribed Action</div>
                <p className="text-xs text-text-secondary leading-relaxed">{selected.recommendation}</p>
              </div>
            </>
          )}

          {/* MINE DETAILS */}
          {selectedType === 'mine' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">Operational MOIL Mine</div>
                <div className="text-lg font-black text-text-primary mt-1">{selected.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{selected.type}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Avg Mn Grade</div>
                  <div className="font-bold text-green-400 text-sm mt-0.5">{selected.grade}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Capacity</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.capacity}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">UNFC Reserves</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.reserves}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Max Depth</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.depth}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/40 text-xs space-y-1.5">
                <div className="text-text-muted font-medium">Mine Status: <span className="text-green-400 font-bold">{selected.status}</span></div>
                <div className="text-text-muted font-medium">GPS Coordinates: <span className="font-mono text-text-primary">{selected.lat}°N, {selected.lon}°E</span></div>
              </div>
            </div>
          )}

          {/* DRILL HOLE DETAILS */}
          {selectedType === 'drill' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="text-xs text-green-400 font-bold uppercase tracking-wider">Exploration Borehole Core</div>
                <div className="text-lg font-black text-text-primary mt-1">{selected.id}</div>
                <div className="text-xs text-text-muted mt-0.5">{selected.rock}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Mn Assay Grade</div>
                  <div className="font-bold text-green-400 text-sm mt-0.5">{selected.mn_grade}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Fe Impurity Grade</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.fe_grade}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Borehole Depth</div>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selected.depth} meters</div>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-muted text-xs">
                  <div className="text-text-muted">Core Recovery</div>
                  <div className="font-bold text-accent-blue text-sm mt-0.5">{selected.recovery}%</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted/40 text-xs">
                <span className="text-text-muted">Core Assay Status: </span>
                <span className={`font-bold ${selected.status === 'Mineralized' ? 'text-green-400' : 'text-amber-400'}`}>
                  {selected.status}
                </span>
              </div>
            </div>
          )}

          {/* GEOLOGY FORMATION DETAILS */}
          {selectedType === 'geo' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg" style={{ background: `${selected.color}15`, border: `1px solid ${selected.color}40` }}>
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: selected.color }}>Sausar Supergroup Formation</div>
                <div className="text-base font-black text-text-primary mt-1">{selected.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{selected.age}</div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted text-xs space-y-1">
                <div className="text-text-muted font-semibold">Dominant Lithology:</div>
                <div className="text-text-primary">{selected.rock_type}</div>
              </div>

              <div className="p-3 rounded-lg bg-surface-muted text-xs space-y-1">
                <div className="text-text-muted font-semibold">Mineral Potential:</div>
                <div className="font-bold text-accent-orange">{selected.potential}</div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
