

import HeroSection from "@/components/sections/HeroSection";
import CarouselSection from "@/components/sections/CarouselSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import WhySection from "@/components/sections/WhySection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import CTASection from "@/components/sections/CTASection";

export const metadata = {
  title: "Task Tracker – Build Consistency & Track Daily Progress",
  description:
    "Task Tracker helps you build daily discipline with streak tracking, analytics, and goal management.",
};

export default function HomePage() {
  return (
    <div className="text-white bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 min-h-screen">

      <div className="max-w-7xl mx-auto px-6 py-2 grid md:grid-cols-2 gap-16 items-center">

        <HeroSection />

        <CarouselSection />
        

      </div>
      

      <FeaturesSection />
            <HowItWorksSection />

      <WhySection />
      <CTASection />

    </div>
  );
}
