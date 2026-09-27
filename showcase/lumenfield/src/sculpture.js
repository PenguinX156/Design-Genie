import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createGlassTexture } from './glass-texture.js';
import { createWovenFold } from './woven-fold.js';

export async function createSculpture(stage, reducedMotion) {
  const canvas = stage.querySelector('canvas');
  const textureImage = new Image();
  textureImage.src = '/images/glass-fold.png';
  await textureImage.decode().catch(() => {});
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: new URLSearchParams(location.search).has('render-preview') });
  const restingPixelRatio = Math.min(window.devicePixelRatio || 1, 1);
  let pixelRatio = restingPixelRatio;
  renderer.setPixelRatio(pixelRatio);
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
    const key = activeKey();
    sparks.visible = key !== 'woven';
    renderer.render(scene, camera);
  }
  function glassMaterial(region, tint = 0xffffff) {
    const map = createGlassTexture(textureImage, region, render);
    return new THREE.MeshPhysicalMaterial({
      color: tint, map, metalness: .42, roughness: .07,
      transmission: 0, thickness: .8, ior: 1.45,
      iridescence: .5, iridescenceIOR: 1.3,
      clearcoat: 1, clearcoatRoughness: .025,
      envMapIntensity: .65, side: THREE.DoubleSide,
      emissive: 0xffffff, emissiveMap: map, emissiveIntensity: .18
    });
  }
  const glass = glassMaterial([.24, .605, .44, .19]);
  const ember = glassMaterial([.14, .14, .45, .22], 0xffdcc8);
  const ice = glassMaterial([.606, .343, .202, .353], 0xc8c5ff);
  function mesh(geometry, material, rotation = [0, 0, 0], scale = 1) {
    const item = new THREE.Mesh(geometry, material);
    item.rotation.set(...rotation);
    item.scale.setScalar(scale);
    return item;
  }

  const forms = {
    fold: new THREE.Group(),
    current: new THREE.Group(),
    afterimage: new THREE.Group()
  };
  forms.fold.add(mesh(new THREE.TorusKnotGeometry(1.29, .31, 280, 40, 2, 3), glass, [.27, -.16, .18]));
  forms.fold.add(mesh(new THREE.TorusKnotGeometry(1.19, .22, 280, 28, 2, 3), ember, [.48, -.31, -.16], 1.08));
  forms.fold.add(mesh(new THREE.TorusGeometry(1.28, .16, 24, 160), ice, [.82, .22, -.36], 1.12));
  forms.current.add(mesh(new THREE.TorusKnotGeometry(1.18, .24, 360, 28, 3, 5), ember, [.38, .22, .2]));
  forms.current.add(mesh(new THREE.TorusKnotGeometry(1.34, .19, 360, 28, 3, 5), ice, [.38, .22, .2]));
  forms.current.add(mesh(new THREE.TorusGeometry(1.2, .12, 18, 150), glass, [-.4, .4, .3]));
  forms.afterimage.add(mesh(new THREE.TorusKnotGeometry(1.21, .27, 260, 32, 2, 5), glass, [.33, .12, -.16]));
  forms.afterimage.add(mesh(new THREE.TorusKnotGeometry(1.21, .1, 260, 18, 2, 5), ember, [.38, .2, -.1], 1.16));
  forms.afterimage.add(mesh(new THREE.TorusGeometry(1.47, .09, 20, 180), ice, [.73, -.2, .2]));
  Object.values(forms).forEach(group => group.rotation.set(.1, -.3, .05));
  const wovenMap = createGlassTexture(textureImage, [.11, .08, .76, .79], render);
  forms.woven = createWovenFold(new THREE.MeshPhongMaterial({
    map: wovenMap, shininess: 85, specular: 0xaaa6dd,
    emissive: 0xffffff, emissiveMap: wovenMap, emissiveIntensity: .16,
    side: THREE.DoubleSide
  }));
  const pivot = new THREE.Group();
  Object.values(forms).forEach(group => pivot.add(group));
  scene.add(pivot);

  const sparks = new THREE.Group();
  const sparkGeometry = new THREE.SphereGeometry(1, 8, 8);
  const sparkMaterials = [new THREE.MeshBasicMaterial({ color: 0xff6033 }), new THREE.MeshBasicMaterial({ color: 0xc8c3ff })];
  for (let i = 0; i < 30; i++) {
    const theta = i * 2.399963229728653;
    const distance = 1.95 + (i % 7) * .18;
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterials[i % 2]);
    spark.position.set(Math.cos(theta) * distance, Math.sin(theta) * distance * .71, ((i * 13) % 17) / 17 - .5);
    spark.scale.setScalar(.014 + (i % 5) * .006);
    sparks.add(spark);
  }
  scene.add(sparks);

  let visible = false;
  let activeStudy = 'fold';
  let model = 'woven';
  let frame = 0;
  let previous = 0;
  let pointer = null;
  let targetX = 0;
  let targetY = 0;
  let velocityX = 0;
  let velocityY = 0;
  const activeKey = () => activeStudy === 'fold' && model === 'woven' ? 'woven' : activeStudy;
  function setResolution(next) {
    if (pixelRatio === next) return;
    pixelRatio = next;
    renderer.setPixelRatio(pixelRatio);
    const { width, height } = stage.getBoundingClientRect();
    if (width && height) renderer.setSize(width, height, false);
  }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 600 ? 8.45 : 6.4;
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
    else if (!pointer && pixelRatio !== restingPixelRatio) { setResolution(restingPixelRatio); render(); }
  }
  function setVisible(next) {
    visible = next;
    if (next) { render(); schedule(); }
    else if (frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  }
  function showActive() {
    const key = activeKey();
    Object.entries(forms).forEach(([name, group]) => { group.visible = name === key; });
    render();
    schedule();
  }
  function setStudy(name) {
    if (!(name in forms) || name === 'woven') return;
    activeStudy = name;
    showActive();
  }
  function setModel(next) {
    model = next === 'woven' ? 'woven' : 'helix';
    showActive();
    return model;
  }
  function rotateBy(dx, dy) {
    if (!reducedMotion.matches) setResolution(Math.min(restingPixelRatio, .4));
    targetY += dx * .0035;
    targetX += dy * .0035;
    if (!reducedMotion.matches) {
      velocityX = Math.max(-1.2, Math.min(1.2, dx * .025));
      velocityY = Math.max(-1.2, Math.min(1.2, dy * .025));
    }
    schedule();
  }
  stage.addEventListener('pointerdown', event => {
    if (!reducedMotion.matches) setResolution(Math.min(restingPixelRatio, .4));
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
  return { setStudy, setModel, setVisible, rotateBy };
}
