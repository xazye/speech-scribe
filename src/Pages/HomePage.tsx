import React, { useEffect, useRef } from "react";
import { Button } from "../Components/Button";
import { FaAnglesRight, FaMicrophone } from "react-icons/fa6";

interface HomePageProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setAudioStream: React.Dispatch<React.SetStateAction<any>>;
}

const HomePage: React.FC<HomePageProps> = ({ setFile, setAudioStream }) => {
  const [recodingStatus, setRecodingStatus] =
    React.useState<string>("inactive");
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
  const [duration, setDuration] = React.useState<number>(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const mimeType = "audio/webm";

  async function startRecord() {
    let tempStream;
    try {
      const dataStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      tempStream = dataStream;
    } catch (err) {
      console.log("error", err.message);
      return;
    }
    setRecodingStatus("recording");
    console.log(tempStream);
    const media = new MediaRecorder(tempStream);
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    console.log(mediaRecorder.current.state);
    let localAudioChunks: any = [];
    mediaRecorder.current.ondataavailable = (eve) => {
      if (typeof eve.data === "undefined") {
        return;
      }
      if (eve.data.size === 0) {
        return;
      }
      localAudioChunks.push(eve.data);
    };
    setAudioChunks(localAudioChunks);
  }

  async function stopRecord() {
    setRecodingStatus("inactive");
    console.log("stop recording");
    if (mediaRecorder.current === null) {
      return;
    }
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(audioChunks, { type: mimeType });
      setAudioStream(blob);
      setAudioChunks([]);
    };
  }

  useEffect(() => {
    if (recodingStatus === "inactive") {
      return;
    }
    const interval = setInterval(() => {
      setDuration((curr) => curr + 1);
      console.log(duration);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <main className="flex flex-col gap-4 justify-center items-center flex-grow">
      <h1 className="text-4xl sm:text-7xl font-semibold ">
        Speech<span className="text-secondary">Scribe</span>
      </h1>
      <section className="flex flex-col gap-4 justify-center items-center max-w-96 w-full">
        <p className="sm:text-2xl flex flex-row justify-center items-center gap-2 bg-gradient-to-r from-white via-secondary to-primary-600 text-transparent bg-clip-text mb-8">
          {" "}
          Record <FaAnglesRight className="text-primary-400" /> Transcribe{" "}
          <FaAnglesRight className="text-primary-400" /> Translate
        </p>
        <Button
          onClick={recodingStatus === "recording" ? stopRecord : startRecord}
          className={ recodingStatus === 'recording' ? 'text-secondary border-primary-400 shadow-primary-700 w-full' : ' w-full' }
        >
          {recodingStatus === "recording" ? "Stop Recording" : "Record"}
          <div className="flex flex-row items-center gap-4">
          {recodingStatus === "recording" ? (
            <span className="text-primary-200">
              {duration}
            </span>
          ) : (
            ""
          )}
          <FaMicrophone />
          </div>
        </Button>
        <p>
          Or upload{" "}
          <label
            className="text-primary-300 hover:cursor-pointer hover:text-secondary duration-300 "
            htmlFor="upload_file"
          >
            Upload
            <input
              onChange={(e) => {
                if (e.target.files) {
                  const tempFile = e.target.files[0];
                  setFile(tempFile);
                }
              }}
              id="upload_file"
              type="file"
              hidden
              accept=".mp3,.wav,.ogg"
            />
          </label>{" "}
          a mp3 file
        </p>
      </section>
    </main>
  );
};
export { HomePage };
