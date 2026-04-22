import React, { useEffect } from "react";
import "./TermsOfService.css";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-content-wrapper">
        <div className="legal-header">
          <h1>Terms of Service for NEM AI</h1>
          <p className="last-updated">Last Updated: April 2026</p>
        </div>
        
        <div className="legal-body">
          <section>
            <h2>1. Introduction</h2>
            <p>Welcome to NEM AI (“we”, “our”, or “us”).</p>
            <p>
              These Terms of Service (“Terms”) govern your access to and use of the NEM AI platform, including our website, applications, and services. By using NEM AI, you agree to these Terms. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>NEM AI provides AI-powered health guidance and decision-support tools, including but not limited to:</p>
            <ul>
              <li>Symptom analysis and triage</li>
              <li>Personalized health insights</li>
              <li>Educational health content</li>
            </ul>
            <p>
              NEM AI is designed to support users in making better health decisions, but it is not a medical service provider.
            </p>
          </section>

          <section>
            <h2>3. No Medical Advice</h2>
            <p><strong>NEM AI does not provide medical advice, diagnosis, or treatment.</strong></p>
            <ul>
              <li>The information provided is for informational and guidance purposes only.</li>
              <li>It should not be used as a substitute for professional medical advice.</li>
              <li>Always consult a qualified healthcare professional for medical concerns.</li>
              <li>In case of emergency, please contact your local emergency services immediately.</li>
            </ul>
          </section>

          <section>
            <h2>4. User Responsibilities</h2>
            <p>
              By using NEM AI, you agree to:
            </p>
            <ul>
              <li>Provide accurate and truthful information</li>
              <li>Use the platform responsibly</li>
              <li>Not misuse or attempt to disrupt the system</li>
            </ul>
            <p>You are responsible for any actions taken based on the guidance provided by NEM AI.</p>
          </section>

          <section>
            <h2>5. Account & Access</h2>
            <p>If you create an account:</p>
            <ul>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You must not share your credentials with others</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2>6. Data & Privacy</h2>
            <p>Your use of NEM AI is also governed by our Privacy Policy.</p>
            <ul>
              <li>Personal health data is used to provide personalized guidance</li>
              <li>We prioritize user privacy and data security</li>
              <li>Data is not sold to third parties</li>
            </ul>
          </section>

          <section>
            <h2>7. AI Limitations</h2>
            <p>NEM AI uses artificial intelligence, which may:</p>
            <ul>
              <li>Produce incomplete or inaccurate outputs</li>
              <li>Not account for all individual factors</li>
            </ul>
            <p>Users should apply judgment and seek professional advice when necessary.</p>
          </section>

          <section>
            <h2>8. Intellectual Property</h2>
            <p>All content, technology, and materials related to NEM AI are owned by or licensed to us. You may not:</p>
            <ul>
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Reverse-engineer or misuse the platform</li>
            </ul>
          </section>

          <section>
            <h2>9. Third-Party Services</h2>
            <p>NEM AI may integrate with or rely on third-party services (e.g., infrastructure, APIs). We are not responsible for:</p>
            <ul>
              <li>Third-party content</li>
              <li>External services or failures</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law:</p>
            <ul>
              <li>NEM AI is provided “as is”</li>
              <li>We are not liable for any direct or indirect damages resulting from the use of the platform</li>
            </ul>
            <p>This includes decisions made based on AI-generated guidance.</p>
          </section>

          <section>
            <h2>11. Termination</h2>
            <p>We may suspend or terminate access if:</p>
            <ul>
              <li>You violate these Terms</li>
              <li>Misuse the platform</li>
            </ul>
            <p>Users may stop using NEM AI at any time.</p>
          </section>

          <section>
            <h2>12. Changes to Terms</h2>
            <p>We may update these Terms from time to time. Continued use of NEM AI means you accept the updated Terms.</p>
          </section>

          <section>
            <h2>13. Governing Law</h2>
            <p>These Terms shall be governed by the laws of Thailand.</p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>If you have any questions, please contact us at: <a href="mailto:ceonemai@gmail.com">ceonemai@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}