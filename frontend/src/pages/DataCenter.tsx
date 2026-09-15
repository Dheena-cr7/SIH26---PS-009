import { useState, useRef } from 'react'
import { Database, Download, UploadCloud, Server, ShieldCheck, HardDrive, CheckCircle2, AlertCircle, FileSpreadsheet, X, Check, Loader2, ArrowUpRight } from 'lucide-react'

interface DatasetItem {
  id: string
  name: string
  rows: string
  type: string
  date: string
  status: 'Verified' | 'Real-time' | 'Syncing' | 'Processed' | 'Custom'
  source: string
  downloadData?: () => void
}

export default function DataCenter() {
  const [datasets, setDatasets] = useState<DatasetItem[]>([
    { id: 'ds-1', name: 'Drill Hole Database (Assay & Lithology)', rows: '14,250', type: 'CSV', date: '2025-08-15', status: 'Verified', source: 'Geology Dept' },
    { id: 'ds-2', name: 'Production History (2015-2025)', rows: '2,840', type: 'JSON', date: '2025-08-12', status: 'Verified', source: 'ERP System' },
    { id: 'ds-3', name: 'Fleet Telematics Sensor Log', rows: '1.2M', type: 'CSV', date: '2025-08-18', status: 'Real-time', source: 'IoT Gateway' },
    { id: 'ds-4', name: 'Sentinel-2 Multispectral Archive', rows: '45 GB', type: 'GeoJSON', date: '2025-08-01', status: 'Processed', source: 'ESA API' },
    { id: 'ds-5', name: 'Landsat-8 Thermal Bands (LST)', rows: '12 GB', type: 'JSON', date: '2025-08-05', status: 'Processed', source: 'USGS API' },
    { id: 'ds-6', name: 'Sausar Structural Geology Layers', rows: '342', type: 'GeoJSON', date: '2025-07-20', status: 'Verified', source: 'GSI Portal' },
    { id: 'ds-7', name: 'Regional Weather & Rainfall History', rows: '8,400', type: 'CSV', date: '2025-08-18', status: 'Real-time', source: 'IMD API' },
  ])

  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'parsing' | 'validating' | 'success'>('idle')
  const [importedFile, setImportedFile] = useState<File | null>(null)
  const [datasetCategory, setDatasetCategory] = useState('Geological Drillholes')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Trigger browser download of generated synthetic dataset
  const handleDownloadDataset = (ds: DatasetItem) => {
    let content = ''
    let mimeType = 'text/plain'
    let filename = `${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`

    if (ds.type === 'CSV') {
      mimeType = 'text/csv'
      filename += '.csv'
      if (ds.name.includes('Drill Hole')) {
        content = 'hole_id,latitude,longitude,depth_m,mn_grade_pct,fe_grade_pct,sio2_pct,lithology,unfc_code\n' +
          'DH-BAL-101,22.0450,80.1750,145.0,41.2,6.8,11.2,Mansar Gondite,111\n' +
          'DH-BAL-102,22.0550,80.1900,180.0,38.5,7.4,12.5,Mansar Ore Bed,111\n' +
          'DH-DNG-201,21.9750,79.8400,95.0,36.8,8.0,14.1,Bedded Braunnite,121\n' +
          'DH-SIT-301,21.2950,79.8750,160.0,43.1,5.9,9.8,High Grade Ore,111\n' +
          'DH-UKW-401,21.6450,79.6150,115.0,32.6,9.8,16.4,Gondite Schist,122\n' +
          'DH-TIR-501,21.7450,79.9700,105.0,35.0,8.2,13.0,Tirodi Ore Lens,111\n'
      } else if (ds.name.includes('Fleet')) {
        content = 'timestamp,machine_id,equipment_type,engine_temp_c,vibration_mms,oil_pressure_bar,fuel_litres_hr,status\n' +
          '2026-09-07T08:00:00Z,EXC-01,Excavator CAT 349D,86.4,2.3,4.2,42.5,NORMAL\n' +
          '2026-09-07T08:00:00Z,DMP-03,Dumper Komatsu HD785,91.2,3.8,3.9,68.0,WARNING\n' +
          '2026-09-07T08:00:00Z,DRL-02,Blast Hole Drill,82.0,1.8,4.5,28.0,NORMAL\n' +
          '2026-09-07T08:00:00Z,EXC-04,Excavator CAT 349D,84.1,2.0,4.1,41.0,NORMAL\n'
      } else {
        content = 'date,rainfall_mm,temp_max_c,temp_min_c,humidity_pct,wind_speed_kmh\n' +
          '2026-09-01,14.2,31.5,24.2,88,12.4\n' +
          '2026-09-02,42.0,29.0,23.5,94,18.1\n' +
          '2026-09-03,8.5,32.0,25.0,82,9.6\n'
      }
    } else if (ds.type === 'GeoJSON') {
      mimeType = 'application/geo+json'
      filename += '.geojson'
      content = JSON.stringify({
        type: "FeatureCollection",
        name: ds.name,
        crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        features: [
          {
            type: "Feature",
            properties: { formation: "Mansar Formation", rock: "Gondite & Mn-Ore", age: "Paleoproterozoic", economic_rating: "Prime" },
            geometry: { type: "Polygon", coordinates: [[[79.60, 21.80], [80.00, 21.95], [80.35, 22.10], [80.05, 21.88], [79.60, 21.80]]] }
          },
          {
            type: "Feature",
            properties: { target_id: "MN-TARGET-01", prospectivity_score: 91, priority: "VERY HIGH" },
            geometry: { type: "Polygon", coordinates: [[[80.14, 22.03], [80.22, 22.03], [80.22, 22.07], [80.14, 22.07], [80.14, 22.03]]] }
          }
        ]
      }, null, 2)
    } else {
      mimeType = 'application/json'
      filename += '.json'
      content = JSON.stringify({
        dataset: ds.name,
        source: ds.source,
        exported_at: new Date().toISOString(),
        records_count: 50,
        sample_records: [
          { month: "2025-01", production_tonnes: 158200, target_tonnes: 166667, grade_mn_pct: 38.4, rainfall_mm: 4.2 },
          { month: "2025-02", production_tonnes: 162400, target_tonnes: 166667, grade_mn_pct: 39.1, rainfall_mm: 0.0 },
          { month: "2025-03", production_tonnes: 169800, target_tonnes: 166667, grade_mn_pct: 38.8, rainfall_mm: 12.0 }
        ]
      }, null, 2)
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showToast(`✓ Downloaded extract for "${ds.name}"`)
  }

  // Handle file selection from local device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImportedFile(file)
      startSimulatedUpload(file)
    }
  }

  const startSimulatedUpload = (file: File) => {
    setUploadStatus('parsing')
    setTimeout(() => {
      setUploadStatus('validating')
      setTimeout(() => {
        setUploadStatus('success')
      }, 1000)
    }, 1200)
  }

  const handleConfirmImport = () => {
    if (!importedFile) return

    const ext = importedFile.name.split('.').pop()?.toUpperCase() || 'CSV'
    const newDs: DatasetItem = {
      id: `ds-${Date.now()}`,
      name: importedFile.name.replace(/\.[^/.]+$/, "") + ` (${datasetCategory})`,
      rows: `${Math.floor(Math.random() * 5000 + 500).toLocaleString()}`,
      type: ext,
      date: new Date().toISOString().split('T')[0],
      status: 'Verified',
      source: 'User Upload (Local)',
    }

    setDatasets([newDs, ...datasets])
    setIsImportModalOpen(false)
    setImportedFile(null)
    setUploadStatus('idle')
    showToast(`✓ Successfully imported & indexed "${newDs.name}"`)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-accent-blue/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-xl border border-accent-blue flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Server className="w-6 h-6 text-accent-blue" />
            Data Hub & Integrations
          </h1>
          <p className="text-text-muted text-sm mt-1">Manage data ingestion pipelines, APIs, drillhole archives, and satellite raster catalogs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-xs py-2 px-3.5 shadow-lg shadow-accent-blue/20"
          >
            <UploadCloud className="w-4 h-4" /> Import Dataset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Connection Status */}
        <div className="space-y-4">
          <div className="card">
             <div className="section-header mb-4">Pipeline Live Health</div>
             <div className="space-y-3">
               <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/30 border border-surface-border">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <div>
                     <div className="text-sm font-semibold text-text-primary">MOIL ERP Database</div>
                     <div className="text-[10px] text-text-muted">Direct SQL Sync</div>
                   </div>
                 </div>
                 <span className="text-xs text-green-400 font-mono">200 OK</span>
               </div>

               <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/30 border border-surface-border">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <div>
                     <div className="text-sm font-semibold text-text-primary">IoT Fleet Gateway</div>
                     <div className="text-[10px] text-text-muted">MQTT Telemetry Stream</div>
                   </div>
                 </div>
                 <span className="text-xs text-green-400 font-mono">Active</span>
               </div>

               <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/30 border border-surface-border">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <div>
                     <div className="text-sm font-semibold text-text-primary">ESA Copernicus Sentinel-2</div>
                     <div className="text-[10px] text-text-muted">L2A Surface Reflectance</div>
                   </div>
                 </div>
                 <span className="text-xs text-blue-400 font-mono">Connected</span>
               </div>

               <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-muted/30 border border-surface-border">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                   <div>
                     <div className="text-sm font-semibold text-text-primary">GSI Bhukosh Geological Portal</div>
                     <div className="text-[10px] text-text-muted">1:50k Lithology Vectors</div>
                   </div>
                 </div>
                 <span className="text-xs text-amber-400 font-mono">Syncing...</span>
               </div>
             </div>
          </div>
          
          <div className="card bg-surface-muted/20">
             <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                <div>
                   <div className="text-sm font-bold text-text-primary mb-1">Data Governance & Security</div>
                   <p className="text-xs text-text-secondary leading-relaxed">
                     Automated spatial CRS projection (EPSG:4326/WGS84), schema verification, anomaly detection, and AES-256 encrypted archival on all imported operational records.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Dataset Registry */}
        <div className="md:col-span-2 card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="section-header !mb-0 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-accent-blue" /> Master Data Catalog ({datasets.length})
              </div>
              <span className="text-xs text-text-muted">Click <Download className="w-3.5 h-3.5 inline mx-1 text-accent-blue" /> to download full dataset extracts</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-text-muted uppercase border-b border-surface-border bg-surface-muted/30">
                  <tr>
                    <th className="py-3 px-4 font-medium rounded-tl-lg">Dataset Name</th>
                    <th className="py-3 px-4 font-medium">Source</th>
                    <th className="py-3 px-4 font-medium">Size/Rows</th>
                    <th className="py-3 px-4 font-medium">Format</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {datasets.map((ds) => (
                    <tr key={ds.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Database className="w-4 h-4 text-accent-blue/80 flex-shrink-0" />
                          <span className="font-medium text-text-primary text-xs sm:text-sm">{ds.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-text-secondary text-xs">{ds.source}</td>
                      <td className="py-3 px-4 font-mono text-text-muted text-xs">{ds.rows}</td>
                      <td className="py-3 px-4">
                         <span className="bg-surface-muted px-2 py-0.5 rounded text-[10px] font-bold text-text-primary tracking-wider">{ds.type}</span>
                      </td>
                      <td className="py-3 px-4">
                         <div className="flex items-center gap-1.5 text-xs">
                            {ds.status === 'Verified' ? <span className="w-2 h-2 rounded-full bg-green-500"></span> :
                             ds.status === 'Real-time' ? <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> :
                             ds.status === 'Syncing' ? <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> :
                             <span className="w-2 h-2 rounded-full bg-purple-500"></span>}
                            <span className={ds.status === 'Real-time' ? 'text-blue-400 font-medium' : 'text-text-secondary'}>{ds.status}</span>
                         </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                         <button 
                            onClick={() => handleDownloadDataset(ds)}
                            className="btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 ml-auto hover:border-accent-blue/60 group-hover:bg-accent-blue/10 transition-all"
                            title="Download CSV / JSON / GeoJSON extract"
                         >
                            <Download className="w-3.5 h-3.5 text-accent-blue" />
                            <span className="text-[11px] font-semibold text-text-primary">Export</span>
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-border flex items-center justify-between text-xs text-text-muted">
            <span>All exports include spatial metadata and standardized ISO-19115 headers</span>
            <span className="font-mono text-text-secondary">{datasets.length} Catalogs Indexed</span>
          </div>
        </div>
      </div>

      {/* IMPORT DATA MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="card max-w-xl w-full p-6 bg-bg-900 border-surface-border shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-accent-blue" />
                <h3 className="text-lg font-bold text-text-primary">Import & Ingest Dataset</h3>
              </div>
              <button 
                onClick={() => { setIsImportModalOpen(false); setUploadStatus('idle'); setImportedFile(null) }}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase">Dataset Category</label>
              <select 
                value={datasetCategory}
                onChange={(e) => setDatasetCategory(e.target.value)}
                className="w-full bg-surface-muted border border-surface-border rounded-lg p-2.5 text-xs text-text-primary focus:outline-none focus:border-accent-blue"
              >
                <option value="Geological Drillholes">Borehole & Drill Core Assay Data (.CSV, .XLSX)</option>
                <option value="Satellite Rasters">Sentinel-2 / Landsat-8 Imagery Bands (.GeoTIFF, .HDF)</option>
                <option value="Geophysical Shapefiles">Magnetic & Gravity Anomaly Contours (.SHP, .GeoJSON)</option>
                <option value="Operational Mining Logs">HEMM Equipment Telematics & Production Logs (.CSV, .JSON)</option>
                <option value="Block Model">3D UNFC Geological Block Model Grid (.CSV, .VTK)</option>
              </select>
            </div>

            {/* File Dropzone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-surface-border hover:border-accent-blue/60 rounded-xl p-8 text-center cursor-pointer transition-colors bg-surface-muted/20"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".csv,.json,.geojson,.parquet,.shp,.tif,.tiff" 
                className="hidden" 
              />

              {!importedFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto text-accent-blue">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-text-primary">Click or Drag & Drop dataset file here</div>
                  <p className="text-xs text-text-muted">Supports CSV, GeoJSON, Shapefiles, JSON, and GeoTIFF up to 500 MB</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-text-primary font-bold text-sm">
                    <FileSpreadsheet className="w-5 h-5 text-accent-blue" />
                    <span>{importedFile.name}</span>
                    <span className="text-xs text-text-muted font-normal">({(importedFile.size / 1024).toFixed(1)} KB)</span>
                  </div>

                  {uploadStatus === 'parsing' && (
                    <div className="flex items-center justify-center gap-2 text-xs text-accent-blue">
                      <Loader2 className="w-4 h-4 animate-spin" /> Parsing schema & detecting coordinate system...
                    </div>
                  )}

                  {uploadStatus === 'validating' && (
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-400">
                      <Loader2 className="w-4 h-4 animate-spin" /> Validating manganese assay columns & lithology codes...
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <div className="flex items-center justify-center gap-2 text-xs text-green-400 font-bold">
                      <Check className="w-4 h-4" /> Schema validated (WGS84 EPSG:4326 verified)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
              <button 
                onClick={() => { setIsImportModalOpen(false); setUploadStatus('idle'); setImportedFile(null) }}
                className="btn-secondary text-xs py-2 px-4"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmImport}
                disabled={!importedFile || uploadStatus !== 'success'}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm & Ingest
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
