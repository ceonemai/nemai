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
          <h1>Privacy Policy</h1>
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
              applicable laws, rules, and regulations. If you do not agree to
              this Privacy Policy and the Terms of Service, you must not access
              or use the Services. The Company is not a “covered entity” or
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
                  "Name, email address, username, profile photo",
                  "When you register or update your account",
                ],
                [
                  "User-Generated Data",
                  "Workout logs, dietary information, activity history",
                  "When you log activity or input data through the Services",
                ],
                [
                  "Health Information",
                  "Heart rate, sleep, blood oxygen, respiratory rate, weight, height, blood test results (if connected)",
                  "When you connect Apple Health or another Third-Party Application",
                ],
                [
                  "NEM AI Intelligence Data",
                  "Conversation history, AI-generated responses",
                  "Only when you enable NEM AI Intelligence",
                ],
                [
                  "Photos",
                  "Images you choose to share with NEM AI Intelligence",
                  "Only when you grant photo library access and share an image with NEM AI Intelligence",
                ],
                [
                  "Payment Data",
                  "Transaction history and details (no payment card numbers — processed by Apple)",
                  "When you subscribe through the App Store",
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
                  "Behavioral data collected by Singular, Mixpanel, and Google Analytics for advertising and app analytics",
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
              include Apple Health, laboratory and testing services, and other
              providers. We connect to these Third-Party Applications solely to
              import certain health information about you, including heart rate,
              sleep, movement and exercise activity, blood oxygen levels,
              respiratory rate, height, weight, age, and, if you permit access
              to laboratory services, blood test results. This imported health
              information is referred to collectively as “Health Information.”
            </p>
            <p>
              If you do not enable NEM AI Intelligence, Apple Health data is not
              transmitted to or stored on our servers. If you enable NEM AI
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
                  "Health and biometric data imported from Apple Health or other connected sources you authorize. Apple Health data is stored on your device unless you enable NEM AI Intelligence; data from other integrations is stored on our servers for the duration of your account.",
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
                  "Apple Health data (NEM AI Intelligence disabled)",
                  "Your device only",
                  "Never transmitted to our servers",
                ],
                [
                  "Apple Health data (NEM AI Intelligence enabled)",
                  "Company servers",
                  "Encrypted in transit and at rest; stored to provide NEM AI Intelligence features",
                ],
                [
                  "Third-party integration data (e.g., Oura, Garmin, Google Health)",
                  "Company servers",
                  "Stored for the duration of your account",
                ],
                [
                  "NEM AI Intelligence Data",
                  "Third-party cloud hosting and LLM/inference providers",
                  "Only when you enable NEM AI Intelligence. Our LLM providers are contractually prohibited from using inputs to train or improve their models; limited retention applies as described in Sections 7 and 9.2.",
                ],
                [
                  "Analytics Data",
                  "Singular, Mixpanel, Google Analytics",
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
              States, where the Company is based, and may also be stored and
              processed in other countries where we or our trusted service
              providers operate. By using the Services or otherwise providing
              information to us, you understand and consent to having your
              Personal Information transferred to and processed in the United
              States and such other countries. See Section 13 for information on
              transfer safeguards applicable to EU and UK users.
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
                  "NEM AI Intelligence",
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
              share limited categories of data only as described below. Certain
              analytics disclosures may be characterized as “sharing” under the
              California Consumer Privacy Act or similar state laws. You may
              opt out as described in Section 8.
            </p>
            <PolicyTable
              headers={["Recipient", "What Is Shared", "Purpose"]}
              rows={[
                [
                  "Cloud hosting & infrastructure providers",
                  "Account data, user-generated data. See sub-processor list in Section 7 for named providers.",
                  "To operate and maintain the Services",
                ],
                [
                  "LLM providers (NEM AI Intelligence)",
                  "Pseudonymized Health Information only, when you enable NEM AI Intelligence. See sub-processor list in Section 7 for named providers.",
                  "To generate AI responses",
                ],
                [
                  "Singular",
                  "Device and usage data (IP address, advertising identifiers, app activity). No Health Information.",
                  "Advertising measurement",
                ],
                [
                  "Mixpanel",
                  "Device and usage data. No Health Information.",
                  "Product analytics",
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
              If you choose to enable NEM AI Intelligence, we share minimized
              and pseudonymized Health Information with our LLM partners solely
              to generate responses to you. This sharing occurs only at your
              direction. If you do not enable NEM AI Intelligence, your Health
              Information is not shared with our LLM providers.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. NEM AI Intelligence & Third-Party AI Technology</h2>
            <p>
              NEM AI Intelligence is an optional generative AI feature that uses
              your Health Information to provide personalized health coaching
              and guidance. You must actively enable it. If you do not enable
              it, none of your Health Information is transmitted to our LLM
              providers.
            </p>
            <p>
              To provide this feature, we leverage third-party cloud hosting
              providers and AI technology from our large language model
              partners. If you enable NEM AI Intelligence, certain Health
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
                [
                  "Reproductive Health",
                  "Not transmitted by default. You must separately opt in to enable this functionality. We will never use reproductive health information for advertising or marketing.",
                ],
              ]}
            />
            <p>
              NEM AI Intelligence generates responses based on your inputs and
              Health Information, and those responses may be inaccurate,
              incomplete, or inconsistent. NEM AI Intelligence does not provide
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
                  "Large language model / AI responses for NEM AI Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM AI Intelligence",
                  "United States",
                ],
                [
                  "Anthropic",
                  "Large language model / AI responses for NEM AI Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM AI Intelligence",
                  "United States",
                ],
                [
                  "OpenAI",
                  "Large language model / AI responses for NEM AI Intelligence",
                  "Pseudonymized Health Information transmitted when you use NEM AI Intelligence",
                  "United States",
                ],
                [
                  "Baseten",
                  "Dedicated AI inference infrastructure for NEM AI Intelligence (hosting open-weight models)",
                  "Pseudonymized Health Information transmitted or stored when you use NEM AI Intelligence",
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
                  "Account data, user-generated data. Health Information transmitted or stored when you use NEM AI Intelligence",
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
                [
                  "Singular",
                  "Advertising measurement",
                  "Device and usage data (IP address, advertising identifiers, app activity). No Health Information.",
                  "United States",
                ],
                [
                  "Mixpanel",
                  "Product analytics",
                  "Device and usage data. No Health Information.",
                  "United States",
                ],
              ]}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
