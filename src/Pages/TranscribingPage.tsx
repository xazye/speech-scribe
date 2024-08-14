import React from "react";

const TranscribingPage: React.FC = ({ downloading }) => {
  return (
    <main className="flex flex-col gap-4 justify-center items-center flex-grow">
      <h1 className="text-4xl sm:text-7xl font-semibold z-10 ">Transcribing
        {[0,1,2].map((i) => (
          <span key={i} className="text-secondary dot">
            .
          </span>
        ))}
        </h1>
      <section className="flex flex-col gap-4 justify-center items-center max-w-96 w-full">
        <p className="z-10 sm:text-2xl flex flex-row justify-center items-center gap-2 bg-gradient-to-r from-white  to-primary-600 text-transparent bg-clip-text mb-8 animate-pulse">
          {true ? "Unleashing the digital genie" : "Transcribing"}
        </p>
          <div >
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
      </section>
    </main>
  );
};

export { TranscribingPage };
