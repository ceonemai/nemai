import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import WhyNEM from "./components/WhyNEM/WhyNEM";

function App() {
  return (
  <>
    <Navbar />

    <section id="hero">
      <Hero />
    </section>

    <section id="why">
      <WhyNEM />
    </section>

    <Footer />
  </>
  );
}

export default App;