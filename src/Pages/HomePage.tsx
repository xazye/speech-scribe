import React from "react";
import { Button } from "../Components/Button";
import { FaAnglesRight, FaMicrophone } from "react-icons/fa6";

interface HomePageProps {
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setAudioStream: React.Dispatch<React.SetStateAction<any>>;
}

const HomePage: React.FC<HomePageProps> = ({ setFile, setAudioStream }) => {


  
  return (
    <main className="flex flex-col gap-4 justify-center items-center flex-grow">
      <h1 className="text-7xl font-semibold ">
        Speech<span className="text-secondary">Scribe</span>
      </h1>
      <section className="flex flex-col gap-4 justify-center items-center">
        <p className="text-2xl flex flex-row justify-center items-center gap-2 bg-gradient-to-r from-white via-secondary to-primary-600 text-transparent bg-clip-text mb-8">
          {" "}
          Record <FaAnglesRight className="text-primary-400" /> Transcribe{" "}
          <FaAnglesRight className="text-primary-400" /> Translate
        </p>
        <Button className="w-full">
          Record <FaMicrophone />
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
