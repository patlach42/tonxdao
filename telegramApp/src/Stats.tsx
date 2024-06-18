export function Stats() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Game Stats</h1>
      <div className="flex flex-col justify-center items-center align-middle text-center gap-4">
        <div>
          <p className="text-gray-800 text-lg font-medium">Total Balance:</p>
          <p className="text-2xl font-bold text-blue-600">$5,000</p>
        </div>
        <div>
          <p className="text-gray-800 text-lg font-medium">Total Touches:</p>
          <p className="text-2xl font-bold text-green-600">10,000</p>
        </div>
        <div>
          <p className="text-gray-800 text-lg font-medium">Total Players:</p>
          <p className="text-2xl font-bold text-purple-600">500</p>
        </div>
        <div>
          <p className="text-gray-800 text-lg font-medium">Daily Users:</p>
          <p className="text-2xl font-bold text-yellow-600">1,000</p>
        </div>
        <div>
          <p className="text-gray-800 text-lg font-medium">Online Players:</p>
          <p className="text-2xl font-bold text-indigo-600">200</p>
        </div>
      </div>
    </div>
  );
}
