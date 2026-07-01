import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Footer from "./components/Footer/Footer";
import WhyNEM from "./components/WhyNEM/WhyNEM";
import Mission from "./components/Mission/Mission";
import Backbone from "./components/Backbone/Backbone";
import HealthInsights from "./components/HealthInsights/HealthInsights";
import NumiPFP from "./components/NumiPFP/NumiPFP";
import PrivacyPolicies from "./components/Footer/PrivacyPolicies";
import TermsOfService from "./components/Footer/TermsOfService";
import BlogListPage from "./components/Blog/BlogListPage";
import BlogDetailPage from "./components/Blog/BlogDetailPage";

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
        <HealthInsights />
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
      <Route
        path="/blog"
        element={
          <>
            <Navbar />
            <BlogListPage />
            <Footer />
          </>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <>
            <Navbar />
            <BlogDetailPage />
            <Footer />
          </>
        }
      />
    </Routes>
  );
}

export default App;