import { series } from '../../utils.mjs';
import { stream } from '../../index.mjs';

describe('controller', () => {

  test('simple1', (done) => {
    const source = stream(({ kf }, { hook }) => {
      kf();
      hook.add(series(done, [
        evt => expect(evt).toEqual({ dissolve: false, w: 11 }),
      ]));
    });
    const cb = source.controller(({ w }) => ({ w: w + 1 })).on(
      evt => cb({ w: 10 })
    );
  });

});