import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGlassTexture, rippleGlassNormals } from './glass-texture.js';

export async function createSculpture(stage, reducedMotion) {
  const canvas = stage.querySelector('canvas');
  const textureImage = new Image();
  textureImage.src = '/images/glass-fold.png';
  await textureImage.decode().catch(() => {});
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: new URLSearchParams(location.search).has('render-preview') });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, .1, 6.4);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), .04);
  scene.environment = environment.texture;
  scene.add(new THREE.AmbientLight(0x77718b, .22));
  const orange = new THREE.PointLight(0xff5a23, 65, 14, 2);
  orange.position.set(-2.4, .8, 3.2);
  scene.add(orange);
  const lavender = new THREE.PointLight(0xb9acff, 40, 14, 2);
  lavender.position.set(2.4, 1.7, 2.8);
  scene.add(lavender);
  const white = new THREE.PointLight(0xffffff, 9, 12, 2);
  white.position.set(0, -2.4, 4);
  scene.add(white);

  let sceneInitialized = false;
  function render() {
    if (!sceneInitialized) return;
    renderer.render(scene, camera);
  }
  function glassMaterial(region, tint = 0xffffff, opacity = 1) {
    const map = createGlassTexture(textureImage, region, render);
    return new THREE.MeshPhysicalMaterial({
      color: tint, map,
      metalness: .08, roughness: .045, ior: 1.46,
      iridescence: .25, iridescenceIOR: 1.3,
      clearcoat: .7, clearcoatRoughness: .025,
      envMapIntensity: 1.0, specularIntensity: 1,
      transparent: opacity < 1, opacity,
      side: THREE.FrontSide,
      emissive: 0xffffff, emissiveMap: map, emissiveIntensity: .14
    });
  }
  const glass = glassMaterial([.24, .605, .44, .19]);
  const ember = glassMaterial([.14, .14, .45, .22], 0xffdcc8);
  const ice = glassMaterial([.606, .343, .202, .353], 0xc8c5ff, .88);
  function mesh(geometry, material, rotation = [0, 0, 0], scale = 1) {
    const item = new THREE.Mesh(rippleGlassNormals(geometry), material);
    item.rotation.set(...rotation);
    item.scale.setScalar(scale);
    return item;
  }

  const forms = {
    fold: new THREE.Group(),
    current: new THREE.Group(),
    afterimage: new THREE.Group()
  };
  forms.fold.add(mesh(new THREE.TorusKnotGeometry(1.29, .31, 200, 28, 2, 3), glass, [.27, -.16, .18]));
  forms.fold.add(mesh(new THREE.TorusKnotGeometry(1.19, .22, 200, 20, 2, 3), ember, [.48, -.31, -.16], 1.08));
  forms.fold.add(mesh(new THREE.TorusGeometry(1.28, .16, 18, 120), ice, [.82, .22, -.36], 1.12));
  forms.current.add(mesh(new THREE.TorusKnotGeometry(1.18, .24, 360, 28, 3, 5), ember, [.38, .22, .2]));
  forms.current.add(mesh(new THREE.TorusKnotGeometry(1.34, .19, 360, 28, 3, 5), ice, [.38, .22, .2]));
  forms.current.add(mesh(new THREE.TorusGeometry(1.2, .12, 18, 150), glass, [-.4, .4, .3]));
  forms.afterimage.add(mesh(new THREE.TorusKnotGeometry(1.21, .27, 260, 32, 2, 5), glass, [.33, .12, -.16]));
  forms.afterimage.add(mesh(new THREE.TorusKnotGeometry(1.21, .1, 260, 18, 2, 5), ember, [.38, .2, -.1], 1.16));
  forms.afterimage.add(mesh(new THREE.TorusGeometry(1.47, .09, 20, 180), ice, [.73, -.2, .2]));
  const pivot = new THREE.Group();
  Object.values(forms).forEach(group => pivot.add(group));
  pivot.rotation.set(.1, -.3, .05);
  scene.add(pivot);

  const sparks = new THREE.Group();
  const sparkGeometry = new THREE.SphereGeometry(1, 8, 8);
  const sparkMaterials = [new THREE.MeshBasicMaterial({ color: 0xff6033 }), new THREE.MeshBasicMaterial({ color: 0xc8c3ff })];
  const sparkMeshes = sparkMaterials.map(material => new THREE.InstancedMesh(sparkGeometry, material, 22));
  const sparkTransform = new THREE.Object3D();
  for (let i = 0; i < 44; i++) {
    const theta = i * 2.399963229728653;
    const distance = 1.95 + (i % 7) * .18;
    sparkTransform.position.set(Math.cos(theta) * distance, Math.sin(theta) * distance * .71, ((i * 13) % 17) / 17 - .5);
    sparkTransform.scale.setScalar(.014 + (i % 5) * .006);
    sparkTransform.updateMatrix();
    sparkMeshes[i % 2].setMatrixAt(Math.floor(i / 2), sparkTransform.matrix);
  }
  sparkMeshes.forEach(spark => { spark.instanceMatrix.needsUpdate = true; sparks.add(spark); });
  scene.add(sparks);

  let visible = false;
  let activeStudy = 'fold';
  let frame = 0;
  let previous = 0;
  let pointer = null;
  let targetX = .1;
  let targetY = -.3;
  let velocityX = 0;
  let velocityY = 0;
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 600 ? 7 : 6.4;
    camera.updateProjectionMatrix();
    render();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  let visibleBeforeContextLoss = false;
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    visibleBeforeContextLoss = visible;
    setVisible(false);
    stage.classList.remove('is-ready');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    resize();
    stage.classList.add('is-ready');
    setVisible(visibleBeforeContextLoss);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
    else if (!document.hidden && visible) schedule();
  });

  function schedule() {
    if (visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0;
    if (!visible) return;
    const dt = Math.min((time - (previous || time - 16.67)) / 1000, .12);
    previous = time;
    if (!reducedMotion.matches && !pointer) {
      targetY += velocityX * dt;
      targetX += velocityY * dt;
      const decay = Math.exp(-dt * 6);
      velocityX *= decay;
      velocityY *= decay;
    }
    const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 22);
    pivot.rotation.x += (targetX - pivot.rotation.x) * blend;
    pivot.rotation.y += (targetY - pivot.rotation.y) * blend;
    render();
    const moving = Math.abs(targetX - pivot.rotation.x) + Math.abs(targetY - pivot.rotation.y) > .0008;
    if (moving || (!reducedMotion.matches && Math.abs(velocityX) + Math.abs(velocityY) > .015)) schedule();
  }
  function setVisible(next) {
    visible = next;
    if (next) { render(); schedule(); }
    else if (frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  }
  function showActive() {
    Object.entries(forms).forEach(([name, group]) => { group.visible = name === activeStudy; });
    render();
    schedule();
  }
  function setStudy(name) {
    if (!(name in forms)) return;
    activeStudy = name;
    showActive();
  }
  function rotateBy(dx, dy) {
    targetY += dx * .0035;
    targetX += dy * .0035;
    if (!reducedMotion.matches) {
      velocityX = Math.max(-1.2, Math.min(1.2, dx * .025));
      velocityY = Math.max(-1.2, Math.min(1.2, dy * .025));
    }
    schedule();
  }
  stage.addEventListener('pointerdown', event => {
    pointer = { x: event.clientX, y: event.clientY };
    velocityX = 0;
    velocityY = 0;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer) return;
    rotateBy(event.clientX - pointer.x, event.clientY - pointer.y);
    pointer = { x: event.clientX, y: event.clientY };
  });
  const release = () => { pointer = null; stage.classList.remove('is-dragging'); schedule(); };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    rotateBy(event.key === 'ArrowLeft' ? -25 : event.key === 'ArrowRight' ? 25 : 0, event.key === 'ArrowUp' ? -25 : event.key === 'ArrowDown' ? 25 : 0);
  });
  sceneInitialized = true;
  showActive();
  resize();
  return { setStudy, setVisible, rotateBy };
}
