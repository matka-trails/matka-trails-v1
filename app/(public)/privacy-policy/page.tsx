import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Matka Trails",
  description: "Learn how Matka Trails collects, uses, and protects your personal data in compliance with applicable Indian law.",
};

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `This Privacy Policy ("Policy") sets out how Matka Trails Private Limited ("Matka Trails", "we", "us", or "our") collects, uses, discloses, and otherwise processes personal data in connection with the provision of curated group travel, trekking, and adventure experiences through our website matkatrails.com, WhatsApp, and any other channels we may operate (collectively, the "Platform" or "Services").

By accessing or using our Platform, you acknowledge that you have read and understood this Privacy Policy and agree to be bound by it. If you do not agree, please refrain from using the Services. Existing bookings may continue to be processed to the extent necessary to fulfil your confirmed reservation or comply with legal obligations.

This Policy is intended to be consistent with the Digital Personal Data Protection Act, 2023 ("DPDP Act") and other applicable Indian laws. Last Updated: 1st August 2026.`,
  },
  {
    id: "scope",
    title: "Scope & Applicability",
    content: `This Privacy Policy applies to all individuals who interact with Matka Trails, including:

• Visitors to our website and social media pages
• Prospective and confirmed travellers who book packages
• Co-travellers whose information is shared with us by the primary booker
• Emergency contacts provided at the time of booking
• Recipients of our WhatsApp, email, or SMS communications

If you provide personal data relating to a co-traveller or third party, you confirm that you have their authority to do so and that they are aware of this disclosure.`,
  },
  {
    id: "what-we-collect",
    title: "Personal Data We Collect",
    content: `We collect the following categories of personal data depending on your interaction with us:

Identity & Contact Data
Name, gender, date of birth, nationality, email address, postal address, phone/WhatsApp number, emergency contact details, and similar identifiers — for you and, where applicable, your co-travellers.

Booking & Travel Profile Data
Destination preferences, travel dates, accommodation type, dietary or medical needs relevant to the trip (only to the extent voluntarily disclosed), passport and permit details for relevant journeys, and any other information necessary to plan and deliver your itinerary.

Payment & Transaction Data
Partial payment instrument details (as returned by our payment partners), UPI or wallet identifiers, transaction references, billing address, and refund data. We do not store full card numbers, CVV, PINs, or other sensitive authentication credentials.

Technical & Usage Data
IP address, device identifiers, browser type, access timestamps, in-site actions (clicks, scrolls, pages visited), cookie identifiers, and approximate location where you have enabled location access.

Communications Data
Records of communications with us via email, WhatsApp, phone calls, or social media, along with feedback, reviews, and ratings you provide.

Marketing & Analytics Data
Referral codes, campaign identifiers, engagement with our emails or messages (opens, clicks, opt-outs), and aggregated analytics about how users interact with our Platform.

Media You Share
Photographs, videos, or documents you share during or after a trip in our WhatsApp groups, emails, or social media — which may be used for promotional purposes (see Section 8).`,
  },
  {
    id: "legal-basis",
    title: "Legal Basis for Processing",
    content: `We process your personal data on the following grounds:

Performance of Contract
To respond to enquiries, prepare itineraries, confirm and administer bookings, process payments and refunds, and deliver our services.

Legal & Regulatory Compliance
To meet obligations under tax, accounting, and record-keeping law; respond to lawful government or court directions; and fulfil traveller-information requirements for permits and entry documentation.

Legitimate Business Interests
To secure our Platform and infrastructure; detect and prevent fraud; improve our products and user experience; conduct internal analytics; and personalise communications in a manner consistent with your reasonable expectations.

Consent
For electronic marketing, non-essential cookies, or specific platform features where consent is required. You may withdraw consent at any time without affecting prior processing, though doing so may limit access to certain features.`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Data",
    content: `We use your personal data to:

• Respond to enquiries and design personalised trek or travel itineraries
• Process bookings, issue confirmations, vouchers, and invoices
• Process payments and manage refunds
• Coordinate with on-ground partners (hotels, transport, guides, permit authorities) to deliver your trip
• Send booking confirmations, pre-trip reminders, itinerary updates, and post-trip follow-ups via email, SMS, or WhatsApp
• Provide customer support before, during, and after your trip
• Share personalised destination suggestions and travel offers that match your preferences
• Conduct internal analytics to improve our packages, pricing, and user experience
• Enforce our Terms & Conditions, prevent fraud, and comply with legal obligations

We do not use your data for automated decision-making that produces legal or similarly significant effects without human oversight.`,
  },
  {
    id: "whatsapp",
    title: "WhatsApp & Messaging Channels",
    content: `We use WhatsApp as a primary channel for booking confirmations, trip support, pre-trip briefings, and community building. Typical uses include:

• Sharing itineraries, packing lists, and permit requirements before departure
• Providing real-time support during a trip
• Sending post-trip feedback requests
• Informing you of new packages or offers (where you have not opted out)

You may opt out of marketing messages at any time by messaging "STOP" or contacting hello@matkatrails.com. Strictly transactional and safety-related messages may continue as permitted by law.`,
  },
  {
    id: "cookies",
    title: "Cookies & Analytics",
    content: `Our website uses cookies and similar technologies for:

• Essential functions — maintaining your session, login state, and security preferences
• Performance analytics — understanding how pages are used so we can improve them
• Marketing measurement — tracking which channels or campaigns lead to bookings

We use privacy-compliant analytics tools. Where required by law, we will seek your consent before placing non-essential cookies and provide a mechanism to manage your preferences. You may also manage cookies through your browser settings, though doing so may affect certain site features.`,
  },
  {
    id: "customer-media",
    title: "Use of Customer Photos & Videos",
    content: `Any photographs, videos, or testimonials shared by travellers during or after their trip — in Matka Trails WhatsApp groups, via email, or on social media — may be used by Matka Trails on its website and social media channels (Instagram, YouTube, etc.) to showcase real experiences and engage our community.

If you are not comfortable with your media being used for promotional purposes, please notify us in writing at hello@matkatrails.com before or at the start of your trip and we will honour your request promptly.`,
  },
  {
    id: "sharing",
    title: "Sharing of Personal Data",
    content: `We do not sell your personal data. We may share it with the following parties on a need-to-know basis:

On-Ground Partners & Suppliers
Hotels, guesthouses, transport operators, local guides, trekking outfitters, and permit facilitators — to the extent necessary to deliver your booked itinerary.

Technology & Infrastructure Providers
Cloud hosting, CRM, payment processing, email, analytics, and communication platforms engaged to support and operate our Services under contractual data-protection obligations.

Payment Partners
Payment gateways, banks, UPI providers, and fraud-detection services for processing transactions.

Professional Advisers
Legal counsel, auditors, and accountants operating under duties of confidentiality.

Regulators & Authorities
Government agencies, courts, or law-enforcement where disclosure is required by applicable law or to protect the rights, property, or safety of Matka Trails, its travellers, or the public.

Corporate Transactions
Prospective buyers or investors in connection with any merger, acquisition, or restructuring of Matka Trails, subject to appropriate confidentiality obligations.`,
  },
  {
    id: "retention",
    title: "Data Retention",
    content: `We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, including:

• Providing ongoing services and administering your relationship with us
• Meeting statutory retention periods for financial, tax, and corporate records
• Managing disputes, claims, and investigations within applicable limitation periods
• Supporting internal analytics (typically in anonymised or aggregated form)

When data is no longer required and there is no legal basis for further retention, we delete it securely or irreversibly de-identify it. Residual back-up copies maintained for disaster recovery may persist for a limited additional period.`,
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    content: `Subject to applicable law, you have the following rights regarding your personal data:

• Right to Access — Know what data we hold about you and receive a reasonable summary
• Right to Correction — Request correction of inaccurate or incomplete data
• Right to Deletion — Request deletion of data that is no longer necessary, subject to our legal retention obligations
• Right to Withdraw Consent — For processing activities that rely on consent (e.g., marketing), withdraw consent at any time
• Right to Object — Object to processing based on legitimate interests in specific circumstances
• Right to Grievance Escalation — Escalate unresolved complaints to the relevant data-protection authority

To exercise any of these rights, please contact us using the details in Section 14. We may need to verify your identity before processing your request.`,
  },
  {
    id: "children",
    title: "Children's Data",
    content: `Our Services are designed for adults aged 18 years and above. Travellers between 15–17 years may participate in select packages with explicit written consent from a parent or legal guardian. We do not knowingly collect personal data from children under 15 without parental consent.

If you believe we have inadvertently collected a child's data, please contact us at hello@matkatrails.com and we will review and, where appropriate, delete such data promptly.`,
  },
  {
    id: "security",
    title: "Security",
    content: `We maintain a layered security programme to protect your personal data against unauthorised access, use, alteration, or disclosure. Our measures include:

• Encryption of data in transit (HTTPS/TLS) and at rest where appropriate
• Role-based access controls and audit logging for systems processing personal data
• Regular software updates and security patching
• Internal data-handling policies and awareness training for staff
• Vendor management practices requiring service providers to maintain appropriate security standards
• Incident-response procedures to investigate and contain security events

While we take all reasonable steps to protect your data, no system can guarantee absolute security. If a material security incident occurs, we will notify affected individuals and relevant authorities as required by law.`,
  },
  {
    id: "changes",
    title: "Changes to this Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in law, technology, or our business practices. Material changes will be communicated through the Platform or by email where practicable.

Unless stated otherwise, the revised Policy takes effect from the "Last Updated" date. Continued use of our Services after that date constitutes your acknowledgement of the revised Policy. We encourage you to review this page periodically.`,
  },
  {
    id: "contact",
    title: "Contact & Grievance Redressal",
    content: `For any questions, requests, or complaints relating to this Privacy Policy or our handling of your personal data, please contact us:

Matka Trails Private Limited
Registered & Operational Office: New Delhi, India

Email: hello@matkatrails.com
Phone / WhatsApp: +91 82947 09846
Website: matkatrails.com

We aim to acknowledge and resolve privacy-related queries within a commercially reasonable period and in compliance with timelines prescribed under applicable law.

For general booking or service-related queries, please write to hello@matkatrails.com or reach us on WhatsApp at +91 82947 09846.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] via-[#0c0c0c] to-[#111111] border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,102,0,0.07),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary/80 uppercase tracking-widest mb-5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Legal Document
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-white/50 text-base max-w-2xl leading-relaxed">
            We respect your privacy. This policy explains what data we collect, how we use it, and the choices you have — in plain language.
          </p>
          <p className="mt-4 text-xs text-white/30 font-medium">
            Effective Date: 1st August 2025 &nbsp;·&nbsp; Last Updated: 1st August 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
        {/* Table of Contents */}
        <div className="mb-14 p-6 rounded-2xl bg-white/[0.03] border border-white/8">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Table of Contents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors duration-200 group"
              >
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-start gap-4 mb-4">
                <span className="mt-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <h2 className="text-xl lg:text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="pl-11">
                <p className="text-white/60 leading-relaxed text-sm whitespace-pre-line">{section.content}</p>
              </div>
              {i < sections.length - 1 && (
                <div className="mt-12 border-b border-white/5" />
              )}
            </section>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center">
          <p className="text-white/70 text-sm mb-4">
            Questions about your data? We&apos;re transparent and happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:hello@matkatrails.com"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/918294709846?text=Hi!%20I%20have%20a%20question%20about%20your%20Privacy%20Policy."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#25d366]/15 border border-[#25d366]/30 text-[#25d366] text-sm font-semibold hover:bg-[#25d366]/25 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-white/30 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
