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
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: June 10, 2026</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy describes how NEM AI ("we", "us", "our", or the
              "Project") collects, uses, maintains, and discloses information about
              you when you visit our website, use our mobile application, and interact
              with our online services (the "Services"). Currently, NEM AI operates as
              an unregistered business project based in Bangkok, Thailand. NEM AI
              provides emergency decision-support and first-aid guidance only. It is
              not intended to replace professional medical diagnosis, treatment, or
              hospital care.
            </p>
            <p>
              By accessing or using the Services, you accept and agree to this Privacy
              Policy and our Terms of Service. If you do not agree to this Privacy
              Policy, you must not access or use the Services.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Personal Information We Collect</h2>
            <p>
              We collect information that identifies or could reasonably be linked to
              you ("Personal Information").
            </p>
            <h3>A. Information You Provide to Us:</h3>
            <ul>
              <li>
                Profile Data: First and last name, email address, username, password,
                and photographs.
              </li>
              <li>
                User-Generated Data: Logs, dietary information, activity history, and
                conversations with the NEM AI Chatbot.
              </li>
              <li>
                Payment Data: Transaction history. (Note: We do not collect or store
                full payment card numbers. Purchases made via external platforms like
                Apple are processed securely under their respective privacy policies).
              </li>
            </ul>
            <h3>B. Health Information:</h3>
            <p>
              With your permission, we connect to third-party applications (like Apple
              Health or Oura) to import biometric data such as heart rate, sleep
              information, blood oxygen levels, and test results ("Health
              Information"). We are not a healthcare provider, and the Services should
              not be used to store highly sensitive medical information beyond what is
              necessary to use our platform.
            </p>
            <h3>C. Information Collected Automatically:</h3>
            <p>
              We automatically collect device data (IP address, operating system) and
              usage data via cookies, SDKs, and similar tracking technologies (e.g.,
              Google Analytics, Mixpanel) to operate the Services, analyze usage, and
              support marketing.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. How We Store and Process Your Information</h2>
            <ul>
              <li>
                General Data: Profile and user-generated data are stored securely on
                third-party cloud hosting infrastructure to sync across your devices.
              </li>
              <li>
                Health Information: By default, imported Health Information is
                processed locally on your device.
              </li>
              <li>
                NEM AI Chatbot: If you use our AI features, relevant Health
                Information (excluding reproductive health data unless explicitly opted
                in) is transmitted to third-party cloud hosting and Large Language
                Model (LLM) partners to generate AI-powered insights.
              </li>
            </ul>
            <p>
              By using the Services, you consent to having your Personal Information
              transferred to and processed on secure cloud infrastructure, which may be
              located outside of Thailand. We rely on standard contractual clauses to
              ensure the protection of your data.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. How We Use Your Information</h2>
            <p>We use your Personal Information to:</p>
            <ul>
              <li>Provide and improve the Services.</li>
              <li>Generate health insights and run analysis.</li>
              <li>Provide customer support and communicate with you.</li>
              <li>Ensure platform security and prevent fraud.</li>
              <li>
                Engagement Data: We use data regarding your interactions with
                educational content, quizzes, and videos to track your progress and
                calculate ecosystem incentives (points).
              </li>
            </ul>
            <p>
              We do not sell your Personal Information, nor do we use your Health
              Information for advertising or marketing purposes.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. How We Share Your Information</h2>
            <p>We only share your information in the following circumstances:</p>
            <ul>
              <li>
                Service Providers: With trusted vendors who provide cloud hosting,
                analytics, and AI technology (strictly limited to what is necessary).
              </li>
              <li>
                Legal Compliance: When required by law, regulation, or legal process
                to protect the rights, property, or safety of NEM AI, our users, or
                others.
              </li>
              <li>
                Business Transfers: In connection with a future corporate transaction
                (e.g., when the NEM AI project officially registers as a company or is
                acquired).
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. NEM AI Chatbot</h2>
            <p>
              The NEM AI Chatbot leverages third-party LLM providers. By interacting
              with the Chatbot, you authorize us to transmit necessary data (including
              Health Information) to generate responses. We minimize direct
              identifiability when sharing this data. You may disable the Chatbot at
              any time, but past conversation data may remain in our systems until you
              delete it or request deletion.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights and Choices</h2>
            <p>
              Under Thailand's Personal Data Protection Act (PDPA), you have the right
              to:
            </p>
            <ul>
              <li>
                Access: Request a copy of the Personal Information we hold about you.
              </li>
              <li>Correction: Request that we correct inaccurate data.</li>
              <li>
                Erasure: Request that we delete your Personal Information, subject to
                certain legal exceptions (e.g., if we need it to prevent fraud or
                comply with the law).
              </li>
              <li>
                Withdraw Consent: Withdraw your consent for data processing at any
                time.
              </li>
            </ul>
            <p>
              You can manage your data, opt out of marketing emails, and adjust your
              cookie preferences through your account settings or your device browser.
              To exercise your privacy rights, please email us at{" "}
              <a href="mailto:info@nemai.io">info@nemai.io</a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Data Retention</h2>
            <p>
              We retain your Personal Information for as long as your account is
              active, or as necessary to fulfill the purposes outlined in this Policy.
              Chat history is retained until you delete it. Aggregated and anonymized
              data may be kept indefinitely for product improvement.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Minor Users</h2>
            <p>
              Our Services are not intended for children under 13, and we do not
              knowingly collect data from them. Users between 13 and 17 may use the
              platform only with verifiable parental consent, as required by Thai law.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material
              changes, we will notify you by posting an announcement on the Services or
              sending you an email. Your continued use of the Services after
              modifications constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section className="legal-section contact-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy
              Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:info@nemai.io">info@nemai.io</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}