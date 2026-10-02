import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {cameraAt, progressAt, scenes, timeAt} from './timeline';
import {tileArrival, tileProgress} from './reveal';

test('camera holds each panel while its transformation completes', () => {
  for (const scene of scenes.slice(1)) {
    for (const time of [scene.start, scene.start + scene.duration]) {
      const x = cameraAt(time).x;
      assert.ok(Math.abs(x - (900 + scene.panel * 1800)) < 1);
    }
  }
});

test('changing duration keeps the same scene ordering', () => {
  assert.equal(timeAt(450, 30, 30), 15);
  assert.equal(timeAt(900, 30, 60), 15);
  assert.equal(timeAt(675, 30, 45), 15);
});

test('every changed tile reaches a finished state with no premature appearance', () => {
  for (const scene of scenes) {
    assert.equal(progressAt(scene.start - .01, scene), 0);
    assert.equal(progressAt(scene.start + scene.duration + .01, scene), 1);
    for (let x = 0; x < 1800; x += 33) {
      for (let y = 0; y < 1080; y += 41) {
        const arrival = tileArrival(x, y, scene, 42);
        assert.ok(arrival > 0 && arrival <= .83);
        assert.equal(tileProgress(0, arrival, 1), 0);
        assert.equal(tileProgress(1, arrival, 1), 1);
        let previous = 0;
        for (let p = 0; p <= 1; p += .025) {
          const current = tileProgress(p, arrival, .36);
          assert.ok(current >= previous);
          previous = current;
        }
      }
    }
  }
});

test('tile timing is reproducible and responds to a new seed', () => {
  const scene = scenes[0];
  assert.equal(tileArrival(843, 474, scene, 42), tileArrival(843, 474, scene, 42));
  assert.notEqual(tileArrival(843, 474, scene, 42), tileArrival(843, 474, scene, 91));
});
