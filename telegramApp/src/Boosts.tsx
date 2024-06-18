export function Boosts() {
  const boosts = [
    {
      icon: "⚡️",
      name: "Speed Boost",
      description: "Increase your speed instantly.",
    },
    {
      icon: "🚀",
      name: "Rocket Boost",
      description: "Blast off with rocket speed.",
    },
    {
      icon: "🔥",
      name: "Fire Boost",
      description: "Feel the heat and boost your performance.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold text-center mb-4">Boosts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boosts.map((boost, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-3xl mb-2">{boost.icon}</div>
            <h2 className="text-xl font-bold mb-2">{boost.name}</h2>
            <p className="text-gray-600">{boost.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
