const scopes = new Set(['new', 'redesign', 'targeted', 'review']);
const signatures = new Set(['standard', 'interactive', '3d']);

export function routeWorkflow({ scope = 'new', signature = 'standard' } = {}) {
  if (!scopes.has(scope)) throw new Error(`Unknown scope: ${scope}. Use new, redesign, targeted, or review.`);
  if (!signatures.has(signature)) throw new Error(`Unknown signature: ${signature}. Use standard, interactive, or 3d.`);

  const steps = [
    'Read design context and the affected product surfaces. Inspect the existing stack and brand before choosing tools or style.'
  ];
  if (scope === 'new' || scope === 'redesign') {
    steps.push('Compare about three genuinely different product-fit directions in short form. Select one and record its rules in .design/BRIEF.md and DESIGN.md.');
    steps.push('Build the primary task flow and one approved signature moment using representative content.');
  } else if (scope === 'targeted') {
    steps.push('Preserve the chosen direction. Change only the affected surface and its states; record a meaningful exception if needed.');
  } else {
    steps.push('Inspect the current product and its primary tasks before proposing changes.');
  }

  if (signature === 'interactive') {
    steps.push(scope === 'review'
      ? 'Exercise the interaction and probe its rest and active states for review evidence.'
      : 'Prototype the uncertain interaction in its real page context; run one focused design probe on its rest and active states.');
  } else if (signature === '3d' && scope === 'review') {
    steps.push('Inspect the existing 3D geometry, material, lighting, placeholder/live parity, rotated views, and during-drag sharpness. Check fallback and mobile framing.');
  } else if (signature === '3d') {
    steps.push('Prove actual geometry, material, lighting, and rotated views before styling surrounding sections. Render the placeholder from the approved model and camera.');
    steps.push('Probe fallback-to-live parity, a dragged angle, and during-drag sharpness; check loading, keyboard, reduced motion, and mobile framing.');
  } else if (scope !== 'review') {
    steps.push('Probe only the highest-risk visual section or changed state; skip interaction probes when nothing interactive changed.');
  }

  if (scope === 'review') {
    steps.push('Run design capture and design audit at desktop, tablet, and mobile; inspect primary tasks and keyboard paths.');
    steps.push('Rank findings by user impact. Deliver concrete fixes and evidence; do not redesign without a request to change the interface.');
  } else if (scope === 'targeted') {
    steps.push('Verify the changed state and neighboring breakpoints. Run full capture/audit only when shared layout, navigation, or global styling changed.');
  } else {
    steps.push('After focused checks pass, run one final design capture and design audit across three viewports, then inspect keyboard and live motion.');
  }
  if (scope !== 'review') steps.push('Update .design/BRIEF.md with the accepted decision, current state, and next check. Stop after evidence passes; revisit only a concrete remaining issue.');

  const efficiency = ['Read BRIEF.md first; open detailed design files or specialist skills only for the active risk.'];
  if (scope === 'new' || scope === 'redesign') efficiency.push('Compare directions cheaply; generate expensive visual assets only when needed to choose or implement the approved direction.');
  if (scope !== 'review') efficiency.push('Reuse approved assets and decisions. Batch related fixes and rerun only affected probes.');
  efficiency.push('Limit visual critique to three focused rounds unless a critical issue remains. Do not claim speed or quality gains without measured comparisons.');

  return {
    scope, signature, steps, efficiency,
    styleRule: 'The workflow chooses effort and evidence, never a visual aesthetic, component library, framework, or effect.'
  };
}
