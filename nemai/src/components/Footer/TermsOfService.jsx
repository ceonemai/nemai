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
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: October 29, 2026</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to NEM AI. These Terms of Service (&quot;Terms&quot;)
              govern your access to and use of the website, mobile applications,
              AI features, and other online services (collectively, the
              &quot;Services&quot;) provided by NEM AI (&quot;Company,&quot;
              &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), based in
              Bangkok, Thailand.
            </p>
            <p>
              By creating an account, accessing, or using our Services, you agree
              to be bound by these Terms and our Privacy Policy incorporated
              herein by reference. If you do not agree to these Terms or the
              Privacy Policy, you must not access or use the Services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility and Age Restrictions</h2>
            <ul>
              <li>
                <strong>Minimum Age:</strong> The Services are not intended for
                or directed to children under 13 years of age. If you are under
                13, you are strictly prohibited from using the Services.
              </li>
              <li>
                <strong>Minor Users (Ages 13–17):</strong> Users between the
                ages of 13 and 17 may access only non-age-restricted features.
              </li>
              <li>
                <strong>Age-Restricted Features:</strong> Certain
                features—including access to sensitive health metrics, financial
                transactions, paid subscriptions, and advanced NEM AI
                Intelligence capabilities—are restricted strictly to users who
                are 18 years of age or older.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Medical Disclaimer – No Medical Advice</h2>
            <ul>
              <li>
                <strong>Informational Purposes Only:</strong> NEM AI and its AI
                feature, NEM Intelligence, provide automated health guidance,
                workout insights, and health scores for informational and
                educational purposes only.
              </li>
              <li>
                <strong>Not Medical Advice:</strong> The Services do not
                constitute medical advice, diagnosis, treatment, or clinical
                recommendations, and do not establish a doctor-patient
                relationship.
              </li>
              <li>
                <strong>Emergency Situations:</strong> The Services must never
                be used in emergency medical situations. If you experience a
                medical emergency, immediately contact your local emergency
                services or a qualified medical professional.
              </li>
              <li>
                <strong>Consultation with Healthcare Providers:</strong> Always
                seek the advice of a physician or licensed healthcare
                professional regarding any medical condition, dietary plan, or
                fitness program.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. NEM Intelligence & Generative AI Features</h2>
            <ul>
              <li>
                <strong>Optional Feature:</strong> NEM Intelligence is an
                optional generative AI feature that provides personalized health
                coaching. You must actively enable this feature on your account.
              </li>
              <li>
                <strong>AI Output Disclaimers:</strong> AI-generated responses
                are derived from user inputs, activity history, and connected
                health data. Generative AI outputs may occasionally be
                inaccurate, incomplete, or delayed. You acknowledge and accept
                that relying on AI guidance is at your sole risk.
              </li>
              <li>
                <strong>Third-Party Providers:</strong> When enabled, minimized
                and pseudonymized health information is processed via our
                trusted AI inference partners (e.g., Google Vertex AI/Gemini,
                Anthropic, OpenAI, etc.) strictly to generate coaching
                responses. Our AI partners are contractually prohibited from
                using your data to train public models.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Account Registration and Security</h2>
            <ul>
              <li>
                <strong>Account Creation:</strong> To access full features, you
                must register an account and provide accurate, current profile
                information.
              </li>
              <li>
                <strong>Security & Credentials:</strong> You are responsible
                for maintaining the confidentiality of your credentials and for
                all activities that occur under your account. You agree to
                notify us immediately at{" "}
                <a href="mailto:info@nemai.io">info@nemai.io</a> if you suspect
                unauthorized access.
              </li>
              <li>
                <strong>Account Deletion:</strong> You may terminate your
                account and request data deletion at any time in the app via
                Settings &gt; Account &gt; Delete Account or by contacting{" "}
                <a href="mailto:info@nemai.io">info@nemai.io</a>.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Subscriptions, Payments, and Billing</h2>
            <ul>
              <li>
                <strong>Paid Features & Billing:</strong> Certain aspects of
                the Services require paid subscriptions. Subscription fees are
                processed securely via third-party payment processors (such as
                Stripe or App Store / Google Play billing).
              </li>
              <li>
                <strong>Automatic Renewal:</strong> Subscriptions automatically
                renew at the end of each billing cycle unless cancelled prior
                to the renewal date.
              </li>
              <li>
                <strong>Refunds:</strong> All payments are non-refundable
                except where required by applicable law.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Referral and Rewards Program</h2>
            <ul>
              <li>
                <strong>Program Rules:</strong> NEM AI may offer a Referral and
                Rewards Program allowing users to earn rewards or points by
                inviting new users using unique referral codes.
              </li>
              <li>
                <strong>Prohibited Conduct:</strong> Fraudulent referrals,
                self-referrals, spamming, or abuse of the referral system will
                result in immediate forfeiture of rewards and account
                suspension.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. User Conduct and Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>
                Use the Services for any unlawful purpose or in violation of
                local laws (including Thailand laws).
              </li>
              <li>
                Reverse engineer, decompile, scrape, or extract source code or
                underlying AI models of the Services.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation.
              </li>
              <li>
                Upload or transmit viruses, malware, or harmful automated
                scripts.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>9. Intellectual Property Rights</h2>
            <p>
              All content, software, branding, trademarks, algorithms, and
              design elements within the Services are the exclusive intellectual
              property of NEM AI or its licensors. Except for the limited
              personal, non-exclusive license granted to you to use the app, no
              rights or titles are transferred to you.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Privacy and Data Protection (PDPA)</h2>
            <p>
              Your privacy is governed by our Privacy Policy. For users in
              Thailand, Personal Data handling strictly complies with the
              Thailand Personal Data Protection Act B.E. 2562 (2019) (PDPA).
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Limitation of Liability and Disclaimers</h2>
            <ul>
              <li>
                <strong>As-Is Basis:</strong> The Services are provided on an
                &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without
                warranties of any kind, whether express or implied.
              </li>
              <li>
                <strong>Liability Cap:</strong> To the maximum extent permitted
                by applicable law, NEM AI shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or
                loss of health data, profits, or goodwill.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of Thailand, without regard to conflict of law principles.
              Any legal disputes or claims arising out of or in connection with
              these Terms shall be subject to the exclusive jurisdiction of the
              competent courts in Bangkok, Thailand.
            </p>
          </section>

          <section className="legal-section contact-section">
            <h2>13. Contact Information</h2>
            <p>
              If you have questions or concerns regarding these Terms of
              Service, please contact us at:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@nemai.io">info@nemai.io</a>
              </li>
              <li>
                <strong>Address:</strong> NEM AI 7/41-42, Bangkhen, Bangkok,
                Thailand
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
