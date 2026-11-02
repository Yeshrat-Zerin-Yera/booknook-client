import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";
import PopularCategories from "@/components/PopularCategories";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <HeroSlider />
      <NewArrivals />
      <PopularCategories />
      <WhyChooseUs />
    </main>
  );
}