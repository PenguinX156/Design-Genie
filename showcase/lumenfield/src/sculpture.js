import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createSculpture(stage, reducedMotion) {
  const canvas = stage.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.set(0, .1, 6.4);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), .04);
  scene.environment = environment.texture;

  scene.add(new THREE.AmbientLight(0x77718b, .22));
  const orange = new THREE.PointLight(0xff5a23, 115, 14, 2);
  orange.position.set(-2.4, .8, 3.2);
  scene.add(orange);
  const lavender = new THREE.PointLight(0xb9acff, 65, 14, 2);
  lavender.position.set(2.4, 1.7, 2.8);
  scene.add(lavender);
  const white = new THREE.PointLight(0xffffff, 9, 12, 2);
  white.position.set(0, -2.4, 4);
  scene.add(white);

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x251d3c, metalness: .92, roughness: .06,
    transmission: 0, thickness: 1.25, ior: 1.4,
    iridescence: .65, iridescenceIOR: 1.3,
    clearcoat: 1, clearcoatRoughness: .03,
    envMapIntensity: .85, side: THREE.DoubleSide
  });
  const ember = new THREE.MeshPhysicalMaterial({
    color: 0xa3310b, metalness: .82, roughness: .065,
    transmission: 0, thickness: .8, ior: 1.45,
    iridescence: .45, clearcoat: 1,
    envMapIntensity: 1.4, side: THREE.DoubleSide
  });
  const ice = new THREE.MeshPhysicalMaterial({
    color: 0x584d9d, metalness: .88, roughness: .06,
    transmission: 0, thickness: .7, ior: 1.4,
    iridescence: 1, clearcoat: 1,
    envMapIntensity: 1.15, side: THREE.DoubleSide
  });

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

  const pivot = new THREE.Group();
  Object.values(forms).forEach(group => pivot.add(group));
  pivot.rotation.set(.1, -.3, .05);
  scene.add(pivot);

  const sparks = new THREE.Group();
  const sparkGeometry = new THREE.SphereGeometry(1, 8, 8);
  const sparkMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xff6033 }),
    new THREE.MeshBasicMaterial({ color: 0xc8c3ff })
  ];
  for (let i = 0; i < 44; i++) {
    const theta = i * 2.399963229728653;
    const distance = 1.95 + (i % 7) * .18;
    const spark = new THREE.Mesh(sparkGeometry, sparkMaterials[i % 2]);
    spark.position.set(Math.cos(theta) * distance, Math.sin(theta) * distance * .71, ((i * 13) % 17) / 17 - .5);
    spark.scale.setScalar(.014 + (i % 5) * .006);
    sparks.add(spark);
  }
  scene.add(sparks);

  let visible = false;
  let active = 'fold';
  let transition = null;
  let frame = 0;
  let previous = 0;
  let pointer = null;
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
  function render() { renderer.render(scene, camera); }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);

  function tick(time) {
    if (!visible) { frame = 0; return; }
    const delta = Math.min((time - (previous || time)) / 16.67, 2);
    previous = time;
    if (!reducedMotion.matches) {
      pivot.rotation.y += (.0028 + velocityX) * delta;
      pivot.rotation.x += velocityY * delta;
      sparks.rotation.y -= .0007 * delta;
      velocityX *= .94;
      velocityY *= .94;
    }
    if (transition) {
      const progress = Math.min((time - transition.start) / 520, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      transition.from.scale.setScalar(Math.max(.001, 1 - eased));
      transition.to.scale.setScalar(Math.max(.001, eased));
      if (progress === 1) {
        transition.from.visible = false;
        transition.from.scale.setScalar(1);
        transition = null;
      }
    }
    render();
    frame = requestAnimationFrame(tick);
  }
  function setVisible(next) {
    visible = next;
    if (next && !frame && !reducedMotion.matches) frame = requestAnimationFrame(tick);
    else if (next) render();
    if (!next && frame) { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  }
  function setStudy(name) {
    if (!(name in forms)) return;
    const previousStudy = active;
    active = name;
    if (name !== previousStudy && visible && !reducedMotion.matches) {
      Object.entries(forms).forEach(([key, group]) => {
        group.visible = key === name || key === previousStudy;
        group.scale.setScalar(1);
      });
      forms[name].scale.setScalar(.001);
      transition = { from: forms[previousStudy], to: forms[name], start: performance.now() };
    } else {
      transition = null;
      Object.entries(forms).forEach(([key, group]) => { group.visible = key === name; group.scale.setScalar(1); });
    }
    pivot.rotation.y += .28;
    render();
  }

  stage.addEventListener('pointerdown', event => {
    pointer = { x: event.clientX, y: event.clientY };
    stage.setPointerCapture(event.pointerId);
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pivot.rotation.y += dx * .008;
    pivot.rotation.x += dy * .008;
    velocityX = dx * .0004;
    velocityY = dy * .0004;
    pointer = { x: event.clientX, y: event.clientY };
    render();
  });
  const release = () => { pointer = null; stage.classList.remove('is-dragging'); };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') pivot.rotation.y -= .2;
    if (event.key === 'ArrowRight') pivot.rotation.y += .2;
    if (event.key === 'ArrowUp') pivot.rotation.x -= .2;
    if (event.key === 'ArrowDown') pivot.rotation.x += .2;
    render();
  });

  setStudy(active);
  resize();
  return { setStudy, setVisible };
}
