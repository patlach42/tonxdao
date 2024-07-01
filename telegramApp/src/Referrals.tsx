import { useCallback, useEffect, useState } from "react";
import { ReferrersService, ReferrerUser } from "./client";
import { state } from "./state.tsx";

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
    <div className="p-6 text-white">
      <div
        className="text-xl font-medium mb-1 sora-bold text-center"
        style={{ color: "#ffffff" }}
      >
        Invite Friends and earn more!
      </div>
      <div
        className="text-xl font-medium mb-10 text-center"
        style={{ color: "#C7C7C7" }}
      >
        5% of earnings of your Invitees
        <br />
        will go to your profit
      </div>
      <div
        className="text-sm font-medium mb-1 sora-bold"
        style={{ color: "#C7C7C7" }}
      >
        Send your Invite link:
      </div>
      <div className="mb-4 flex flex-row">
        <input
          type="text"
          placeholder="Enter your referral link"
          value={state.profile?.referral_link}
          className="w-full p-2 rounded-lg bg-black text-sm"
          style={{ background: "#1B1B1B", color: "#C7C7C7" }}
        />
        <button
          className="text-white px-4 py-2 rounded-lg ml-2 sora-bold text-xs"
          onClick={onClickShare}
          style={{ background: "#4200FF" }}
        >
          Send
        </button>
      </div>
      <div
        className="text-sm font-medium mb-1 sora-bold"
        style={{ color: "#C7C7C7" }}
      >
        Your Invited Friends:
      </div>
      <div className="w-full flex-1 flex flex-col gap-4">
        {referrerList.slice(0, 4).map((i) => (
          <div
            className="flex flex-row rounded-md justify-between items-center p-3 text-sm"
            style={{ color: "#C7C7C7", background: "#1B1B1B" }}
          >
            <div>{i.name}</div>
            <div>{i.coins}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
