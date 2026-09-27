import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { resolutionDrops } from '../packages/visual-audit/browser.mjs';

test('drag probe flags a canvas backing scale drop only during interaction', () => {
  const before = [{ index: 0, scaleX: 1.5, scaleY: 1.5 }];
  const during = [{ index: 0, scaleX: .75, scaleY: .75 }];
  const after = [{ index: 0, scaleX: 1.5, scaleY: 1.5 }];
  assert.deepEqual(resolutionDrops(before, during, after), [0]);
  assert.deepEqual(resolutionDrops(before, after, after), []);
});
