import { useState } from "react";
import { Header } from "./Components/Header";
import { HomePage } from "./Pages/HomePage";
import { FilePage } from "./Pages/FilePage";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioStream, setAudioStream] = useState<null | any>(null);
  const isAudioUploaded = file || audioStream;

  function handleAudioReset(){
    setFile(null)
    setAudioStream(null)
  }

  return (
    <div className="flex flex-col p-8 h-full">
      <Header />
      {isAudioUploaded ? (
        <FilePage handleAudioReset={handleAudioReset} file={file} setAudioStream={setAudioStream} />
      ) : (
        <HomePage setFile={setFile} setAudioStream={setAudioStream} />
      )}
    </div>
  );
};

export default App;
