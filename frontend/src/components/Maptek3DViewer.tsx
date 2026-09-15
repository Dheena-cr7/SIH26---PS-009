import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { 
  Box, Eye, RotateCw, ZoomIn, ZoomOut, Layers, Filter, 
  Maximize2, Minimize2, Compass, Activity, ShieldAlert, Sparkles, Sliders,
  Mountain, Drill, Pickaxe, Ruler, Sun, Camera, Grid, Crosshair, ChevronRight, HelpCircle
} from 'lucide-react'

interface Maptek3DViewerProps {
  cutoffGrade?: number
  onBlockSelect?: (block: any) => void
}

interface VoxelData {
  id: string
  x: number
  y: number
  z: number
  easting: number
  northing: number
  rl: number
  mn_grade: number
  fe_grade: number
  density: number
  unfc: '111 (Measured)' | '122 (Indicated)' | '333 (Inferred)'
  rock_type: string
  bench: string
}

export default function Maptek3DViewer({ 
  cutoffGrade = 20,
  onBlockSelect 
}: Maptek3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  
  // State for Controls
  const [cutoff, setCutoff] = useState<number>(cutoffGrade)
  const [activeLayer, setActiveLayer] = useState({
    blocks: true,
    wireframe: true,
    isosurface: true,
    pit: true,
    drillholes: true,
    underground: true,
    grid: true,
    haulroad: true,
  })
  
  const [xSlice, setXSlice] = useState<number>(12)
  const [ySlice, setYSlice] = useState<number>(12)
  const [zSlice, setZSlice] = useState<number>(8)
  const [viewMode, setViewMode] = useState<'grade' | 'unfc' | 'lithology' | 'density'>('grade')
  const [activeMenu, setActiveMenu] = useState<'geology' | 'pit' | 'estimation' | 'display'>('geology')
  const [selectedBlock, setSelectedBlock] = useState<VoxelData | null>(null)
  const [hoveredBlock, setHoveredBlock] = useState<VoxelData | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front' | 'side'>('iso')

  // Keep references to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const blockGroupRef = useRef<THREE.Group | null>(null)
  const isoMeshRef = useRef<THREE.Mesh | null>(null)
  const pitGroupRef = useRef<THREE.Group | null>(null)
  const drillGroupRef = useRef<THREE.Group | null>(null)
  const ugGroupRef = useRef<THREE.Group | null>(null)
  const blockMapRef = useRef<Map<THREE.Mesh, VoxelData>>(new Map())

  // Generate High-Density 3D Block Model Grid (12 x 12 x 8 = 1,152 blocks)
  const blockModel = useMemo<VoxelData[]>(() => {
    const data: VoxelData[] = []
    let idCounter = 1001
    const sizeX = 12
    const sizeY = 12
    const sizeZ = 8

    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        for (let z = 0; z < sizeZ; z++) {
          const centerX = 5.5 + Math.sin(y * 0.35) * 2.2
          const centerZ = 3.5 + Math.cos(y * 0.25) * 1.2
          const dist = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2)

          let grade = Math.max(4, 46.5 - dist * 7.8 + Math.sin(x * 1.2 + y * 0.8) * 4)
          if (z >= 6) grade = Math.min(grade, 14) // weathered capping

          let unfc: VoxelData['unfc'] = '333 (Inferred)'
          if (dist < 2.2 && z <= 5) unfc = '111 (Measured)'
          else if (dist < 4.0) unfc = '122 (Indicated)'

          let rock = 'Overburden Phyllite / Schist'
          if (grade >= 38) rock = 'High-Grade Braunnite Lode'
          else if (grade >= 28) rock = 'Mansar Gondite Mn-Ore'
          else if (grade >= 16) rock = 'Sitasaongi Quartz-Muscovite'
          else if (z <= 2) rock = 'Tirodi Biotite Gneiss'

          const rlElevation = 380 - z * 20
          const easting = 450200 + x * 25
          const northing = 2418500 + y * 25

          data.push({
            id: `BM-${idCounter++}`,
            x,
            y,
            z,
            easting,
            northing,
            rl: rlElevation,
            mn_grade: Number(grade.toFixed(1)),
            fe_grade: Number((16.5 - grade * 0.22 + (Math.sin(x) * 1.5)).toFixed(1)),
            density: Number((2.65 + (grade / 45) * 1.65).toFixed(2)),
            unfc,
            rock_type: rock,
            bench: `Bench +${rlElevation}m`
          })
        }
      }
    }
    return data
  }, [])

  // Dynamic In-Situ Reserving & Volumetrics
  const visibleStats = useMemo(() => {
    const visible = blockModel.filter(b => b.mn_grade >= cutoff && b.x <= xSlice && b.y <= ySlice && b.z <= zSlice)
    const wasteBlocks = blockModel.filter(b => b.mn_grade < cutoff && b.x <= xSlice && b.y <= ySlice && b.z <= zSlice)
    
    const blockVolM3 = 25 * 25 * 20
    let oreTonnes = 0
    let wasteTonnes = 0
    let totalGradeTonnes = 0

    visible.forEach(b => {
      const tonnes = blockVolM3 * b.density
      oreTonnes += tonnes
      totalGradeTonnes += tonnes * (b.mn_grade / 100)
    })

    wasteBlocks.forEach(b => {
      wasteTonnes += blockVolM3 * b.density
    })

    const oreMt = oreTonnes / 1_000_000
    const wasteMt = wasteTonnes / 1_000_000
    const containedMnMt = totalGradeTonnes / 1_000_000
    const avgGrade = oreTonnes > 0 ? (totalGradeTonnes / oreTonnes) * 100 : 0
    const stripRatio = oreTonnes > 0 ? (wasteTonnes / oreTonnes) : 0

    return {
      oreMt: Number(oreMt.toFixed(2)),
      wasteMt: Number(wasteMt.toFixed(2)),
      avgGrade: Number(avgGrade.toFixed(1)),
      containedMnMt: Number(containedMnMt.toFixed(2)),
      stripRatio: Number(stripRatio.toFixed(2)),
      blockCount: visible.length,
      totalBlocks: blockModel.length
    }
  }, [blockModel, cutoff, xSlice, ySlice, zSlice])

  // Grade color map (Standard Maptek Vulcan Geostatistical Palette)
  const getGradeColor = (grade: number) => {
    if (grade >= 42) return 0xd946ef // Magenta
    if (grade >= 35) return 0xef4444 // Red
    if (grade >= 28) return 0xf97316 // Orange
    if (grade >= 20) return 0xeab308 // Gold
    if (grade >= 14) return 0x06b6d4 // Cyan
    return 0x334155 // Slate
  }

  const getUnfcColor = (unfc: string) => {
    if (unfc.startsWith('111')) return 0x22c55e
    if (unfc.startsWith('122')) return 0x3b82f6
    return 0xa855f7
  }

  const getDensityColor = (density: number) => {
    if (density >= 3.8) return 0xec4899
    if (density >= 3.4) return 0x8b5cf6
    if (density >= 3.0) return 0x3b82f6
    return 0x64748b
  }

  // Camera presets
  const setCameraView = (preset: 'iso' | 'top' | 'front' | 'side') => {
    setCameraPreset(preset)
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    controls.target.set(6, 3.5, 6)
    if (preset === 'iso') {
      camera.position.set(26, 22, 28)
    } else if (preset === 'top') {
      camera.position.set(6, 42, 6.01)
    } else if (preset === 'front') {
      camera.position.set(6, 3.5, 38)
    } else if (preset === 'side') {
      camera.position.set(38, 3.5, 6)
    }
    controls.update()
  }

  // Initialize Three.js WebGL & OrbitControls
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    sceneRef.current = scene
    scene.background = new THREE.Color(0x060913)
    scene.fog = new THREE.FogExp2(0x060913, 0.012)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    cameraRef.current = camera
    camera.position.set(26, 22, 28)

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement)
    controlsRef.current = controls
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.target.set(6, 3.5, 6)
    controls.maxDistance = 80
    controls.minDistance = 5
    controls.update()

    // Studio Mining Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.5)
    sunLight.position.set(35, 50, 35)
    sunLight.castShadow = true
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7)
    fillLight.position.set(-25, 20, -25)
    scene.add(fillLight)

    // Coordinate Grid
    const grid = new THREE.GridHelper(40, 20, 0xf97316, 0x1e293b)
    grid.position.set(6, -0.2, 6)
    scene.add(grid)

    // Groups
    const blockGroup = new THREE.Group()
    blockGroupRef.current = blockGroup
    scene.add(blockGroup)

    const pitGroup = new THREE.Group()
    pitGroupRef.current = pitGroup
    scene.add(pitGroup)

    const drillGroup = new THREE.Group()
    drillGroupRef.current = drillGroup
    scene.add(drillGroup)

    const ugGroup = new THREE.Group()
    ugGroupRef.current = ugGroup
    scene.add(ugGroup)

    // Pit benches
    for (let bench = 0; bench < 6; bench++) {
      const topRadius = 11.5 - bench * 1.4
      const botRadius = topRadius + 1.2
      const ringGeo = new THREE.CylinderGeometry(topRadius, botRadius, 0.9, 24, 1, true)
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.9,
        metalness: 0.1,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.set(6, 7 - bench * 0.95, 6)
      pitGroup.add(ringMesh)
    }

    // Haul road
    const roadPoints: THREE.Vector3[] = []
    for (let i = 0; i <= 36; i++) {
      const angle = i * 0.28
      const r = 11.5 - i * 0.18
      roadPoints.push(new THREE.Vector3(6 + Math.cos(angle) * r, 7.2 - i * 0.16, 6 + Math.sin(angle) * r))
    }
    const roadCurve = new THREE.CatmullRomCurve3(roadPoints)
    const roadGeo = new THREE.TubeGeometry(roadCurve, 60, 0.22, 6, false)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.5 })
    const roadMesh = new THREE.Mesh(roadGeo, roadMat)
    pitGroup.add(roadMesh)

    // Drillholes
    const drillData = [
      { id: 'DH-BAL-101', x: 3, y: 4, intervals: [{ d: 3, c: 0x64748b }, { d: 4, c: 0xef4444 }, { d: 2, c: 0x3b82f6 }] },
      { id: 'DH-BAL-102', x: 6, y: 6, intervals: [{ d: 2.5, c: 0x64748b }, { d: 5.5, c: 0xd946ef }, { d: 2, c: 0x22c55e }] },
      { id: 'DH-BAL-103', x: 9, y: 5, intervals: [{ d: 4, c: 0x64748b }, { d: 2.5, c: 0xf97316 }, { d: 1.5, c: 0x64748b }] },
      { id: 'DH-BAL-104', x: 5, y: 9, intervals: [{ d: 3, c: 0x64748b }, { d: 4.5, c: 0xef4444 }, { d: 2, c: 0x3b82f6 }] },
      { id: 'DH-BAL-105', x: 8, y: 8, intervals: [{ d: 3.5, c: 0x64748b }, { d: 3, c: 0xf97316 }, { d: 1, c: 0x22c55e }] },
    ]

    drillData.forEach(dh => {
      let currentY = 8
      dh.intervals.forEach((interval) => {
        const cylGeo = new THREE.CylinderGeometry(0.12, 0.12, interval.d, 12)
        const cylMat = new THREE.MeshStandardMaterial({
          color: interval.c,
          emissive: interval.c === 0xd946ef || interval.c === 0xef4444 ? interval.c : 0x000000,
          emissiveIntensity: 0.35,
          roughness: 0.3
        })
        const cylMesh = new THREE.Mesh(cylGeo, cylMat)
        cylMesh.position.set(dh.x, currentY - interval.d / 2, dh.y)
        drillGroup.add(cylMesh)
        currentY -= interval.d
      })

      const collarGeo = new THREE.SphereGeometry(0.3, 12, 12)
      const collarMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
      const collar = new THREE.Mesh(collarGeo, collarMat)
      collar.position.set(dh.x, 8, dh.y)
      drillGroup.add(collar)
    })

    // Underground
    const curvePoints: THREE.Vector3[] = []
    for (let t = 0; t <= 24; t++) {
      const angle = t * 0.45
      const r = 5.2
      curvePoints.push(new THREE.Vector3(6 + Math.cos(angle) * r, 6 - t * 0.28, 6 + Math.sin(angle) * r))
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints)
    const tubeGeo = new THREE.TubeGeometry(curve, 50, 0.3, 8, false)
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 })
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
    ugGroup.add(tubeMesh)

    // Raycast Interaction on click and hover
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      if (blockGroupRef.current) {
        const intersects = raycaster.intersectObjects(blockGroupRef.current.children)
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh
          const block = blockMapRef.current.get(hitMesh)
          if (block) setHoveredBlock(block)
        } else {
          setHoveredBlock(null)
        }
      }
    }

    const onPointerDown = (e: MouseEvent) => {
      if (e.button !== 0) return // Left click only
      const rect = renderer.domElement.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      if (blockGroupRef.current) {
        const intersects = raycaster.intersectObjects(blockGroupRef.current.children)
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as THREE.Mesh
          const block = blockMapRef.current.get(hitMesh)
          if (block) {
            setSelectedBlock(block)
            onBlockSelect?.(block)
          }
        }
      }
    }

    renderer.domElement.addEventListener('mousemove', onPointerMove)
    renderer.domElement.addEventListener('click', onPointerDown)

    // Animation Loop
    let animId: number
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop)
      controls.update()
      renderer.render(scene, camera)
    }
    renderLoop()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      renderer.domElement.removeEventListener('mousemove', onPointerMove)
      renderer.domElement.removeEventListener('click', onPointerDown)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      renderer.dispose()
    }
  }, [])

  // Update Dynamic Meshes on slider / filter changes without recreating WebGL
  useEffect(() => {
    const blockGroup = blockGroupRef.current
    if (!blockGroup) return

    // Clear previous blocks
    while (blockGroup.children.length > 0) {
      const obj = blockGroup.children[0]
      blockGroup.remove(obj)
    }
    blockMapRef.current.clear()

    if (!activeLayer.blocks) return

    const boxGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92)
    const edgesGeo = new THREE.EdgesGeometry(boxGeo)
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 1 })

    blockModel.forEach(b => {
      if (b.mn_grade < cutoff || b.x > xSlice || b.y > ySlice || b.z > zSlice) return

      let colorHex = getGradeColor(b.mn_grade)
      if (viewMode === 'unfc') colorHex = getUnfcColor(b.unfc)
      else if (viewMode === 'density') colorHex = getDensityColor(b.density)

      const isSelected = selectedBlock?.id === b.id
      const mat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffffff : colorHex,
        roughness: 0.25,
        metalness: 0.3,
        emissive: isSelected ? 0xf97316 : 0x000000,
        emissiveIntensity: isSelected ? 0.7 : 0,
      })

      const mesh = new THREE.Mesh(boxGeo, mat)
      mesh.position.set(b.x, (7 - b.z) * 1.1, b.y)
      mesh.castShadow = true
      mesh.receiveShadow = true

      if (activeLayer.wireframe) {
        const wireframe = new THREE.LineSegments(edgesGeo, edgeMat)
        mesh.add(wireframe)
      }

      blockMapRef.current.set(mesh, b)
      blockGroup.add(mesh)
    })

    // Update group visibilities
    if (pitGroupRef.current) pitGroupRef.current.visible = activeLayer.pit
    if (drillGroupRef.current) drillGroupRef.current.visible = activeLayer.drillholes
    if (ugGroupRef.current) ugGroupRef.current.visible = activeLayer.underground

  }, [blockModel, cutoff, xSlice, ySlice, zSlice, activeLayer, viewMode, selectedBlock])

  return (
    <div className={`relative bg-bg-950 rounded-2xl border border-surface-border overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[680px]'}`}>
      
      {/* 1. TOP MAPTEK VULCAN WORKBENCH RIBBON */}
      <div className="bg-bg-900 border-b border-surface-border z-10 flex flex-col">
        
        {/* Upper Menu Tabs */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-surface-border/50 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-accent-orange flex items-center justify-center font-black text-[10px] text-black">
                M
              </div>
              <span className="font-bold text-text-primary tracking-wide">MAPTEK VULCAN 3D MINE SUITE</span>
              <span className="text-[10px] text-text-muted">v2026.1 (SIH Integrated)</span>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              {(['geology', 'pit', 'estimation', 'display'] as const).map(menu => (
                <button
                  key={menu}
                  onClick={() => setActiveMenu(menu)}
                  className={`px-3 py-1 rounded capitalize font-semibold transition-colors ${
                    activeMenu === menu ? 'bg-surface-muted text-accent-orange' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {menu}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-green-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              ORBIT 3D ACTIVE (Drag / Scroll)
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 rounded bg-surface-muted hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-surface-border ml-2"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Maptek 3D Studio'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Lower Tool Ribbon */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-surface-muted/40 gap-3 text-xs">
          
          {/* View Preset Buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mr-1">Camera:</span>
            <button
              onClick={() => setCameraView('iso')}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${
                cameraPreset === 'iso' ? 'bg-accent-orange text-black border-accent-orange font-bold' : 'bg-surface-muted border-surface-border text-text-secondary hover:text-text-primary'
              }`}
            >
              3D ISO
            </button>
            <button
              onClick={() => setCameraView('top')}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${
                cameraPreset === 'top' ? 'bg-accent-orange text-black border-accent-orange font-bold' : 'bg-surface-muted border-surface-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Plan (N)
            </button>
            <button
              onClick={() => setCameraView('front')}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${
                cameraPreset === 'front' ? 'bg-accent-orange text-black border-accent-orange font-bold' : 'bg-surface-muted border-surface-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Long Section
            </button>
            <button
              onClick={() => setCameraView('side')}
              className={`px-2.5 py-1 rounded border text-[11px] font-semibold transition-all ${
                cameraPreset === 'side' ? 'bg-accent-orange text-black border-accent-orange font-bold' : 'bg-surface-muted border-surface-border text-text-secondary hover:text-text-primary'
              }`}
            >
              Cross Section
            </button>
          </div>

          {/* Color Encoding Property */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Property:</span>
            <div className="flex rounded-lg bg-surface-muted p-0.5 border border-surface-border">
              <button
                onClick={() => setViewMode('grade')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${viewMode === 'grade' ? 'bg-accent-orange text-black' : 'text-text-secondary hover:text-text-primary'}`}
              >
                % Mn Grade
              </button>
              <button
                onClick={() => setViewMode('unfc')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${viewMode === 'unfc' ? 'bg-accent-blue text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                UNFC 111/122
              </button>
              <button
                onClick={() => setViewMode('density')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${viewMode === 'density' ? 'bg-purple-600 text-white' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Bulk Density
              </button>
            </div>
          </div>

          {/* Layer Quick Toggles */}
          <div className="flex items-center gap-3 text-[11px]">
            <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={activeLayer.pit}
                onChange={e => setActiveLayer(p => ({ ...p, pit: e.target.checked }))}
                className="accent-accent-orange w-3 h-3"
              />
              <span>Open Pit</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={activeLayer.drillholes}
                onChange={e => setActiveLayer(p => ({ ...p, drillholes: e.target.checked }))}
                className="accent-green-500 w-3 h-3"
              />
              <span>Drillholes</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-text-secondary hover:text-text-primary">
              <input
                type="checkbox"
                checked={activeLayer.underground}
                onChange={e => setActiveLayer(p => ({ ...p, underground: e.target.checked }))}
                className="accent-amber-500 w-3 h-3"
              />
              <span>Underground Stopes</span>
            </label>
          </div>

        </div>
      </div>

      {/* 2. MAIN 3D VIEWPORT */}
      <div className="relative flex-1 w-full h-full min-h-[420px]">
        
        {/* Interactive WebGL Canvas */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* User Interaction Guide Helper */}
        <div className="absolute top-4 left-4 z-10 card p-2 backdrop-blur-md bg-bg-900/80 border-surface-border text-[11px] flex items-center gap-2 text-text-muted pointer-events-none">
          <Compass className="w-3.5 h-3.5 text-accent-orange animate-spin" />
          <span>Left-Click: <strong>Rotate 3D</strong> | Right-Click: <strong>Pan</strong> | Scroll: <strong>Zoom</strong> | Click: <strong>Inspect Voxel</strong></span>
        </div>

        {/* Top-Right 3D Slicing & Reserving Slider Panel */}
        <div className="absolute top-14 right-4 z-10 card p-3.5 max-w-[260px] backdrop-blur-md bg-bg-900/90 border-surface-border shadow-2xl text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-text-primary border-b border-surface-border pb-1.5">
            <span className="flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-accent-orange" /> Dynamic Reserving</span>
            <span className="text-[10px] text-accent-orange font-mono">LIVE SLICER</span>
          </div>

          {/* Economic Cutoff Grade */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Cutoff Grade:</span>
              <span className="font-mono font-bold text-accent-orange">{cutoff}% Mn</span>
            </div>
            <input
              type="range"
              min="5"
              max="42"
              step="1"
              value={cutoff}
              onChange={e => setCutoff(Number(e.target.value))}
              className="w-full accent-accent-orange cursor-pointer h-1.5 bg-surface-border rounded-lg"
            />
          </div>

          {/* Cross Section Longitudinal Slicing */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Easting Slice (X):</span>
              <span className="font-mono text-text-primary">{xSlice} / 12</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={xSlice}
              onChange={e => setXSlice(Number(e.target.value))}
              className="w-full accent-accent-blue cursor-pointer h-1.5 bg-surface-border rounded-lg"
            />
          </div>

          {/* Elevation Bench Level Slicing */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-text-secondary">Bench Level (Z):</span>
              <span className="font-mono text-text-primary">RL +{380 - zSlice * 20}m</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={zSlice}
              onChange={e => setZSlice(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-surface-border rounded-lg"
            />
          </div>
        </div>

        {/* Bottom-Left Live Reserving & Volumetrics HUD */}
        <div className="absolute bottom-4 left-4 z-10 card p-4 max-w-[300px] backdrop-blur-md bg-bg-900/90 border-surface-border shadow-2xl text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-text-primary border-b border-surface-border pb-1.5">
            <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-green-400" /> In-Situ Geological Reserve</span>
            <span className="text-[10px] font-mono text-green-400 font-bold">UNFC AUDITED</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-surface-muted/60 border border-surface-border/50">
              <div className="text-[10px] text-text-muted">Ore Potential</div>
              <div className="text-lg font-black text-text-primary">{visibleStats.oreMt} <span className="text-xs font-normal text-text-muted">Mt</span></div>
            </div>
            <div className="p-2 rounded bg-surface-muted/60 border border-surface-border/50">
              <div className="text-[10px] text-text-muted">Average Grade</div>
              <div className="text-lg font-black text-accent-orange">{visibleStats.avgGrade}% <span className="text-xs font-normal text-text-muted">Mn</span></div>
            </div>
          </div>

          <div className="space-y-1 text-[11px] pt-1">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Contained Mn Metal:</span>
              <span className="font-bold text-green-400 font-mono">{visibleStats.containedMnMt} Mt</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Stripping Ratio (W:O):</span>
              <span className="font-mono text-text-primary">{visibleStats.stripRatio} : 1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Filtered Blocks:</span>
              <span className="font-mono text-text-secondary">{visibleStats.blockCount} / {visibleStats.totalBlocks} blocks</span>
            </div>
          </div>
        </div>

        {/* Bottom-Right Interactive Block Inspector */}
        {(hoveredBlock || selectedBlock) && (
          <div className="absolute bottom-4 right-4 z-10 card p-4 max-w-[280px] backdrop-blur-md bg-bg-900/95 border-accent-orange/40 shadow-2xl text-xs space-y-2.5 animate-slide-in">
            <div className="flex items-center justify-between font-bold text-text-primary">
              <span className="text-accent-orange font-mono font-black text-sm">{(hoveredBlock || selectedBlock)?.id}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-muted text-text-secondary font-bold">
                {(hoveredBlock || selectedBlock)?.unfc.split(' ')[0]}
              </span>
            </div>

            <div className="text-[11px] text-text-secondary font-medium">
              {(hoveredBlock || selectedBlock)?.rock_type}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-surface-muted">
                <span className="text-text-muted text-[10px]">Mn Assay:</span>
                <div className="font-black text-green-400 text-base">{(hoveredBlock || selectedBlock)?.mn_grade}%</div>
              </div>
              <div className="p-2 rounded bg-surface-muted">
                <span className="text-text-muted text-[10px]">Fe Impurity:</span>
                <div className="font-bold text-text-primary text-base">{(hoveredBlock || selectedBlock)?.fe_grade}%</div>
              </div>
            </div>

            <div className="text-[10px] text-text-muted space-y-1 pt-1 border-t border-surface-border">
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span className="font-mono text-text-primary">{(hoveredBlock || selectedBlock)?.easting}m E, {(hoveredBlock || selectedBlock)?.northing}m N</span>
              </div>
              <div className="flex justify-between">
                <span>Elevation:</span>
                <span className="font-mono text-text-primary">{(hoveredBlock || selectedBlock)?.bench}</span>
              </div>
              <div className="flex justify-between">
                <span>Bulk Density:</span>
                <span className="font-mono text-text-primary">{(hoveredBlock || selectedBlock)?.density} t/m³</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
