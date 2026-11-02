import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <HeroSlider />
      <NewArrivals />
    </main>
  );
}
