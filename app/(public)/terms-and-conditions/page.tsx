import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — Matka Trails",
  description: "Read the terms and conditions governing your use of Matka Trails services, bookings, and travel packages.",
};

const sections = [
  {
    id: "scope",
    title: "Scope of Agreement",
    content: `This User Agreement ("Agreement") outlines the terms and conditions under which Matka Trails Private Limited ("Matka Trails", "we", "us", or "our") provides services to individuals ("User") who intend to purchase or inquire about any travel packages and/or services offered by us, whether through our website matkatrails.com or any other customer interface channels, including but not limited to our sales personnel, WhatsApp, call centres, and information campaigns. Each of Matka Trails and the User is individually referred to as a "party," and collectively as the "parties."`,
  },
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: `By booking or availing services from Matka Trails, Users confirm that they have read, comprehended, and expressly agreed to the terms and conditions of this Agreement, which govern all transactions and services provided by Matka Trails. This Agreement is binding and defines all rights and obligations of both the User and Matka Trails concerning any services offered by us. Accessing or using our website or WhatsApp channel also constitutes acceptance.`,
  },
  {
    id: "bookings",
    title: "Bookings & Payments",
    content: `All bookings are subject to availability and are confirmed only upon receipt of the applicable advance payment or full payment as specified at the time of booking. Matka Trails reserves the right to modify pricing, inclusions, or itinerary details before a booking is confirmed. Once a booking is confirmed and payment is received, any changes may attract amendment charges as communicated to the User. Partial payments do not constitute a confirmed booking unless explicitly acknowledged in writing by Matka Trails.`,
  },
  {
    id: "cancellation",
    title: "Refund & Cancellation Policy",
    content: `Cancellation requests must be submitted in writing to hello@matkatrails.com or via WhatsApp. The following cancellation fee schedule applies:

• Cancellation 30+ days before departure: 10% of total package cost (processing fee)
• Cancellation 15–29 days before departure: 25% of total package cost
• Cancellation 7–14 days before departure: 50% of total package cost
• Cancellation less than 7 days before departure: 75% of total package cost
• No-show / cancellation on or after departure date: No refund

Refunds, where applicable, will be credited to the original payment source within 10–15 working days after deducting applicable cancellation charges. Matka Trails is not responsible for cancellations arising from force majeure events (see below). Promotional or discounted bookings may have separate non-refundable terms disclosed at booking.`,
  },
  {
    id: "force-majeure",
    title: "Circumstances Beyond Control (Force Majeure)",
    content: `The User acknowledges that exceptional circumstances may prevent service providers such as hotels, transport operators, or activity providers from honouring confirmed bookings. Such circumstances include — but are not limited to — weather conditions, natural calamities, landslides, road blockages, government restrictions, health emergencies, labour unrest, insolvency, or operational and technical issues.

If Matka Trails is informed in advance of such situations, we will make our best efforts to offer a suitable alternative or, where feasible, a partial or full refund after deducting reasonable service charges. In no event shall Matka Trails's maximum liability exceed the amount received from the User for the affected service. Matka Trails shall not be liable for any indirect, punitive, incidental, or consequential damages arising out of such circumstances.`,
  },
  {
    id: "duties",
    title: "User's Duties & Responsibilities",
    content: `Users must:
• Provide accurate and complete information at the time of booking, including identity documents, dietary requirements, and medical conditions relevant to the trip.
• Carry valid government-issued photo identification on all trips.
• Follow the instructions of Matka Trails trip captains and guides at all times for safety.
• Comply with all applicable local laws, park regulations, and codes of conduct at destinations.
• Verify passport validity, visa requirements, and permit regulations applicable to their journey.
• Maintain appropriate physical fitness for trekking and adventure activities as described in the package.

Matka Trails is not responsible for any consequences arising from the User's failure to comply with the above duties.`,
  },
  {
    id: "insurance",
    title: "Insurance Responsibility",
    content: `Unless explicitly stated in a specific package, obtaining adequate travel insurance — including coverage for trip cancellation, medical emergencies, evacuation, and personal accidents — is the sole responsibility of the User. Matka Trails strongly recommends that all travellers obtain comprehensive travel insurance before departure. Matka Trails does not accept any liability for losses that would have been covered by adequate insurance.`,
  },
  {
    id: "ip",
    title: "Intellectual Property Rights",
    content: `All content on the Matka Trails website and social media channels, including text, photographs, videos, logos, graphics, and itineraries, is the exclusive intellectual property of Matka Trails Private Limited and is protected under applicable copyright and trademark law.

Users may not copy, reproduce, distribute, transmit, publish, or create derivative works from any Matka Trails content without prior written consent. Any photographs or videos shared by travellers during or after a trip — whether in support groups, emails, or social media — may be used by Matka Trails on its social platforms to promote the brand. If you are not comfortable with this, please notify us in writing at hello@matkatrails.com before or at the time of your trip.`,
  },
  {
    id: "platform-use",
    title: "Use of Website & WhatsApp",
    content: `Your use of information or materials on the Matka Trails website and WhatsApp channels is at your own risk. You are prohibited from altering, duplicating, distributing, reproducing, or selling any information, software, products, or services obtained from our website. Matka Trails reserves the right to modify, revise, and delete any content without prior notice. The website is provided on an "as is" basis and Matka Trails makes no warranties regarding its accuracy, completeness, or availability at any particular time.`,
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: `The User agrees to indemnify, defend, and hold harmless Matka Trails Private Limited and its directors, employees, agents, and successors from and against any losses, liabilities, claims, damages, costs, and expenses (including reasonable legal fees) arising out of or resulting from: (a) the User's breach of this Agreement; (b) the User's violation of any applicable law or regulation; (c) the User's misrepresentation of any information provided to Matka Trails; or (d) the User's wilful misconduct during a trip.`,
  },
  {
    id: "decline",
    title: "Right to Decline or Terminate Service",
    content: `Matka Trails reserves the right, at its sole discretion, to decline any booking or terminate a User's participation in a trip — without refund — if the User:
• Breaches any term of this Agreement.
• Provides false or misleading information.
• Engages in behaviour that endangers themselves, other travellers, or Matka Trails staff.
• Fails to comply with instructions from trip captains for safety reasons.
• Violates local laws or park regulations at a destination.

Such termination shall be without liability to Matka Trails.`,
  },
  {
    id: "communication",
    title: "Customer Communication",
    content: `By availing Matka Trails services, the User authorises Matka Trails to contact them via email, SMS, WhatsApp, or phone calls regarding their bookings, trip updates, and promotional offers. If you prefer not to receive marketing communications, you may opt out by emailing hello@matkatrails.com. Transactional messages related to confirmed bookings cannot be opted out of.`,
  },
  {
    id: "external-links",
    title: "External Links",
    content: `Our website may contain links to third-party websites or partner platforms. Matka Trails has no control over the content or privacy practices of such websites and accepts no responsibility for any loss or damage arising from your use of them. Links are provided for convenience only and do not constitute an endorsement.`,
  },
  {
    id: "severability",
    title: "Severability",
    content: `If any provision of this Agreement is found to be invalid or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions of this Agreement shall remain in full force and effect.`,
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content: `Matka Trails reserves the right to update or modify these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Users are responsible for reviewing these terms periodically. Continued use of our services after any modification constitutes acceptance of the revised terms.`,
  },
  {
    id: "governing-law",
    title: "Governing Law & Dispute Resolution",
    content: `This Agreement shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this Agreement shall first be sought to be resolved amicably. If resolution is not possible, disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi, India, or shall be referred to arbitration under the Indian Arbitration and Conciliation Act, 1996, at the discretion of Matka Trails. The seat of arbitration shall be New Delhi, India.`,
  },
  {
    id: "contact",
    title: "Contact Details",
    content: `For any questions, concerns, or clarifications regarding these Terms & Conditions, please reach out to us:

Matka Trails Private Limited
New Delhi, India

Email: hello@matkatrails.com
Phone / WhatsApp: +91 82947 09846
Website: matkatrails.com

By using our services, you confirm that you have read, understood, and agreed to all terms and conditions set forth in this Agreement.`,
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] via-[#0c0c0c] to-[#111111] border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,102,0,0.08),transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary/80 uppercase tracking-widest mb-5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Legal Document
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Terms &amp; <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-white/50 text-base max-w-2xl leading-relaxed">
            Please read these terms carefully before booking a trip with Matka Trails. By using our services, you agree to be bound by the conditions outlined here.
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
            Still have questions about our terms? Our team is happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:hello@matkatrails.com"
              className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/918294709846?text=Hi!%20I%20have%20a%20question%20about%20your%20Terms%20%26%20Conditions."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#25d366]/15 border border-[#25d366]/30 text-[#25d366] text-sm font-semibold hover:bg-[#25d366]/25 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-sm text-white/30 hover:text-primary transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
