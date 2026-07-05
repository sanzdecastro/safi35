import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function createModelScene(canvas, modelUrl, { targetSize = 3, cameraZ = 5 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, cameraZ);

  scene.add(new THREE.AmbientLight(0xffffff, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6);
  fill.position.set(-4, -2, 3);
  scene.add(fill);

  let model = null;
  let rotationY = 0;

  new GLTFLoader().load(modelUrl, (gltf) => {
    model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.scale.setScalar(targetSize / size);
    model.rotation.y = rotationY;
    scene.add(model);
  });

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }, { threshold: 0 });
  io.observe(canvas);

  return {
    setRotation(y) {
      rotationY = y;
      if (model) model.rotation.y = y;
    },
    render() {
      if (visible && model) renderer.render(scene, camera);
    },
  };
}

const spaceScene = createModelScene(
  document.getElementById('canvas-space'),
  'assets/3d/space.glb',
  { targetSize: 3.6, cameraZ: 6 }
);

const conchaScene = createModelScene(
  document.getElementById('canvas-concha'),
  'assets/3d/concha.glb',
  { targetSize: 3.3, cameraZ: 6 }
);

const zumoScene = createModelScene(
  document.getElementById('canvas-zumo'),
  'assets/3d/zumo.glb',
  { targetSize: 3.6, cameraZ: 6 }
);

const arcoirisScene = createModelScene(
  document.getElementById('canvas-arcoiris'),
  'assets/3d/arcoiris.glb',
  { targetSize: 3.6, cameraZ: 6 }
);

const treintaycincoScene = createModelScene(
  document.getElementById('canvas-35'),
  'assets/3d/35.glb',
  { targetSize: 4.5, cameraZ: 8 }
);

gsap.ticker.add(() => {
  spaceScene.render();
  conchaScene.render();
  zumoScene.render();
  arcoirisScene.render();
  treintaycincoScene.render();
});

const TURNS = Math.PI * 4; // dos vueltas completas a lo largo de la sección

ScrollTrigger.create({
  trigger: '#section-viernes',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => spaceScene.setRotation(self.progress * TURNS),
});

ScrollTrigger.create({
  trigger: '#section-comida',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => zumoScene.setRotation(self.progress * TURNS),
});

ScrollTrigger.create({
  trigger: '#section-sabado',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => conchaScene.setRotation(self.progress * TURNS),
});

ScrollTrigger.create({
  trigger: '#section-domingo',
  start: 'top bottom',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => arcoirisScene.setRotation(self.progress * TURNS),
});

// El "35" gira de forma continua a lo largo de todo el scroll de la página
ScrollTrigger.create({
  trigger: '#page',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true,
  onUpdate: (self) => treintaycincoScene.setRotation(self.progress * TURNS * 3),
});
