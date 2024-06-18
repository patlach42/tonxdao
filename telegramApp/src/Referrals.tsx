export function Referrals() {
  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Referrals</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your referral link"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
          Copy
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Referral</th>
            <th className="p-2">Token</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">User123</td>
            <td className="p-2">ABC123</td>
          </tr>
          <tr>
            <td className="p-2">User456</td>
            <td className="p-2">DEF456</td>
          </tr>
          <tr>
            <td className="p-2">User789</td>
            <td className="p-2">GHI789</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
