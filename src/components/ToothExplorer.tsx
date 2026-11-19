import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ArrowRight, ArrowUpRight, Rotate3D } from 'lucide-react';

type ToothPart = 'email' | 'dentine' | 'pulpe' | 'racines';
const anatomy: { id: ToothPart; title: string; color: string; description: string }[] = [
  { id: 'email', title: 'Émail', color: '#f6ead0', description: 'La couche externe visible qui recouvre la couronne.' },
  { id: 'dentine', title: 'Dentine', color: '#d7a249', description: 'Le tissu situé sous l’émail et autour de la pulpe.' },
  { id: 'pulpe', title: 'Pulpe', color: '#cc7359', description: 'La partie centrale de la dent, représentée ici en coupe.' },
  { id: 'racines', title: 'Racines', color: '#7caa9d', description: 'La partie de la dent située sous la couronne.' },
];

function makeToothShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(-0.88, 0.66);
  shape.bezierCurveTo(-0.98, 0.89, -0.76, 1.05, -0.52, 0.98);
  shape.bezierCurveTo(-0.29, 0.91, -0.17, 0.82, 0.01, 0.94);
  shape.bezierCurveTo(0.24, 1.08, 0.53, 1.05, 0.72, 0.87);
  shape.bezierCurveTo(0.97, 0.66, 1.00, 0.40, 0.90, 0.12);
  shape.bezierCurveTo(0.83, -0.04, 0.63, -0.14, 0.39, -0.18);
  shape.bezierCurveTo(0.38, -0.47, 0.47, -0.94, 0.28, -1.31);
  shape.bezierCurveTo(0.18, -1.51, 0.02, -1.49, -0.07, -1.28);
  shape.bezierCurveTo(-0.17, -1.02, -0.19, -0.64, -0.29, -0.34);
  shape.bezierCurveTo(-0.43, -0.34, -0.49, -0.55, -0.54, -0.89);
  shape.bezierCurveTo(-0.60, -1.25, -0.67, -1.47, -0.83, -1.41);
  shape.bezierCurveTo(-1.00, -1.34, -0.96, -0.92, -0.94, -0.61);
  shape.bezierCurveTo(-0.92, -0.34, -1.02, -0.13, -1.06, 0.14);
  shape.bezierCurveTo(-1.11, 0.38, -1.04, 0.56, -0.88, 0.66);
  shape.closePath();
  return shape;
}

function extrude(shape: THREE.Shape, depth: number, bevelSize = 0.018) {
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, steps: 1, bevelEnabled: true, bevelSegments: 3, bevelThickness: bevelSize, bevelSize, curveSegments: 28 });
  geometry.computeVertexNormals();
  return geometry;
}

function addPart(group: THREE.Group, shape: THREE.Shape, material: THREE.MeshPhysicalMaterial, part: ToothPart, z: number, depth: number, isShell = false) {
  const mesh = new THREE.Mesh(extrude(shape, depth), material);
  mesh.position.z = z;
  mesh.userData.anatomyPart = part;
  mesh.userData.isShell = isShell;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCanal(group: THREE.Group, points: THREE.Vector3[], part: ToothPart) {
  const curve = new THREE.CatmullRomCurve3(points);
  const material = new THREE.MeshPhysicalMaterial({ color: '#c96f59', roughness: 0.34, clearcoat: 0.28, emissive: '#6d3022', emissiveIntensity: 0.06 });
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.047, 10, false), material);
  mesh.userData.anatomyPart = part;
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

export default function ToothExplorer() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ToothPart>('dentine');
  const [cutaway, setCutaway] = useState(false);
  const activeRef = useRef(active);
  const cutawayRef = useRef(cutaway);
  useEffect(() => { activeRef.current = active; }, [active]);
  useEffect(() => { cutawayRef.current = cutaway; }, [cutaway]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 80);
    camera.position.set(0.05, -0.02, 5.8);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label', 'Dent en trois dimensions. Faites-la glisser pour la faire tourner.');
    host.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight('#fff8e9', '#708d82', 2.05);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight('#fff8e6', 3.8);
    keyLight.position.set(-3.4, 4.5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.PointLight('#7fc0aa', 1.7, 12);
    fillLight.position.set(3.4, 0.3, 3.2);
    scene.add(fillLight);

    const toothGroup = new THREE.Group();
    scene.add(toothGroup);
    const enamelMaterial = new THREE.MeshPhysicalMaterial({ color: '#f6ead0', roughness: 0.24, metalness: 0.01, clearcoat: 0.68, clearcoatRoughness: 0.19, emissive: '#21443b', emissiveIntensity: 0 });
    const dentinMaterial = new THREE.MeshPhysicalMaterial({ color: '#d7a249', roughness: 0.34, metalness: 0.01, clearcoat: 0.24, emissive: '#563b19', emissiveIntensity: 0 });
    const pulpMaterial = new THREE.MeshPhysicalMaterial({ color: '#cc7359', roughness: 0.37, clearcoat: 0.22, emissive: '#703522', emissiveIntensity: 0 });
    const rootMaterial = new THREE.MeshPhysicalMaterial({ color: '#7caa9d', roughness: 0.29, clearcoat: 0.25, emissive: '#164f43', emissiveIntensity: 0 });

    addPart(toothGroup, makeToothShape(), enamelMaterial, 'email', -0.18, 0.36, true);

    const dentin = new THREE.Shape();
    dentin.moveTo(0.03, 0.70);
    dentin.bezierCurveTo(0.22, 0.83, 0.49, 0.87, 0.70, 0.71);
    dentin.bezierCurveTo(0.84, 0.59, 0.86, 0.38, 0.78, 0.17);
    dentin.bezierCurveTo(0.69, -0.02, 0.49, -0.10, 0.27, -0.15);
    dentin.bezierCurveTo(0.27, -0.34, 0.33, -0.71, 0.23, -1.10);
    dentin.bezierCurveTo(0.18, -1.29, 0.08, -1.26, 0.02, -1.03);
    dentin.bezierCurveTo(-0.02, -0.70, -0.05, -0.42, -0.08, -0.22);
    dentin.bezierCurveTo(-0.03, 0.02, 0.01, 0.36, 0.03, 0.70);
    dentin.closePath();
    addPart(toothGroup, dentin, dentinMaterial, 'dentine', 0.19, 0.025, false);

    const pulp = new THREE.Shape();
    pulp.moveTo(0.04, 0.35);
    pulp.bezierCurveTo(0.15, 0.43, 0.31, 0.41, 0.36, 0.30);
    pulp.bezierCurveTo(0.39, 0.21, 0.31, 0.13, 0.22, 0.09);
    pulp.bezierCurveTo(0.17, -0.03, 0.14, -0.17, 0.12, -0.33);
    pulp.bezierCurveTo(0.08, -0.16, 0.07, -0.02, 0.08, 0.11);
    pulp.bezierCurveTo(-0.02, 0.14, -0.09, 0.24, 0.04, 0.35);
    pulp.closePath();
    addPart(toothGroup, pulp, pulpMaterial, 'pulpe', 0.239, 0.026, false);
    addCanal(toothGroup, [new THREE.Vector3(0.12, -0.19, 0.275), new THREE.Vector3(0.11, -0.43, 0.275), new THREE.Vector3(0.11, -0.72, 0.275), new THREE.Vector3(0.16, -1.15, 0.26)], 'pulpe');
    addCanal(toothGroup, [new THREE.Vector3(0.12, -0.20, 0.277), new THREE.Vector3(0.02, -0.39, 0.277), new THREE.Vector3(-0.04, -0.70, 0.277), new THREE.Vector3(-0.70, -1.25, 0.26)], 'pulpe');

    const rootFlare = new THREE.Shape();
    rootFlare.moveTo(0.35, -0.39); rootFlare.bezierCurveTo(0.43, -0.60, 0.38, -1.12, 0.24, -1.37); rootFlare.bezierCurveTo(0.17, -1.49, 0.04, -1.46, 0.00, -1.28); rootFlare.bezierCurveTo(0.07, -0.91, 0.17, -0.57, 0.35, -0.39); rootFlare.closePath();
    addPart(toothGroup, rootFlare, rootMaterial, 'racines', 0.28, 0.035, false);
    const secondRoot = new THREE.Shape();
    secondRoot.moveTo(-0.30, -0.44); secondRoot.bezierCurveTo(-0.43, -0.66, -0.46, -1.16, -0.63, -1.35); secondRoot.bezierCurveTo(-0.72, -1.46, -0.83, -1.41, -0.83, -1.22); secondRoot.bezierCurveTo(-0.80, -0.88, -0.68, -0.56, -0.30, -0.44); secondRoot.closePath();
    addPart(toothGroup, secondRoot, rootMaterial.clone(), 'racines', 0.282, 0.035, false);

    toothGroup.rotation.x = -0.06;
    toothGroup.rotation.y = -0.14;
    toothGroup.scale.setScalar(0.92);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.055;
    controls.enablePan = false;
    controls.minDistance = 4.5;
    controls.maxDistance = 7.1;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.42;
    controls.target.set(0, -0.17, 0);
    controls.update();

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      toothGroup.position.y = Math.sin(performance.now() * 0.00065) * 0.045;
      toothGroup.children.forEach((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const part = child.userData.anatomyPart as ToothPart | undefined;
        const material = child.material;
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        const chosen = part === activeRef.current;
        material.emissiveIntensity = chosen ? (part === 'dentine' ? 0.075 : 0.11) : 0;
        if (child.userData.isShell) {
          material.transparent = cutawayRef.current;
          material.opacity = cutawayRef.current ? 0.32 : 1;
          material.depthWrite = !cutawayRef.current;
        }
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      toothGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const selected = anatomy.find((part) => part.id === active) ?? anatomy[1];
  return (
    <div className="tooth-explorer">
      <div className="tooth-stage">
        <div className="tooth-glow" aria-hidden="true" />
        <div className="tooth-canvas" ref={hostRef} />
        <span className="stage-index">01 <i>/</i> 04</span>
        <span className="stage-kind">COUPE SCHÉMATIQUE</span>
        <div className="tooth-caption"><span className="caption-dot" style={{ backgroundColor: selected.color }} /> <span><small>PARTIE SÉLECTIONNÉE</small><strong>{selected.title}</strong></span></div>
        <span className="orbit-hint"><Rotate3D size={15} /> FAITES GLISSER POUR PIVOTER</span>
      </div>
      <div className="anatomy-panel">
        <div className="anatomy-panel-head"><EyebrowLabel /> <span>TOUCHEZ UNE PARTIE</span></div>
        <div className="anatomy-list" role="group" aria-label="Sélectionner une partie de la dent">
          {anatomy.map((part, index) => <button key={part.id} className={`anatomy-row ${active === part.id ? 'anatomy-active' : ''}`} onClick={() => setActive(part.id)} aria-pressed={active === part.id}><span className="anatomy-index">0{index + 1}</span><span className="anatomy-swatch" style={{ backgroundColor: part.color }} /><span className="anatomy-name">{part.title}</span><ArrowUpRight size={15} className="anatomy-arrow" /></button>)}
        </div>
        <p className="anatomy-description" key={selected.id}><span className="description-dash" />{selected.description}</p>
        <button className={`cutaway-toggle ${cutaway ? 'cutaway-active' : ''}`} onClick={() => setCutaway(!cutaway)} aria-pressed={cutaway}><span className="toggle-dot" />{cutaway ? 'Réunir les couches' : 'Voir les couches internes'}<ArrowRight size={15} /></button>
        <span className="anatomy-footnote">Représentation simplifiée à visée pédagogique.</span>
      </div>
    </div>
  );
}

function EyebrowLabel() { return <span className="anatomy-label">L’ANATOMIE DENTAIRE</span>; }
