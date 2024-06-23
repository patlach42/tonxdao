import { useCallback, useEffect, useState } from "react";
import { ReferrersService, ReferrerUser } from "./client";

export function Referrals() {
  const [link, setLink] = useState("");
  const [referrerList, setreferrerList] = useState<ReferrerUser[]>([]);
  useEffect(() => {
    ReferrersService.referrersReferrers().then((response) => {
      setLink(response.link);
      setreferrerList(response.list);
    });
  }, []);
  const onClickShare = useCallback(() => {
    location.href = `https://t.me/share/url?${new URLSearchParams({
      text: "Hey! I'm using Tnocoin. I'm inviting you to join me on Tnocoin. ",
      url: link,
    }).toString()}`;
  }, [link]);
  return (
    <div className="p-4 text-white">
      <div className="text-sm font-medium">Your referral link:</div>
      <div className="mb-4 flex flex-row">
        <input
          type="text"
          placeholder="Enter your referral link"
          value={link}
          className="w-full p-2 border border-gray-300 rounded-lg bg-black"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
          onClick={onClickShare}
        >
          Share
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead></thead>
        <tbody>
          {referrerList.map((i) => (
            <tr>
              <td className="p-2 w-60">{i.name}</td>
              <td className="p-2 w-20">{i.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
