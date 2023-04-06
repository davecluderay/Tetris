import { tonePromise } from './InitTone'

type SfxControl = {
  playImpactSound: () => void;
  playExplosionSound: () => void;
}

let setSfxControl: (sfxControl: SfxControl) => void;
let sfxControlPromise = new Promise<SfxControl>(resolve => { setSfxControl = resolve; });

tonePromise.then((Tone) => {
  const impactSound = new Tone.Player("/audio/impact.mp3").toDestination();
  const explosionSound = new Tone.Player("/audio/explosion.mp3").toDestination();

  setSfxControl({
    playImpactSound: () => impactSound.start(),
    playExplosionSound: () => explosionSound.start()
  });
});

export { sfxControlPromise };