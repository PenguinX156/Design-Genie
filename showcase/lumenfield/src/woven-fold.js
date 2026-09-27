import * as THREE from 'three';

// A closed, genuinely three-dimensional glass ribbon. The centerline winds
// through and behind itself; an oval section gives it broad faces without
// turning each strand into a round inflated tube.
export function createWovenFold(material) {
  const lengthSegments = 240;
  const sectionSegments = 20;
  const p = 2;
  const q = 3;
  const radius = 1.18;
  const vertices = [];
  const uvs = [];
  const indices = [];
  const center = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const broad = new THREE.Vector3();
  const thin = new THREE.Vector3();

  function point(u, out) {
    const ring = radius * (2 + Math.cos(q / p * u)) * .5;
    return out.set(ring * Math.cos(u), ring * Math.sin(u), radius * .5 * Math.sin(q / p * u));
  }

  for (let i = 0; i <= lengthSegments; i++) {
    const t = i / lengthSegments;
    const u = t * p * Math.PI * 2;
    point(u, center);
    point(u + .005, ahead);
    tangent.subVectors(ahead, center).normalize();
    broad.copy(center).add(ahead).normalize();
    thin.crossVectors(tangent, broad).normalize();
    broad.crossVectors(thin, tangent).normalize();
    const twist = t * Math.PI * 2;
    const c = Math.cos(twist);
    const s = Math.sin(twist);
    const width = .46 + .035 * Math.sin(t * Math.PI * 12);
    const depth = .12;
    for (let j = 0; j <= sectionSegments; j++) {
      const around = j / sectionSegments * Math.PI * 2;
      const x = width * Math.cos(around);
      const y = depth * Math.sin(around);
      const bx = x * c - y * s;
      const by = x * s + y * c;
      vertices.push(center.x + broad.x * bx + thin.x * by,
        center.y + broad.y * bx + thin.y * by,
        center.z + broad.z * bx + thin.z * by);
      uvs.push(t, j / sectionSegments);
    }
  }
  for (let i = 0; i < lengthSegments; i++) for (let j = 0; j < sectionSegments; j++) {
    const a = i * (sectionSegments + 1) + j;
    const b = a + sectionSegments + 1;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  const group = new THREE.Group();
  const ribbon = new THREE.Mesh(geometry, material);
  group.add(ribbon);
  group.rotation.set(.08, -.22, -.17);
  group.scale.set(1.12, .93, 1);
  return group;
}
