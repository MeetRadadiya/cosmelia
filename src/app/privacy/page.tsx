import { Metadata } from "next";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy | COSMELIA",
  description:
    "Learn how COSMELIA collects, protects, and handles your personal information.",
  alternates: {
    canonical: "https://getcosmelia.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="py-8 bg-[#FAF9F6] min-h-screen">
      <div className="luxury-container max-w-3xl space-y-8">
        <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

        <div className="py-6 border-b border-[#EAE8E1] space-y-2">
          <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#8C734B]">
            Legal Transparency
          </span>
          <h1 className="text-3xl font-serif text-[#141416]">Privacy Policy</h1>
          <p className="text-xs text-[#8B92A2]">Last Updated: September 2026</p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#5E6472] font-light leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              1. Overview & Business Model
            </h2>
            <p>
              Welcome to COSMELIA (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;), operating online at getcosmelia.com. We are
              committed to protecting your privacy and ensuring transparency
              about how your data is handled.
            </p>
            <p>
              COSMELIA operates as an independent online retailer curating
              modern beauty tools and everyday self-care accessories for
              consumers across the United States. Order fulfillment, inventory
              coordination, and logistics are supported through our commerce
              platform partner, FatherShops, and its associated fulfillment
              network.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              2. Information We Collect
            </h2>
            <p>
              When you visit our website, register an account, or place an
              order, we collect information necessary to provide our services:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Contact & Shipping Details:</strong> Your full name,
                delivery address, billing address, email address, and phone
                number.
              </li>
              <li>
                <strong>Account Credentials:</strong> If you register an
                account, we store your username, encrypted password, and order
                history.
              </li>
              <li>
                <strong>Order Information:</strong> Products purchased,
                quantities, transaction dates, and delivery tracking numbers.
              </li>
              <li>
                <strong>Communications:</strong> Inquiries sent to customer
                support, feedback submissions, and warranty/RMA requests.
              </li>
              <li>
                <strong>Device & Usage Data:</strong> IP address, browser type,
                operating system, referring URLs, and interaction patterns
                gathered via standard server logs.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              3. Payment Processing & Security
            </h2>
            <p>
              We prioritize the security of your transactions. Payment
              processing is handled exclusively through certified, PCI-DSS
              compliant payment gateways (including FatherPay and verified
              credit/debit card processors).
            </p>
            <p>
              COSMELIA does <strong>not</strong> collect, process, or store your
              raw credit card numbers or CVV codes on our servers. All sensitive
              financial data is transmitted directly to payment processors using
              256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              4. How We Use Your Information
            </h2>
            <p>
              We use the personal information we collect for legitimate business
              purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Processing, fulfilling, and tracking your product orders.</li>
              <li>
                Communicating with you regarding order confirmations, shipment
                tracking, and customer service requests.
              </li>
              <li>
                Managing customer accounts and facilitating returns or exchanges
                (RMA).
              </li>
              <li>
                Sending product news and special promotional offers if you have
                opted in to our newsletter (you may unsubscribe at any time).
              </li>
              <li>
                Detecting, preventing, and addressing fraudulent transactions or
                security incidents.
              </li>
              <li>
                Complying with applicable legal, accounting, and tax
                obligations.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              5. Sharing Information with Service Providers
            </h2>
            <p>
              We never sell, rent, or trade your personal data to third parties
              for their independent marketing purposes. We share your
              information strictly with trusted service providers necessary to
              operate our business:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Fulfillment & Platform Partners:</strong> We share order
                details (product items, customer name, delivery address, phone)
                with our platform provider FatherShops and its fulfillment
                network to package and dispatch your order.
              </li>
              <li>
                <strong>Shipping Carriers:</strong> Trusted postal and courier
                services (e.g., USPS, DHL, FedEx) receive your name and delivery
                address to transport packages.
              </li>
              <li>
                <strong>Payment Gateways:</strong> Payment processors receive
                transaction identifiers to authorize charges and process
                refunds.
              </li>
              <li>
                <strong>Analytics & Infrastructure:</strong> Hosting providers
                and analytics services (e.g., Google Analytics, Meta Pixel)
                assist in optimizing website performance and advertising
                effectiveness.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              6. Cookies & Tracking Technologies
            </h2>
            <p>
              Our website uses cookies, web beacons, and similar technologies to
              enhance your browsing experience:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Essential Cookies:</strong> Required for site
                functionality, such as keeping items in your shopping bag,
                remembering currency preferences, and managing secure sessions.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us understand aggregate
                traffic trends, popular categories, and site performance.
              </li>
              <li>
                <strong>Marketing Pixels:</strong> Enable us to measure
                advertising effectiveness on platforms such as Meta
                (Facebook/Instagram).
              </li>
            </ul>
            <p>
              You can configure your browser to decline cookies, though certain
              storefront features (such as the shopping cart) may not function
              properly without them.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              7. Data Retention & Security
            </h2>
            <p>
              We retain personal information only for as long as needed to
              fulfill the purposes outlined in this policy, support warranty or
              return requests, and satisfy statutory tax and reporting
              requirements. We implement appropriate technical, administrative,
              and physical safeguards to protect your personal data against
              unauthorized access, loss, or misuse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              8. Your Rights & Choices (CCPA / US State Laws)
            </h2>
            <p>
              Depending on your state or jurisdiction of residence, you may have
              specific privacy rights, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Right to Know / Access:</strong> Request details
                regarding what categories of personal information we collect and
                how it is shared.
              </li>
              <li>
                <strong>Right to Correction:</strong> Request updates to
                inaccurate or outdated personal details.
              </li>
              <li>
                <strong>Right to Deletion:</strong> Request the deletion of
                personal information, subject to legal record-retention
                requirements.
              </li>
              <li>
                <strong>Right to Opt-Out:</strong> Opt out of marketing emails
                at any time using the unsubscribe link in any message.
              </li>
              <li>
                <strong>Non-Discrimination:</strong> We will never discriminate
                against you for exercising your lawful privacy rights.
              </li>
            </ul>
            <p>
              To exercise any of these rights, please submit your request to
              radadiyameet366@gmail.com.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              9. Children&rsquo;s Privacy
            </h2>
            <p>
              COSMELIA does not knowingly collect personal information from
              children under 13 years of age. If we become aware that personal
              information of a child under 13 has been collected without
              verifiable parental consent, we will take prompt steps to remove
              such data from our records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#141416]">
              10. Contact Information
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or how your data is handled, please contact us:
            </p>
            <div className="p-4 bg-white border border-[#EAE8E1] rounded-sm space-y-1 text-xs text-[#141416]">
              <p>
                <strong>COSMELIA Customer Care</strong>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:radadiyameet366@gmail.com"
                  className="text-[#8C734B] hover:underline"
                >
                  radadiyameet366@gmail.com
                </a>
              </p>
              <p>Website: getcosmelia.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
