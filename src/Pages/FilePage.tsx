import React from "react";
import { Button } from "../Components/Button";
import { FaPen } from "react-icons/fa6";

interface FilePageProps {
  setAudioStream: React.Dispatch<React.SetStateAction<any>>;
  file: File | null;
  handleAudioReset: () => void;
}

const FilePage: React.FC<FilePageProps> = ({
  file,
  setAudioStream,
  handleAudioReset,
}) => {
  return (
    <main className="flex flex-col gap-4 justify-center items-center flex-grow">
      <h1 className="text-5xl sm:text-7xl font-semibold ">
        Uploaded <span className="text-secondary">file</span>
      </h1>
      <section className=" flex flex-col gap-4 justify-center items-center mt-8 max-w-96 w-full">
        <div>
          <h3 className="font-semibold text-xl text-secondary"> Name:</h3>{" "}
          <p className="text-primary-50">{file ? file.name : "Recorded audio"}</p>
        </div>
        <div className="w-full flex flex-row justify-between mt-8">
            <Button onClick={handleAudioReset} className="text-red-500 border-red-500 shadow-red-900 hover:border-secondary hover:shadow-secondary"> Reset </Button>
            <Button className="gap-4"> Transcribe <FaPen />            </Button>
        </div>
      </section>
    </main>
  );
};

export { FilePage };
