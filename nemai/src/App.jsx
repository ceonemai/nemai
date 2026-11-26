import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import NumiPFP from "./components/NumiPFP/NumiPFP";
import PrivacyPolicies from "./components/Footer/PrivacyPolicies";
import TermsOfService from "./components/Footer/TermsOfService";
import BlogListPage from "./components/Blog/BlogListPage";
import BlogDetailPage from "./components/Blog/BlogDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
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