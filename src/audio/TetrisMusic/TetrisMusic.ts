import { tonePromise } from '../InitTone';
import mainPartData from './mainPart.json';
import bassPartData from './bassPart.json';

type MusicControl = {
  start: (bpm: number) => void;
  stop: () => void;
  setBpm: (bpm: number) => void;
  setMute: (mute: boolean) => void;
}

let setMusicControl: (musicControl: MusicControl) => void;
let musicControlPromise = new Promise<MusicControl>(resolve => { setMusicControl = resolve; });

tonePromise.then((Tone) => {
  const mainSynthDefaultVolume = -10;
  const mainSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.Synth,
    options: { oscillator: { type: 'triangle' } },
    volume: mainSynthDefaultVolume
  }).toDestination();
  const mainPart = new Tone.Part((time, o) => {
    mainSynth.triggerAttackRelease(o.note, o.duration, time);
  }, mainPartData);
  mainPart.loopEnd = "48m";
  mainPart.loop = true;

  const bassSynthDefaultVolume = -10;
  const bassSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.Synth,
    options: { oscillator: { type: 'triangle' } },
    volume: bassSynthDefaultVolume
  }).toDestination();
  const bassPart = new Tone.Part((time, o) => {
    bassSynth.triggerAttackRelease(o.note, o.duration, time);
  }, bassPartData);
  bassPart.loopEnd = "48m";
  bassPart.loop = true;

  mainPart.start(0);
  bassPart.start(0);

  setMusicControl({
    stop: () => {
      Tone.getDestination().volume.value = 0;
      Tone.Transport.stop();

      // Stop chaotically.
      const notes = ["A#3", "C#4", "D#4", "F#4", "G4", "A#4", "C#5", "D#5", "F#5", "G5"];
      for (var n = 0; n < 12; n++) {
        const duration = Math.random() * 1;
        const note = notes[(Math.random() * notes.length) | 0];
        const delay = Math.random() * 0.5;
        mainSynth.triggerAttackRelease(note, duration, `+${delay}`);
      }
    },
    start: bpm => {
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start("+0", '0:0:0');
    },
    setBpm: bpm => {
      Tone.Transport.bpm.value = bpm;
    },
    setMute: (mute: boolean) => {
      mainSynth.volume.rampTo(mute ? -Infinity : mainSynthDefaultVolume, 0.25);
      bassSynth.volume.rampTo(mute ? -Infinity : bassSynthDefaultVolume, 0.25);
    }
  });
});

export { musicControlPromise };