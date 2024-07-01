import React from "react";
import TricycleImage from "../assets/tricycle.png";

export const NewDaoModal: React.FC<React.PropsWithChildren> = () => {
  return (
    <>
      <div className="absolute left-0 right-0 bottom-0 top-0 bg-black bg-opacity-70 z-30"></div>
      <div
        className="absolute left-0 right-0 bottom-0 z-40 rounded-t-xl flex flex-col justify-end items-stretch text-center pt-4 pb-6"
        style={{ background: "#111111" }}
      >
        <div className="text-xl text-white sora-bold mb-2">
          Congratulations!
        </div>
        <div className="text-lg  pl-6 pr-6 " style={{ color: "#C7C7C7" }}>
          You have reached level 2!
          <br />
          Now it’s time to create a DAO and get more tokens, with friends.
        </div>
        <div className="relative">
          <img src={TricycleImage} alt="" />
          <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col pt-16">
            <div className="flex-row justify-around flex flex-1">
              <div className="h-20 w-20 rounded-full bg-blue-300"></div>
              <div className="h-20 w-20 rounded-full bg-blue-300"></div>
            </div>
            <div className="flex flex-col justify-center flex-1 w-full items-center">
              <div className="h-20 w-20 rounded-full bg-blue-300"></div>
            </div>
          </div>
        </div>

        <button
          className="text-white px-4 py-2 rounded-lg sora-bold text-base mr-6 ml-6"
          style={{ background: "#4200FF" }}
        >
          Create a DAO
        </button>
        <div className="h-5"></div>
        <div className="h-16"></div>
      </div>
    </>
  );
};
