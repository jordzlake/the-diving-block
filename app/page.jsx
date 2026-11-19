import "./home.css";

import Banner from "@/components/main/banner/Banner";
import HomeSections from "./HomeSections";
import { getSettings } from "@/lib/settingActions";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch settings on the server so the correct banner (main and/or promo,
  // including the mobile promo image) is in the very first HTML render.
  // This prevents the original banner from flashing before the promo loads.
  let bannerSettings = null;
  try {
    const settings = await getSettings();
    bannerSettings = (settings && settings[0]) || null;
  } catch (err) {
    bannerSettings = null;
  }

  return (
    <main className="main">
      <Banner settings={bannerSettings} />
      <HomeSections />
    </main>
  );
}
