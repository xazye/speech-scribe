import React from "react";
import { Button } from "./Button";
import { FaPlus } from "react-icons/fa6";

const Header: React.FC = () => {
  return (
    <>
      <header className="flex flex-row justify-between">
        <a href="/">
          <h2 className="text-2xl font-bold">
            Speech<span className="text-secondary">Scribe</span>
          </h2>
        </a>
        <a href="/">
          <Button className="gap-4">
            {/* <button className="text-xl flex gap-2 items-center"> */}
            New
            <FaPlus />
            {/* </button> */}
          </Button>
        </a>
      </header>
    </>
  );
};
export { Header };
