import { useCallback } from "react";
import { state } from "./state.tsx";
import { LoginService, BoostsService } from "./client";

export function Boosts() {
  const onClickRestoreEnergy = useCallback(() => {
    BoostsService.boostsBoost({ requestBody: { slug: "energy" } }).then(() => {
      LoginService.loginProfile().then((response) => {
        state.setProfile(response);
      });
    });
  }, []);
  const boosts = [
    {
      icon: "⚡️",
      name: "Energy Boost",
      description: "Restore all your energy instantly.",
      onclick: onClickRestoreEnergy,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl sora-bold text-center mt-2 mb-4 text-white">
        Boosts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boosts.map((boost, index) => (
          <div
            key={index}
            className="text-white rounded-lg p-4 shadow-md m-4"
            style={{ backgroundColor: "#2d2d2d" }}
            onClick={boost.onclick}
          >
            <div className="flex-row flex items-center poppins-semi-bold">
              <div className="text-3xl mb-2 mr-2">{boost.icon}</div>
              <h2 className="text-xl font-bold mb-2">{boost.name} (1/1)</h2>
            </div>
            <p className="text-sm">{boost.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
