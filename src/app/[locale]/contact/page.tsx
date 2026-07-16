import { Metadata } from "next";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "./ContactForm";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi ? 'संपर्क करें' : 'Contact Us';
  const description = isHi
    ? 'द क्लिफ न्यूज़ टीम से संपर्क करें। हम आपकी प्रतिक्रिया, समाचार सुझावों और साझेदारी के विचारों का स्वागत करते हैं।'
    : 'Get in touch with The Cliff News team. We value your feedback, story tips, and partnership ideas.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        hi: '/hi/contact',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isHi ? 'hi_IN' : 'en_US',
      url: `https://www.thecliffnews.in/${locale}/contact`,
    },
  };
}

const CONTACT = {
  email: "Thecliffnewspaper@gmail.com",
  phone: "8770967135",
  phoneDisplay: "+91 87709 67135",
  address: {
    line1: "374, G Sector, Ayodhya Nagar",
    line2: "Bhopal, Madhya Pradesh",
    country: "India",
  },
};

const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "374, G Sector, Ayodhya Nagar, Bhopal, Madhya Pradesh, India"
)}`;

export default function ContactPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
              <MessageCircle className="h-3.5 w-3.5" />
              We&apos;d love to hear from you
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Get in touch with The Cliff News
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Have a story tip, feedback, or a partnership idea? Reach out and our team will respond as soon as we can.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact info cards */}
          <div className="space-y-4 lg:col-span-2">
            <a
              href={`mailto:${CONTACT.email}`}
              className="block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {CONTACT.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a
              href={`tel:+91${CONTACT.phone}`}
              className="block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {CONTACT.phoneDisplay}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

            <a
              href={MAP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Office</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {CONTACT.address.line1}
                      <br />
                      {CONTACT.address.line2}
                      <br />
                      {CONTACT.address.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </a>

          </div>

          {/* Form */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the form and we&apos;ll get back to you shortly.
              </p>

              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
