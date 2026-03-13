import HeroSection from "./components/HeroSection";
import TrendingSection from "./components/TrendingSection";
import CategoriesSection from "./components/CategoriesSection";
import FeaturedSection from "./components/FeaturedSection";
import LeaderboardSection from "./components/LeaderboardSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrendingSection />
      <CategoriesSection />
      <FeaturedSection />
      <LeaderboardSection />
    </>
  );
}
