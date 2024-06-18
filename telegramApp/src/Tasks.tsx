export function Tasks() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">Tasks Screen</h1>
      <ul className="w-full max-w-md space-y-4 p-4">
        <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <span>Invite 10 friends</span>
          <button className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Complete
          </button>
        </li>
        <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <span>Subscribe to Twitter</span>
          <button className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Complete
          </button>
        </li>
        <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <span>Reach Level 5</span>
          <button className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Complete
          </button>
        </li>
        <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <span>Collect 100 coins</span>
          <button className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Complete
          </button>
        </li>
        <li className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
          <span>Share on Facebook</span>
          <button className="px-4 py-1 bg-blue-500 text-white rounded-lg">
            Complete
          </button>
        </li>
      </ul>
    </div>
  );
}
