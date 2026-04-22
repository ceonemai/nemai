import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import WhyNEM from "./components/WhyNEM/WhyNEM";
import Mission from "./components/Mission/Mission";
import Backbone from "./components/Backbone/Backbone";
import Blockchain from "./components/Blockchain/Blockchain";
import NumiPFP from "./components/NumiPFP/NumiPFP";
import PrivacyPolicies from "./components/Footer/PrivacyPolicies";
import TermsOfService from "./components/Footer/TermsOfService";

function HomePage() {
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/numipfp" element={<NumiPFP />} />
      <Route 
        path="/privacy-policies" 
        element={
          <>
            <Navbar />
            <PrivacyPolicies />
            <Footer />
          </>
        } 
      />
      <Route 
        path="/terms-of-service" 
        element={
          <>
            <Navbar />
            <TermsOfService />
            <Footer />
          </>
        } 
      />
    </Routes>
  );
}

export default App;