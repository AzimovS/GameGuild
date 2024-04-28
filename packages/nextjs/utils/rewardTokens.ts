import { notification } from "./scaffold-eth";

export const rewardTokens = async (address: string, tokens: string) => {
  try {
    const res = await fetch("/api/reward", {
      method: "POST",
      body: JSON.stringify({ address, tokens }),
    });
    const resData = await res.json();
    if (resData.success) {
      //   notification.success("ETH was sent");
    } else {
      notification.error(resData?.error?.reason);
    }
  } catch (e) {
    console.log(e);
    notification.error("We couldn't send tokens. Something went wrong.");
  }
};
