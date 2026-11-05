import HeroSlider from "@/components/HeroSlider";
import NewArrivals from "@/components/NewArrivals";
import PopularCategories from "@/components/PopularCategories";
import WhyChooseUs from "@/components/WhyChooseUs";
import AuthTest from "@/components/AuthTest";
import JwtTest from "@/components/JwtTest";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      {/* <JwtTest />
      <AuthTest /> */}
      <HeroSlider />
      <NewArrivals />
      <PopularCategories />
      <WhyChooseUs />
    </main>
  );
}