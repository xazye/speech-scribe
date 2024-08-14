import { useEffect, useRef, useState } from "react";
import { Header } from "./Components/Header";
import { HomePage } from "./Pages/HomePage";
import { FilePage } from "./Pages/FilePage";
import { InformationPage } from "./Pages/InformationPage";
import { TranscribingPage } from "./Pages/TranscribingPage";
import { MessageTypes } from "./utils/presets";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioStream, setAudioStream] = useState<null | any>(null);
  const [output, setOutput] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const isAudioUploaded = file || audioStream;

  const worker = useRef<Worker | null>(null);

  async function handleFormSubmission() {
    if (!file && !audioStream) {
      return;
    }

    try {
      let audio = await readAudioFrom(file ? file : audioStream);
      const model_name = 'Xenova/whisper-tiny.en';
      worker.current?.postMessage({
        type: MessageTypes.INFERENCE_REQUEST,
        audio,
        model_name,
      });
    } catch (err) {
      console.error("Error during form submission:", err);
    }
  }

  async function readAudioFrom(fileOrStream: any) {
    try {
      const samplerate = 16000;
      const audiocontext = new AudioContext({
        sampleRate: samplerate,
      });
      const response = await fileOrStream.arrayBuffer();
      const decoded = await audiocontext.decodeAudioData(response);
      // mono channel
      const audio = decoded.getChannelData(0);
      return audio;
    } catch (err) {
      console.error("Error reading audio:", err);
      throw err;
    }
  }

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(
        new URL("./utils/whisper.worker.ts", import.meta.url),
        {
          type: "module",
        }
      );
    }

    const onMessageReceived = async (event: MessageEvent) => {
      switch (event.data.type) {
        case "DOWNLOADING":
          setDownloading(true);
          console.log("DOWNLOADING");
          break;
        case "LOADING":
          setLoading(true);
          console.log("LOADING");
          break;
        case "RESULT":
          setOutput(event.data.result);
          console.log("result",event.data.result);
          break;
        case "INFERENCE_DONE":
          setFinished(true);
          console.log("DONE");
          break;
        default:
          console.warn("Unknown message type:", event.data.type);
      }
    };
    worker.current.addEventListener("message", onMessageReceived);
    return () => {
      worker.current?.removeEventListener("message", onMessageReceived);
    };
  }, []);

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
  }

  return (
    <div className="flex flex-col p-8 h-full">
      <Header />
      {output ? (
        <InformationPage output={output} />
      ) : loading ? (
        <TranscribingPage />
      ) : isAudioUploaded ? (
        <FilePage
          handleFormSubmission={handleFormSubmission}
          handleAudioReset={handleAudioReset}
          file={file}
          setAudioStream={setAudioStream}
        />
      ) : (
        <HomePage setFile={setFile} setAudioStream={setAudioStream} />
      )}
    </div>
  );
};

export default App;
