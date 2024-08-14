import { pipeline, env, PipelineType, TextClassificationPipeline } from "@xenova/transformers";
import { MessageTypes } from "./presets";

// https://github.com/xenova/transformers.js/issues/366
env.allowLocalModels = false;
env.useBrowserCache = false;

class MyTranscriptionPipeline {
  static task:PipelineType = "automatic-speech-recognition";
  static model = "Xenova/whisper-tiny.en";
  static instance: null | any = null;

  static async getInstance(progress_callback: any) {
    if (this.instance === null) {
      console.log("Attempting to load model from:", this.model);
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
        quantized: false,
      });
    }
    return this.instance;
  }
}
self.addEventListener("message", async (event) => {
  const { type, audio } = event.data;
  if (type === MessageTypes.INFERENCE_REQUEST) {
    await transcribe(audio);
  }
});

async function transcribe(audio: any) {
  sendLoadingMessage("loading");
  let pipeline;
  try {
    pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback);
    if (!pipeline) {
      throw new Error("Pipeline not initialized.");
    }
  } catch (err) {
    console.error("Failed to initialize pipeline:", err);
    sendLoadingMessage("error");
    return;
  }
//   sendLoadingMessage("success");

  const stride_length_s = 5;

  const generationTracker = new GenerationTracker(pipeline, stride_length_s);
  try {
    await pipeline(audio, {
      top_k: 0,
      do_sample: false,
      chunk_length_s: 30,
      stride_length_s,
      return_timestamps: true,
      force_full_sequences: false,
      callback_function:
      generationTracker.callbackFunction.bind(generationTracker),
      chunkCallback: generationTracker.chunkCallback.bind(generationTracker),
    });
  } catch (err) {
    console.error("Transcription failed:", err);
  }
  generationTracker.sendFinalResult();
}

async function load_model_callback(data: any) {
  const { status } = data;
  if (status === "progress") {
    const { file, progress, loaded, total } = data;
    sendDownloadingMessage(file, progress, loaded, total);
  }
}

function sendLoadingMessage(status: string) {
  self.postMessage({
    type: MessageTypes.LOADING,
    status,
  });
}

async function sendDownloadingMessage(
  file: string,
  progress: number,
  loaded: number,
  total: number
) {
  self.postMessage({
    type: MessageTypes.DOWNLOADING,
    file,
    progress,
    loaded,
    total,
  });
}

class GenerationTracker {
  pipeline: any;
  stride_length_s: number;
  chunks: any[];
  time_precision: number;
  processed_chunks: any[];
  callbackFunctionCounter: number;

  constructor(pipeline: any, stride_length_s: number) {
    this.pipeline = pipeline;
    this.stride_length_s = stride_length_s;
    this.chunks = [];
    this.time_precision =
      pipeline?.processor.feature_extractor.config.chunk_length /
      pipeline.model.config.max_source_positions;
    this.processed_chunks = [];
    this.callbackFunctionCounter = 0;
  }

  sendFinalResult() {
    self.postMessage({
      type: MessageTypes.INFERENCE_DONE,
    });
  }

  callbackFunction(beams: any) {
    this.callbackFunctionCounter += 1;
    if (this.callbackFunctionCounter % 10 !== 0) {
      return;
    }
    const bestBeams = beams[0];
    let text = this.pipeline.tokenizer.decode(bestBeams.output_token_ids, {
      skip_special_tokens: true,
    });
    const result = {
      text,
      start: this.getLastChunkTimestamp(),
      end: undefined,
    };
    createPartialResultMessage(result);
  }

  chunkCallback(data: any) {
    this.chunks.push(data);
    const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(this.chunks, {
      time_precision: this.time_precision,
      return_timestamps: true,
      force_full_sequence: false,
    });
    this.processed_chunks = chunks.map((chunk: any, index: number) => {
      console.log('processed_chunks',chunk,index)
      return this.processChunk(chunk, index);
    });

    createResultMessage(
      this.processed_chunks,
      false,
      this.getLastChunkTimestamp()
    );
  }

  getLastChunkTimestamp() {
    if (this.processed_chunks.length === 0) {
      return 0;
    }
    console.log(this.processed_chunks.length)
    return this.processed_chunks[this.processed_chunks.length - 1].end;
  }

  processChunk(chunk: any, index: number) {
    const { text, timestamp } = chunk;
    const [start, end] = timestamp;

    return {
      index,
      text: `${text.trim()}`,
      start: Math.round(start),
      end: Math.round(end) || Math.round(start + 0.9 * this.stride_length_s),
    };
  }
}

function createResultMessage(
  result: any,
  isDone: boolean,
  completedUntilTimestamp: number
) {
  self.postMessage({
    type: MessageTypes.RESULT,
    result,
    isDone,
    completedUntilTimestamp,
  });
}

function createPartialResultMessage(result: any) {
  self.postMessage({
    type: MessageTypes.RESULT,
    result,
  });
}
