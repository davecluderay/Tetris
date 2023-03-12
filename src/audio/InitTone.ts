type ToneModule = typeof import('tone');

// Tonejs should be loaded and initialised only in response to a user interaction,
// because it immediately tries to create an AudioContext (causing a warning).

let todo = true;
let setToneModule: (tone: ToneModule) => void;
const tonePromise = new Promise<ToneModule>(resolve => { setToneModule = resolve; });

const initTone = async () => {
    if (!todo) return;
    todo = false;
    const tone = await import('tone');
    await tone.start();
    setToneModule(tone);
};

document.addEventListener('click', initTone, { once: true });
document.addEventListener('keypress', initTone, { once: true });

export { tonePromise };