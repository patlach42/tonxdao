import "./App.css";
import { NavLink } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import React from "react";
import { Renderer } from "./Clicker.tsx";

export function ShaderTest() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <main
          className="flex-1 relative"
          style={{ backgroundColor: "#111111" }}
        >
          <div className="absolute left-0 right-0 top-0 bottom-12 z-10 flex flex-col items-stretch">
            <Canvas flat>
              <Renderer isTouching={true} coins={1000} />
            </Canvas>
          </div>
        </main>
      </div>
    </>
  );
}
