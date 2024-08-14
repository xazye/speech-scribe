import React, { useState } from "react";
import { Transcription } from "../Components/Transcription";
import { Translation } from "../Components/Translation";

const InformationPage: React.FC = () => {
  const [tab, setTab] = useState<string>("transcription");
  return (
    <main className="flex flex-col gap-4 justify-center items-center flex-grow">
      <h1 className="text-4xl sm:text-7xl font-semibold z-10">
        Your <span className="text-secondary">Transcription</span>
      </h1>
      <section className="flex flex-col gap-4 justify-center items-center max-w-96 w-full">
        <div className="max-w-96 w-full  grid grid-cols-2 items-center">
          <button
            className={
              " px-4 py-2 border rounded-full font-semibold border-r-0 rounded-r-none shadow-buttonLeft duration-300 " +
              (tab === "transcription"
                ? "text-black border-primary-700 shadow-primary-700 bg-primary-400 "
                : "border-secondary text-primary-300")
            }
            onClick={() => setTab("transcription")}
          >
            Transcription
          </button>
          <button
            className={
              " px-4 py-2 border rounded-full font-semibold border-l-0 rounded-l-none shadow-buttonRight duration-300 " +
              (tab === "translation"
                ? "text-black border-primary-700 shadow-primary-700 bg-primary-400 "
                : "border-secondary text-primary-300")
            }
            onClick={() => setTab("translation")}
          >
            Translation
          </button>
        </div>
        {tab === "transcription" ? <Transcription /> : <Translation />}
      </section>
    </main>
  );
};

export { InformationPage };
