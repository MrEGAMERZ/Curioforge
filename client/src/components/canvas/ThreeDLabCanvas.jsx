import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Misc';
import { Play, RotateCcw, Box, Sparkles, Eye, Maximize2 } from 'lucide-react';

export function ThreeDLabCanvas({
  type = 'volcano_reaction',
  title = 'Interactive 3D Living Lab',
  promptQuestion = 'What happens in 3D when pressure builds?',
}) {
  const mountRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderVal, setSliderVal] = useState(2);
  const [cameraAngle, setCameraAngle] = useState({ x: 0.3, y: 0.5 });
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameRef = useRef(null);
  const particlesMeshRef = useRef(null);
  const particleDataRef = useRef([]);

  // Synthesize soft bubble/magma sounds using Web Audio API
  const playSfx = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500 + Math.random() * 200, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = 260;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x080c16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 3.5, 7.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6ea0ff, 2, 20);
    pointLight.position.set(3, 6, 4);
    scene.add(pointLight);

    const magmaLight = new THREE.PointLight(0xff5533, 3, 10);
    magmaLight.position.set(0, 1.2, 0);
    scene.add(magmaLight);

    // 3. Build 3D Models based on type
    let mainGroup = new THREE.Group();
    scene.add(mainGroup);

    if (type === 'volcano_reaction' || type === 'custom_canvas') {
      // 3D Volcano Cone
      const coneGeo = new THREE.CylinderGeometry(0.8, 2.5, 2.2, 32, 1, true);
      const coneMat = new THREE.MeshStandardMaterial({
        color: 0x1f2b48,
        roughness: 0.85,
        wireframe: false,
        side: THREE.DoubleSide,
      });
      const volcanoMesh = new THREE.Mesh(coneGeo, coneMat);
      volcanoMesh.position.y = 1.1;
      mainGroup.add(volcanoMesh);

      // Magma Pool inside crater
      const poolGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.2, 32);
      const poolMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
      const poolMesh = new THREE.Mesh(poolGeo, poolMat);
      poolMesh.position.y = 2.1;
      mainGroup.add(poolMesh);

      // Island Base
      const baseGeo = new THREE.CylinderGeometry(2.7, 3.0, 0.3, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x131b2e, roughness: 0.9 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0;
      mainGroup.add(baseMesh);

      // Particle System for 3D eruption bubbles
      const particleCount = 200;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      const pData = [];
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.6;
        positions[i * 3 + 1] = 2.1;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;

        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = Math.random() * 0.6 + 0.2;
        colors[i * 3 + 2] = 0.1;

        pData.push({
          vx: (Math.random() - 0.5) * 0.04,
          vy: Math.random() * 0.08 + 0.03,
          vz: (Math.random() - 0.5) * 0.04,
          alive: false,
          life: 0,
        });
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      const pMesh = new THREE.Points(particleGeo, particleMat);
      mainGroup.add(pMesh);
      particlesMeshRef.current = pMesh;
      particleDataRef.current = pData;
    } else {
      // 3D Solar System / Planetary Orbit
      const sunGeo = new THREE.SphereGeometry(1.0, 32, 32);
      const sunMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.6,
      });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      mainGroup.add(sunMesh);

      // Planet Orbit ring
      const ringGeo = new THREE.RingGeometry(2.4, 2.45, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x4b5563, side: THREE.DoubleSide });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      mainGroup.add(ringMesh);

      // Planet Earth
      const planetGeo = new THREE.SphereGeometry(0.35, 24, 24);
      const planetMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.position.set(2.4, 0, 0);
      mainGroup.add(planetMesh);
    }

    // 4. Render / Animation Loop
    let angle = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Auto rotation
      if (!isDraggingRef.current) {
        mainGroup.rotation.y += 0.005;
      }

      // Eruption particle animation
      if (particlesMeshRef.current && particleDataRef.current.length > 0) {
        const positions = particlesMeshRef.current.geometry.attributes.position.array;
        const pData = particleDataRef.current;

        for (let i = 0; i < pData.length; i++) {
          const p = pData[i];
          if (p.alive) {
            positions[i * 3] += p.vx * (sliderVal * 0.8);
            positions[i * 3 + 1] += p.vy * (sliderVal * 0.8);
            positions[i * 3 + 2] += p.vz * (sliderVal * 0.8);
            p.vy -= 0.0015; // 3D gravity
            p.life -= 0.015;

            if (p.life <= 0 || positions[i * 3 + 1] < 0) {
              p.alive = false;
            }
          } else if (isPlaying) {
            // Respawn
            p.alive = true;
            p.life = 1.0;
            positions[i * 3] = (Math.random() - 0.5) * 0.5;
            positions[i * 3 + 1] = 2.1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
            p.vx = (Math.random() - 0.5) * (sliderVal * 0.025);
            p.vy = Math.random() * 0.06 + sliderVal * 0.02;
            p.vz = (Math.random() - 0.5) * (sliderVal * 0.025);

            if (Math.random() > 0.9) playSfx();
          }
        }
        particlesMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || 400;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, isPlaying, sliderVal]);

  // Mouse drag 3D Orbit controls
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !sceneRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };

    const mainGroup = sceneRef.current.children.find((c) => c instanceof THREE.Group);
    if (mainGroup) {
      mainGroup.rotation.y += deltaX * 0.008;
      mainGroup.rotation.x += deltaY * 0.008;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTrigger = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 4500);
  };

  return (
    <Card className="overflow-hidden border-primary-500/40 bg-surface/90 backdrop-blur-md shadow-elevated">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line-subtle mb-3">
        <div className="flex items-center gap-2">
          <Badge tone="purple" icon={<Box className="w-3.5 h-3.5" />}>
            Interactive 3D Lab
          </Badge>
          <h3 className="font-bold text-ink-primary text-sm font-display">{title}</h3>
        </div>
        <span className="text-[11px] text-primary-400 font-medium flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Click & Drag to Rotate 360°</span>
        </span>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[260px] rounded-xl overflow-hidden bg-bg-deep cursor-grab active:cursor-grabbing border border-line-subtle relative select-none"
      />

      {/* 3D Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold text-ink-secondary">
            {type === 'volcano_reaction' ? 'Reaction Energy:' : 'Intensity:'}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
            className="w-28 accent-primary-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-primary-400 font-bold">{sliderVal}x Speed</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTrigger}
            disabled={isPlaying}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-glow transition-all active:scale-95 ${
              isPlaying
                ? 'bg-danger shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : 'bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-500 hover:to-accent-400'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying ? 'Reacting in 3D...' : 'Pour & Trigger 3D!'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (sceneRef.current) {
                const group = sceneRef.current.children.find((c) => c instanceof THREE.Group);
                if (group) {
                  group.rotation.set(0, 0, 0);
                }
              }
            }}
            className="p-2 text-ink-muted hover:text-ink-primary bg-surface-raised border border-line-subtle rounded-xl text-xs"
            title="Reset 3D camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
}