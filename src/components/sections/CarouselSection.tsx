import AutoProgressCarousel from "@/components/AutoProgressCarousel";

export default function CarouselSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <AutoProgressCarousel />

        <h1 className="text-4xl font-bold text-center mt-12">
          Track Your Daily Growth
        </h1>
      </div>
    </section>
  );
}
