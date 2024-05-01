import HomeHero from "./_component/HomeHero";

export const dynamic = 'force-dynamic'
export default function HomePage() {
  return (
    <div className="container lg:w-[1120px] mx-auto">
      <HomeHero/>
    </div>
  );
}
