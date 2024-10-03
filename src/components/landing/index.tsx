import Footer from './footer';
import HeroSection from './hero';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
