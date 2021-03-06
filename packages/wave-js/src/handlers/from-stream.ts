//@ts-nocheck
import { AudioContext } from "standardized-audio-context";
import IWaveOptions from "../core/types/IWaveOptions";
import IFromStreamOptions from "../core/types/IFromStreamOptions";
import defaultOptions from "../utils/default-options";
import visualize from "../core/Visualizer";
import { checkGenerator, clearCanvas, initGlobalObject } from "../utils";

const renderFrame = (currentStream, analyser, sources, stream, frameCount) => {
  if (currentStream.activated) {
    analyser.getByteFrequencyData(currentStream.data);
    visualize(
      currentStream.data,
      currentStream.canvasId,
      currentStream.options,
      frameCount
    );
    sources[stream.id].animation = requestAnimationFrame(currentStream.loop);
  }
};

export default function fromStream(
  stream: MediaStream,
  canvasId: string,
  options?: IWaveOptions,
  fromStreamOptions?: IFromStreamOptions
): { deactivate: () => void } {
  const parsedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };

  const parsedFromStreamOptions = {
    connectDestination: true,
    ...(fromStreamOptions || {}),
  };

  checkGenerator(parsedOptions.type);

  const { connectDestination } = parsedFromStreamOptions;
  const currentStream = {
    canvasId,
    options: parsedOptions,
    data: null,
    loop: null,
    animation: null,
    activated: true,
  };
  const sources = initGlobalObject(
    "stream-sources",
    parsedOptions.globalAccessKey
  );

  if (sources[stream.id]) {
    cancelAnimationFrame(sources[stream.id].animation);
  }

  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaStreamSource(stream);
  source.connect(analyser);
  if (connectDestination) {
    source.connect(audioCtx.destination); //playback audio
  }
  sources[stream.id] = {
    audioCtx,
    analyser,
    source,
  };

  analyser.fftSize = 32768;
  const bufferLength = analyser.frequencyBinCount;
  currentStream.data = new Uint8Array(bufferLength);
  this.frameCount = 1;
  currentStream.loop = () =>
    renderFrame(currentStream, analyser, sources, stream, ++this.frameCount);
  renderFrame(currentStream, analyser, sources, stream, 1);

  return {
    deactivate: () => {
      clearCanvas(
        document.getElementById(currentStream.canvasId) as HTMLCanvasElement
      );
      audioCtx.close().then();
      currentStream.activated = false;
    },
  };
}
