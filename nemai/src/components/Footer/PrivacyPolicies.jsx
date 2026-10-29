import React, { useEffect } from "react";
import "./PrivacyPolicies.css";

function PolicyTable({ headers, rows }) {
  return (
    <div className="legal-table-wrapper">
      <table className="legal-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPolicies() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page">
      <div className="legal-content-wrapper">
        <div className="legal-header">
          <h1>Privacy Policy - Mobile App</h1>
          <p className="last-updated">Last Updated: October 29, 2026</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              This Privacy Policy (“Privacy Policy”) describes and governs the
              manner in which NEM AI (“we,” “us,” “our,” or the “Company”)
              collects, uses, maintains, and discloses information about you when
              you visit our website and use our mobile application and other
              online services (the “Services”).
            </p>
            <p>
              Please read this Privacy Policy carefully before you start to use
              the Services. By accessing and/or using the Services, you accept
              and agree to be bound by this Privacy Policy and our Terms of
              Service incorporated herein by reference, and to comply with all
              applicable laws, rules, and regulations, including the Thailand
              Personal Data Protection Act (PDPA). If you do not agree to this
              Privacy Policy and the Terms of Service, you must not access or
              use the Services. The Company is not a “covered entity” or
              “business associate” as defined under the Health Insurance
              Portability and Accountability Act of 1996 (“HIPAA”). However, the
              Company voluntarily applies data protection practices informed by
              the standards of the HIPAA Security Rule to reflect our commitment
              to the protection of health data. Your Health Information is
              governed by this Privacy Policy. You should not use the Services to
              store or transmit information that you believe requires
              HIPAA-level protection.
            </p>
            <p>
              For purposes of this Privacy Policy, “Personal Information” means
              any information that identifies, relates to, describes, is
              reasonably capable of being associated with, or could reasonably
              be linked to a particular individual.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>
              We collect Personal Information in a variety of ways when you
              interact with our Services. The categories of Personal Information
              we collect depend on how you interact with us and are described
              below.
            </p>
            <h3>2.1 Information You Provide to Us</h3>
            <PolicyTable
              headers={["Category", "Examples", "When Collected"]}
              rows={[
                [
                  "Contact & Profile",
                  "Name, email address, username, profile photo, date of birth, age, gender, country, weight, and height",
                  "When you register or update your account",
                ],
                [
                  "Self-reported Health Information",
                  "Medications, medical histories, allergies, workout logs, activity history, symptoms",
                  "When you log activity or input data through the Services",
                ],
                [
                  "Health Information",
                  "Heart rate, sleep, blood oxygen, respiratory rate, weight, height (if connected)",
                  "When you connect Apple Health or another Third-Party Application",
                ],
                [
                  "NEM Intelligence Data",
                  "Chat messages, uploaded images (if we do this feature), AI-generated responses, conversation feedback, health scores, symptom triage, predicted conditions, and health summaries",
                  "Only when you use NEM AI Intelligence",
                ],
                [
                  "Photos",
                  "Images you choose to share with NEM Intelligence",
                  "Only when you grant photo library access and share an image with NEM Intelligence",
                ],
                [
                  "Payment Data",
                  "Transaction history and details (via Stripe)",
                  "When you subscribe through the Stripe checkout page",
                ],
                [
                  "Geolocation",
                  "General region or area inferred from your device",
                  "Automatically when you use the Services",
                ],
                [
                  "Referral & Rewards Data",
                  "Referral codes, rewards earned or redeemed, contact info for referred individuals",
                  "If you participate in the Referral and Rewards Program",
                ],
              ]}
            />

            <h3>2.2 Information Collected Automatically</h3>
            <p>
              When you access or use the Services, we automatically collect
              certain technical and usage information:
            </p>
            <PolicyTable
              headers={["Category", "Examples", "How Collected"]}
              rows={[
                [
                  "Device & Usage Data",
                  "IP address, device type, OS, pages viewed, links clicked, session timestamps",
                  "Automatically when you access the Services",
                ],
                [
                  "Cookie & Tracking Data",
                  "Cookies, pixels, SDKs, advertising identifiers",
                  "Via tracking technologies on the website and app",
                ],
                [
                  "Analytics Vendor Data",
                  "Behavioral data collected by analytic services such as Singular, Mixpanel, and Google Analytics for advertising and app analytics",
                  "Automatically via third-party analytics tools",
                ],
                [
                  "Error & Performance Data",
                  "Error logs and system performance metrics collected by Sentry and Grafana (may include IP address and device identifiers)",
                  "Automatically via monitoring tools",
                ],
              ]}
            />

            <h3>2.3 Third-Party Health Information</h3>
            <p>
              With your permission, our Services connect to third-party
              applications and services (“Third-Party Applications”), which may
              include Apple Health and other providers. We connect to these
              Third-Party Applications solely to import certain health
              information about you, including heart rate, sleep, movement and
              exercise activity, blood oxygen levels, respiratory rate, height,
              weight, age, and, if you permit access to laboratory services,
              blood test results. This imported health information is referred
              to collectively as “Health Information.”
            </p>
            <p>
              If you do not enable NEM Intelligence, Apple Health data is not
              transmitted to or stored on our servers. If you enable NEM
              Intelligence, certain Apple Health data may be transmitted to and
              stored on our servers, encrypted in transit and at rest, in order
              to provide the feature. Health Information from other Third-Party
              Applications (such as Oura, Garmin, or Google Health) is stored on
              our servers for the duration of your account.
            </p>
            <p>We never use Health Information for advertising or marketing purposes.</p>
          </section>

          <section className="legal-section">
            <h2>3. How We Collect Your Information</h2>
            <p>We collect Personal Information from the following sources:</p>
            <PolicyTable
              headers={["Source", "Description"]}
              rows={[
                [
                  "Directly from you",
                  "When you register, update your profile, log activity, contact support, or otherwise interact with the Services.",
                ],
                [
                  "Third-Party Applications",
                  "Health and biometric data imported from Apple Health or other connected sources you authorize. Apple Health data is stored on your device unless you enable NEM Intelligence; data from other integrations is stored on our servers for the duration of your account.",
                ],
                [
                  "Automatically",
                  "Device information, usage data, and tracking technology data collected when you use the Services.",
                ],
              ]}
            />
          </section>

          <section className="legal-section">
            <h2>4. Where Your Information Is Stored</h2>
            <p>
              To provide the Services, we store and process your Personal
              Information using secure infrastructure operated by trusted
              third-party providers. Personal Information may be stored and
              processed as follows:
            </p>
            <PolicyTable
              headers={["Data Type", "Storage Location", "Notes"]}
              rows={[
                [
                  "Contact & Profile Data",
                  "Third-party cloud hosting providers",
                  "Synced across devices to support the Services",
                ],
                [
                  "Apple Health data (NEM Intelligence disabled)",
                  "Your device only",
                  "Never transmitted to our servers",
                ],
                [
                  "Apple Health data (NEM Intelligence enabled)",
                  "Company servers",
                  "Encrypted in transit and at rest; stored to provide NEM Intelligence features",
                ],
                [
                  "Third-party integration data (e.g., Oura, Garmin, Google Health)",
                  "Company servers",
                  "Stored for the duration of your account",
                ],
                [
                  "NEM Intelligence Data",
                  "Third-party cloud hosting and LLM/inference providers",
                  "Only when you enable NEM Intelligence. Our LLM providers are contractually prohibited from using inputs to train or improve their models.",
                ],
                [
                  "Analytics Data",
                  "Google Analytics and other third-party servers and data storage",
                  "Device and usage data only. No Health Information.",
                ],
                [
                  "Error & Performance Data",
                  "Sentry, Grafana",
                  "Device data, error logs, and system metrics. No Health Information.",
                ],
              ]}
            />
            <p>
              Your Personal Information is stored and processed in the United
              States or Singapore, and may also be stored and processed in other
              countries where we or our trusted service providers operate. By
              using the Services or otherwise providing information to us, you
              understand and consent to having your Personal Information
              transferred to and processed in the United States and such other
              countries.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. How We Use Your Information</h2>
            <p>
              We may collect and use your Personal Information for the following
              purposes:
            </p>
            <PolicyTable
              headers={["Purpose", "Description"]}
              rows={[
                [
                  "Provide the Services",
                  "To operate the app, generate health scores and insights, and deliver the features you use.",
                ],
                [
                  "NEM Intelligence",
                  "To generate AI-powered health coaching and responses when you enable the feature.",
                ],
                [
                  "Analytics & Improvement",
                  "To understand how users interact with the Services and improve functionality, using anonymized and aggregated data where feasible.",
                ],
                [
                  "Customer Support",
                  "To respond to inquiries, troubleshoot issues, and communicate with you about your account.",
                ],
                [
                  "Security & Fraud Prevention",
                  "To protect the Services and our users from unauthorized access, fraud, and abuse.",
                ],
                [
                  "Legal Compliance",
                  "To comply with applicable law, enforce our agreements, and respond to legal requests.",
                ],
              ]}
            />
            <p>We do not use Health Information for advertising or marketing purposes.</p>
          </section>

          <section className="legal-section">
            <h2>6. How We Share Your Information</h2>
            <p>
              We do not sell your Personal Information. We do not share your
              Health Information with advertising networks, data brokers, or
              social media platforms for targeting or marketing purposes. We
              share limited categories of data only as described below.
            </p>
            <PolicyTable
              headers={["Recipient", "What Is Shared", "Purpose"]}
              rows={[
                [
                  "Cloud hosting & infrastructure providers",
                  "Account data, user-generated data.",
                  "To operate and maintain the Services",
                ],
                [
                  "LLM providers (NEM Intelligence)",
                  "Pseudonymized Health Information only. We may transmit your chat message, profile information, and relevant Health Information to our AI service when you enable NEM Intelligence. See the sub-processor list in Section 7 for named providers.",
                  "To generate AI responses",
                ],
                [
                  "Sentry / Grafana",
                  "Device data, error logs, and system performance metrics. No Health Information.",
                  "Error tracking and performance monitoring",
                ],
                [
                  "Google Analytics",
                  "Device and usage data. No Health Information.",
                  "Website and app analytics",
                ],
                [
                  "Legal & regulatory authorities",
                  "As required by applicable law",
                  "Legal compliance",
                ],
                [
                  "Corporate transaction parties",
                  "Personal Information under confidentiality obligations",
                  "Mergers, acquisitions, financing",
                ],
              ]}
            />
            <p>
              If you choose to enable NEM Intelligence, we share minimized and
              pseudonymized Health Information with our LLM partners solely to
              generate responses to you. This sharing occurs only at your
              direction. If you do not enable NEM Intelligence, your Health
              Information is not shared with our LLM providers.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. NEM Intelligence & Third-Party AI Technology</h2>
            <p>
              NEM Intelligence is an optional generative AI feature that uses
              your Health Information to provide personalized health coaching
              and guidance. It’s your choice to share your Health Information
              through the NEM Intelligence feature. If you do not use it, none
              of your Health Information is transmitted to our LLM providers.
            </p>
            <p>
              To provide this feature, we leverage third-party cloud hosting
              providers and AI technology from our large language model
              partners. If you enable NEM Intelligence, certain Health
              Information (including certain Apple Health data) will be
              transmitted to and stored on our servers, encrypted in transit and
              at rest, and will be transmitted to and processed by our LLM
              partners solely for the purpose of generating responses and
              guidance.
            </p>
            <PolicyTable
              headers={["Protection", "Details"]}
              rows={[
                [
                  "Data Use by LLM Partners",
                  "We select LLM partners whose data processing terms prohibit the use of customer data for model training or improvement. We do not knowingly use LLM providers that retain or train on user inputs.",
                ],
                [
                  "Minimization",
                  "Only the minimum Health Information necessary to generate a response is transmitted.",
                ],
                [
                  "De-identification",
                  "Health Information is shared in a format intended to minimize direct identifiability.",
                ],
                [
                  "Conversation Data Retention",
                  "Biometric data used to generate responses is retained for up to 3 days, or up to 30 days if flagged for quality review, and is then deleted from our servers. Conversation history is retained until you request deletion.",
                ],
              ]}
            />
            <p>
              NEM Intelligence generates responses based on your inputs and
              Health Information, and those responses may be inaccurate,
              incomplete, or inconsistent. NEM Intelligence does not provide
              medical advice and should never be relied upon as a substitute for
              professional medical care, diagnosis, or treatment. You should
              always consult a qualified physician or other licensed healthcare
              provider with any questions you may have regarding your health or
              medical conditions.
            </p>
            <p>
              Our current sub-processors are listed below. We will update this
              list when material changes are made:
            </p>
            <PolicyTable
              headers={["Sub-Processor", "Service Provided", "Data Received", "Location"]}
              rows={[
                [
                  "Google (Vertex AI / Gemini)",
                  "Large language model / AI responses for NEM Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM Intelligence",
                  "United States",
                ],
                [
                  "Anthropic",
                  "Large language model / AI responses for NEM Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM Intelligence",
                  "United States",
                ],
                [
                  "OpenAI",
                  "Large language model / AI responses for NEM Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM Intelligence",
                  "United States",
                ],
                [
                  "Baseten",
                  "Dedicated AI inference infrastructure for NEM Intelligence (hosting open-weight models)",
                  "Pseudonymized Health Information transmitted or stored when you use NEM Intelligence",
                  "United States and other regions",
                ],
                [
                  "Google Cloud Platform (GCP)",
                  "Cloud infrastructure and data storage",
                  "Account data, user-generated data. No Health Information.",
                  "United States",
                ],
                [
                  "DigitalOcean",
                  "Cloud infrastructure and data storage",
                  "Account data, user-generated data. Health Information transmitted or stored when you use NEM Intelligence",
                  "United States",
                ],
                [
                  "Cloudflare",
                  "Content delivery network and security services",
                  "Network and device data (IP address, traffic metadata). No Health Information.",
                  "United States",
                ],
                [
                  "Sentry",
                  "Error tracking and performance monitoring",
                  "Device data, error logs (may include IP address and device identifiers). No Health Information.",
                  "United States",
                ],
                [
                  "Grafana",
                  "Performance monitoring",
                  "System and usage metrics. No Health Information.",
                  "United States",
                ],
                ["Privy", "Authentication", "Email", "United States"],
                [
                  "Dify",
                  "Agentic workflow",
                  "Pseudonymized Health Information",
                  "United States",
                ],
                [
                  "Firebase Crashlytics",
                  "Crash analytic",
                  "Crash information",
                  "United States",
                ],
              ]}
            />
          </section>

          <section className="legal-section">
            <h2>8. Your Choices</h2>
            <p>
              You have certain choices regarding how we collect, use, and share
              your Personal Information:
            </p>
            <PolicyTable
              headers={["Choice", "How to Exercise It", "Notes"]}
              rows={[
                [
                  "Update your profile data",
                  "Edit directly in app settings or email info@nemai.io",
                  "",
                ],
                [
                  "Opt out of marketing emails",
                  "Use the unsubscribe link in any email or contact info@nemai.io",
                  "Transactional account emails cannot be opted out of",
                ],
                [
                  "Chat with NEM Intelligence",
                  "Toggle on/off in NEM Intelligence feature at any time",
                  "Previously transmitted data may remain with sub-processors",
                ],
                [
                  "Opt out of ad tracking",
                  "Visit www.aboutads.info/choices (browser) or download the AppChoices app (mobile)",
                  "",
                ],
                [
                  "Manage cookies",
                  "Adjust browser or device settings",
                  "Disabling may affect app functionality",
                ],
                [
                  "Global Privacy Control (GPC)",
                  "We honor GPC opt-out signals from supported browsers",
                  "Applies to sale/sharing of Personal Information",
                ],
                [
                  "Submit a privacy rights request",
                  "Email info@nemai.io",
                  "See Section 13.2 for a description of your PDPA rights",
                ],
              ]}
            />
            <p>
              You may choose not to provide certain Personal Information to us;
              however, doing so may limit your ability to access or use some or
              all features of the Services.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Data Security & Retention</h2>
            <h3>9.1 Information Security</h3>
            <p>
              We use commercially reasonable security technologies and
              procedures to protect your Personal Information from unauthorized
              access, use, or disclosure. However, no system is completely
              secure, and we cannot guarantee the complete safety of your
              information. It is your responsibility to keep your account
              information confidential.
            </p>
            <p>
              In the event of a security breach or unauthorized access to your
              Personal Information, we will notify you in accordance with
              applicable law. If you believe your account has been compromised,
              please contact us immediately at{" "}
              <a href="mailto:info@nemai.io">info@nemai.io</a>.
            </p>
            <h3>9.2 Retention Periods</h3>
            <p>
              We retain your Personal Information for the least amount of time
              necessary for our relationship with you, to provide you access to
              the Services, and in accordance with our data retention policies
              and applicable law:
            </p>
            <PolicyTable
              headers={["Data Category", "Retention Period", "Notes"]}
              rows={[
                [
                  "Contact & profile data",
                  "Duration of account; promptly deleted following account termination",
                  "To fulfill outstanding obligations or resolve disputes",
                ],
                [
                  "Apple Health data (NEM Intelligence disabled)",
                  "Not stored by the Company",
                  "Never transmitted to Company servers",
                ],
                [
                  "Apple Health data (NEM Intelligence enabled)",
                  "Duration of account; deleted upon account deletion or verified erasure request",
                  "Encrypted in transit and at rest",
                ],
                [
                  "Third-party health data (e.g. Oura, Garmin, Google Health)",
                  "Duration of account; promptly deleted following account termination or verified erasure request",
                  "Exceptions for active legal claims or regulatory obligations only",
                ],
                [
                  "NEM Intelligence conversation data",
                  "Conversation history: retained for duration of account or until you request deletion.",
                  "You may delete conversation history at any time through NEM Intelligence history",
                ],
                [
                  "Aggregated / anonymized data",
                  "Indefinite",
                  "Only where genuinely irreversible.",
                ],
              ]}
            />
            <h3>9.3 Requesting Deletion</h3>
            <p>
              You may delete your account and associated Personal Information
              at any time directly through the NEM AI app by navigating to
              Settings &gt; Account &gt; Delete Account. This is our preferred
              method, as it allows for immediate action without additional
              identity verification.
            </p>
            <p>
              Alternatively, you may submit an erasure request or any other
              privacy rights request, including a Subject Access Request, by
              emailing <a href="mailto:info@nemai.io">info@nemai.io</a>.
              Requests submitted by email may require additional verification
              of your identity before we can process them.
            </p>
            <p>
              Please note that we may not delete all of your information if:
              (1) we need it to complete a service as requested by you or
              perform under a contract with you; (2) we need such information to
              repair errors or detect security violations; or (3) we need such
              information to protect against fraud or illegal activity or to
              comply with applicable law.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Third-Party Links and Services</h2>
            <p>
              The Services may contain advertising, links, or other content
              from third-party websites and services. We do not control the
              content or links that appear on those services and are not
              responsible for the practices employed by such third parties.
              Browsing and interacting on any third-party service is subject to
              that service&apos;s own terms and policies. A link to another site
              should not be construed as an affiliation or endorsement by NEM
              AI.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Minor Users and Children</h2>
            <p>
              The Services are not directed to children under the age of 13. We
              do not knowingly collect Personal Information from children under
              13. If we obtain actual knowledge that we have collected Personal
              Information from a child under 13 without verifiable parental
              consent, we will promptly delete it. If you believe we have
              mistakenly collected information from a child under 13, please
              contact us at <a href="mailto:info@nemai.io">info@nemai.io</a>.
            </p>
            <p>
              Users between the ages of 13 and 17 may access only those
              features of the Services that are not designated as Age-Restricted
              Features, as defined in our Terms of Service. Age-Restricted
              Features — including sensitive health metrics, financial
              transactions, and other features designated by the Company — are
              available only to users 18 years of age or older.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy at any time. We will notify you
              of material changes by posting a notice on the Services or by
              email before they take effect. Material changes include, but are
              not limited to, changes to the categories of Personal Information
              we collect, the purposes for which we use it, or the third parties
              with whom we share it. Your continued use of the Services after
              the effective date of any disclosed change constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Thailand Personal Data Protection Act (PDPA)</h2>
            <p>
              If you are residing in Thailand or if your Personal Information
              is collected, used, or disclosed by our company based in Bangkok,
              Thailand, your data privacy rights are protected under the
              Thailand Personal Data Protection Act B.E. 2562 (2019)
              (“PDPA”).
            </p>
            <h3>13.1 Legal Bases for Processing</h3>
            <p>
              We collect, use, and disclose your Personal Information under one
              or more of the following legal bases pursuant to the PDPA:
            </p>
            <ul>
              <li>
                <strong>Consent:</strong> Where you have given explicit consent
                for specific purposes, such as connecting Third-Party
                Applications or enabling NEM Intelligence.
              </li>
              <li>
                <strong>Contractual Necessity:</strong> Where processing is
                necessary for the performance of a contract to which you are a
                party, or to take steps at your request prior to entering into a
                contract.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> Where processing is
                necessary for our legitimate interests or those of a third
                party, provided such interests are not overridden by your
                fundamental rights.
              </li>
              <li>
                <strong>Legal Obligation:</strong> Where processing is
                necessary to comply with applicable legal or regulatory
                obligations.
              </li>
            </ul>
            <h3>13.2 Your Data Subject Rights Under the PDPA</h3>
            <p>
              Subject to statutory conditions and exceptions under the PDPA,
              you have the following rights regarding your Personal Information:
            </p>
            <PolicyTable
              headers={["Data Subject Right", "Description"]}
              rows={[
                [
                  "Right to Access",
                  "Right to request access to and obtain a copy of your Personal Information, as well as to request disclosure of the acquisition of information obtained without your consent.",
                ],
                [
                  "Right to Data Portability",
                  "Right to receive your Personal Information in a structured, commonly used, and machine-readable format, and to transmit or request transfer of such data to another data controller.",
                ],
                [
                  "Right to Object",
                  "Right to object to the collection, use, or disclosure of your Personal Information at any time under specified statutory conditions.",
                ],
                [
                  "Right to Erasure / Deletion",
                  "Right to request erasure, destruction, or anonymization of your Personal Information when it is no longer necessary or when legal grounds expire.",
                ],
                [
                  "Right to Restrict Processing",
                  "Right to request restriction of the use of your Personal Information under certain circumstances.",
                ],
                [
                  "Right to Rectification",
                  "Right to request that your Personal Information be kept accurate, up-to-date, complete, and not misleading.",
                ],
                [
                  "Right to Withdraw Consent",
                  "Right to withdraw consent given to us at any time, without affecting prior lawful processing.",
                ],
              ]}
            />
            <h3>13.3 Exercising Your PDPA Rights & Inquiries</h3>
            <p>
              To exercise any of your rights under the PDPA or to submit
              privacy inquiries, please contact our Data Protection Office
              based in Bangkok, Thailand by emailing{" "}
              <a href="mailto:info@nemai.io">info@nemai.io</a>. You also have
              the right to lodge a complaint with the Personal Data Protection
              Committee (PDPC) if you believe our processing of your Personal
              Information violates the PDPA.
            </p>
          </section>

          <section className="legal-section contact-section">
            <h2>14. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our
              privacy practices, please contact us as follows:
            </p>
            <PolicyTable
              headers={["Purpose", "Contact"]}
              rows={[
                ["General inquiries", "info@nemai.io"],
                ["Privacy rights requests (PDPA, GDPR)", "info@nemai.io"],
              ]}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
