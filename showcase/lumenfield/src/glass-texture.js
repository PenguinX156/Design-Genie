import * as THREE from 'three';

// Use detail from the approved Fold artwork, mirrored at both UV seams so the
// original helix meshes keep their continuous glass grain while rotating.
export function createGlassTexture(referenceImage, region = [.24, .605, .44, .19], onUpdate) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const fallback = ctx.createLinearGradient(0, 0, 0, canvas.height);
  fallback.addColorStop(0, '#291b45');
  fallback.addColorStop(.35, '#101018');
  fallback.addColorStop(.55, '#d4480a');
  fallback.addColorStop(.8, '#191024');
  fallback.addColorStop(1, '#7667a8');
  ctx.fillStyle = fallback;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;

  function paint() {
    if (!referenceImage?.naturalWidth) return;
    const [x, y, width, height] = region;
    const source = [x * referenceImage.naturalWidth, y * referenceImage.naturalHeight, width * referenceImage.naturalWidth, height * referenceImage.naturalHeight];
    for (const [flipX, flipY] of [[false, false], [true, false], [false, true], [true, true]]) {
      ctx.save();
      ctx.translate(flipX ? canvas.width : 0, flipY ? canvas.height : 0);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(referenceImage, ...source, 0, 0, canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
    texture.needsUpdate = true;
    onUpdate?.();
  }
  if (referenceImage?.complete) paint();
  else referenceImage?.addEventListener('load', paint, { once: true });
  return texture;
}
