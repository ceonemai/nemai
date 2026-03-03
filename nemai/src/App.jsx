import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import WhyNEM from "./components/WhyNEM/WhyNEM";
import Mission from "./components/Mission/Mission";
import Backbone from "./components/Backbone/Backbone";
import Blockchain from "./components/Blockchain/Blockchain";

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

      <section id="mission">
        <Mission />
      </section>

      <section id="backbone">
        <Backbone />
      </section>

      <section id="blockchain">
        <Blockchain />
      </section>

      <Footer />
    </>
  );
}

export default App;