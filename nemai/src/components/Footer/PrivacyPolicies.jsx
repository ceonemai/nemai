import React, { useEffect } from "react";
import "./PrivacyPolicies.css";

export default function PrivacyPolicies() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-content-wrapper">
        <div className="legal-header">
          <h1>Privacy Policy for NEM AI</h1>
          <p className="last-updated">Last Updated: April 2026</p>
        </div>
        
        <div className="legal-body">
          <section>
            <h2>1. Introduction</h2>
            <p>NEM AI (“we”, “our”, or “us”) is committed to protecting your privacy and ensuring the security of your personal information.</p>
            <p>
              This Privacy Policy explains how we collect, use, store, and protect your data when you use our platform. By using NEM AI, you agree to the terms outlined in this policy.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <p><strong>a. Personal Health Data (PHD)</strong></p>
            <ul>
              <li>Medical history</li>
              <li>Allergies</li>
              <li>Medications</li>
              <li>Other health-related information you choose to provide</li>
            </ul>
            <p><strong>b. Usage Data</strong></p>
            <ul>
              <li>Interactions with the chatbot</li>
              <li>Features used within the platform</li>
              <li>Device and session information</li>
            </ul>
            <p><strong>c. Account Information</strong></p>
            <ul>
              <li>Email address or login details (if applicable)</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide personalized health guidance</li>
              <li>Improve the accuracy and performance of NEM AI</li>
              <li>Enhance user experience</li>
              <li>Analyze system performance and usage patterns</li>
            </ul>
            <p>Your Personal Health Data is used only to provide personalized recommendations for you.</p>
          </section>

          <section>
            <h2>4. Data Privacy & Security</h2>
            <p>We take data privacy seriously:</p>
            <ul>
              <li>Personal health data is stored securely</li>
              <li>Sensitive data is not shared publicly</li>
              <li>We implement appropriate security measures to protect your information</li>
              <li>We do not sell your personal data.</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>We do not share your personal data with third parties except:</p>
            <ul>
              <li>When required by law</li>
              <li>When necessary to operate the platform (e.g., infrastructure providers)</li>
              <li>With your explicit consent</li>
            </ul>
            <p>Any shared data will be handled securely and responsibly.</p>
          </section>

          <section>
            <h2>6. Health Data & AI Usage</h2>
            <p>NEM AI uses your data to provide AI-generated guidance and insights.</p>
            <p><strong>Important:</strong></p>
            <ul>
              <li>NEM AI does not replace professional medical advice</li>
              <li>Users should consult healthcare professionals when necessary</li>
            </ul>
          </section>

          <section>
            <h2>7. Data for Model Improvement</h2>
            <p>With your consent, anonymized and aggregated data may be used to:</p>
            <ul>
              <li>Improve AI models</li>
              <li>Enhance system accuracy</li>
              <li>Support research and development</li>
            </ul>
            <p>This data will not identify you personally.</p>
          </section>

          <section>
            <h2>8. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your data</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2>9. Data Retention</h2>
            <p>We retain your data only as long as necessary to provide our services and improve the platform, unless otherwise required by law.</p>
          </section>

          <section>
            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be communicated through the platform.</p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:ceonemai@gmail.com">ceonemai@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}