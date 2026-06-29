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
          <p className="last-updated">Last Updated: June 10, 2026</p>
        </div>

        <div className="legal-body">
          <p>
            Welcome to NEM AI! These Terms of Service ("Terms") govern your use of
            the NEM AI website, mobile application, and related software
            (collectively, the "Services").
          </p>
          <p>
            Currently, NEM AI is an unregistered business project based in Bangkok,
            Thailand. In these Terms, "Company", "we", "us", or "NEM AI" refers to
            the individual founders and operators of the project. By accessing or
            using our Services, you agree to be bound by these Terms. If you do not
            agree, you must immediately stop using the Services.
          </p>

          <section className="legal-section">
            <h2>1. Medical Disclaimer & AI-Generated Content</h2>
            <p>
              NEM AI is an artificial intelligence platform focused on medical
              emergency guidance and health intelligence. It is designed to act
              strictly as a decision support tool to help guide you when you are
              feeling unwell.
            </p>
            <ul>
              <li>
                Not Medical Advice: AI-generated content may contain errors and does
                not constitute medical advice, diagnosis, or treatment.
              </li>
              <li>
                No Doctor-Patient Relationship: Using NEM AI does not create a
                healthcare professional relationship between you and us.
              </li>
              <li>
                Emergency: Never disregard professional medical advice or delay
                seeking it because of information provided by NEM AI. If you are
                experiencing a medical emergency, dial 1669 (in Thailand) or your
                local emergency number immediately.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility and Accounts</h2>
            <p>By using our Services, you represent and warrant that:</p>
            <ul>
              <li>
                You are at least 18 years of age. If you are between 13 and 17 years
                old, you must have verifiable consent from a parent or legal guardian.
              </li>
              <li>
                You are not located in a country subject to trade sanctions or
                embargoes enforced by the United Nations or the Thai government.
              </li>
              <li>
                You are responsible for keeping your account credentials secure and
                are liable for all activities under your account.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Restrictions on Use</h2>
            <p>You agree that you will not:</p>
            <ul>
              <li>
                Reverse engineer, decompile, copy, or create derivative works of the
                Services.
              </li>
              <li>
                Probe, breach, or circumvent any security or authentication measures.
              </li>
              <li>
                Use automated tools, bots, or scripts to access the Services or
                generate fake referrals.
              </li>
              <li>
                Publish or share material that is unlawful, infringing, sexually
                explicit, violent, or defamatory.
              </li>
              <li>
                Use the Services for fraudulent activities or in violation of any
                applicable laws, including Thailand's Computer-Related Crime Act.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Privacy and Data</h2>
            <p>
              Your use of the Services is subject to our Privacy Policy, which
              explains how we collect, use, and protect your data in accordance with
              Thailand's Personal Data Protection Act (PDPA). By using the Services,
              you consent to our data practices and the use of essential tracking
              technologies.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Subscriptions and Payments</h2>
            <p>
              If you purchase a NEM AI Pro subscription through an external platform
              (like the Apple App Store), that platform's terms will govern the
              transaction. Subscriptions automatically renew unless canceled prior to
              the renewal date. To cancel, you must manage your subscription directly
              through the settings of the external platform you used to purchase it.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Referral and Rewards Program</h2>
            <p>
              We may offer a rewards program for inviting new users. Rewards have no
              cash value and cannot be exchanged for cash. We reserve the right to
              verify referrals, withhold rewards for suspected abuse, or terminate the
              program at any time. You are solely responsible for any personal tax
              obligations arising from rewards under Thai law.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Disclaimers and Limitation of Liability</h2>
            <ul>
              <li>
                "As Is" Service: The Services are provided "as is" without warranties
                of any kind, whether express or implied, including accuracy,
                reliability, or fitness for a particular purpose.
              </li>
              <li>
                Liability Limit: To the maximum extent permitted by law, NEM AI and
                its operators shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of the
                Services, including loss of data or physical/emotional harm. Our total
                liability to you for any claims will not exceed the amount you paid to
                us in the six (6) months preceding the claim.
              </li>
              <li>
                Third-Party Services: We rely on third-party technology and services
                (including AI models) to provide our Services. We are not responsible
                for the availability, accuracy, or content provided by these third-
                party service providers.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Term, Termination, and Modifications</h2>
            <p>
              We reserve the right to modify these Terms, change pricing, or
              suspend/terminate your access to the Services at any time, for any
              reason, without prior notice. Continued use of the Services after
              modifications constitutes your acceptance of the updated Terms. We will
              provide reasonable notice of any material changes to these Terms via our
              website or email notification.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the
              laws of Thailand. Any disputes arising under or in connection with these
              Terms shall be subject to the exclusive jurisdiction of the courts
              located in Bangkok, Thailand.
            </p>
          </section>

          <section className="legal-section contact-section">
            <h2>10. Contact Us</h2>
            <p>
              For questions, support, or to report a violation of these Terms, please
              contact us:
            </p>
            <ul>
              <li>
                Email: <a href="mailto:info@nemai.io">info@nemai.io</a>
              </li>
              <li>Support Hours: Monday to Friday, 10:00 AM - 6:00 PM (GMT+7)</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}