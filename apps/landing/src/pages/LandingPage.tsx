import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import About from '@/components/about';
import HowItWorks from '@/components/how-it-works';
import FAQs from '@/components/faqs';
import Footer from '@/components/footer';

export default function LandingPage() {
  return (
    <>
      <div className="py-4">
        <Navbar />
      </div>
      <div
        className="border-b border-b-[#C4C4C4] px-[33px] py-14 md:px-16.5 md:pt-[93px] lg:pl-33 lg:pr-0 lg:pb-0"
        id="home"
      >
        <Hero />
      </div>
      <div className="pt-14 md:pt-28" id="about">
        <About />
      </div>
      <div className="pt-14 pb-28 md:pt-28" id="how-it-works">
        <HowItWorks />
      </div>
      <div className="border-y border-y-[#C4C4C4] px-[33px] md:px-16.5 lg:px-33" id="faqs">
        <FAQs />
      </div>
      <div className="px-[33px] py-14 md:px-16.5 md:py-28 lg:px-33" id="footer">
        <Footer />
      </div>
    </>
  );
}
