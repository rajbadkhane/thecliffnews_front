import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

const validLocales = ['en', 'hi'];

const translations = {
  en: {
    title: "Experience News Like Never Before",
    subtitle: "Get The Cliff News App on your Android or iOS device. Read articles in 60 words, watch video bytes, and download the daily e-paper in high quality.",
    playStoreButton: "GET IT ON",
    appStoreButton: "Download on the",
    androidSub: "Android App",
    iosSub: "iPhone & iPad",
    qrAndroidText: "Scan to install Android App",
    qrIosText: "Scan to install iOS App",
    featuresTitle: "Premium App Features",
    featuresSubtitle: "Tailored features to keep you updated with minimal screen-time",
    featuresList: [
      {
        title: "Bytes (Inshorts Style)",
        desc: "Read news summaries in 60 words or less. Swipe vertically just like reels/shorts to stay updated in seconds."
      },
      {
        title: "High-Speed EPaper Reader",
        desc: "Read and download the daily digital print edition directly on your smartphone with our optimized PDF viewer."
      },
      {
        title: "Zero-Lag Notifications",
        desc: "Get instant breaking news alerts as they happen so you never miss an important national or international event."
      },
      {
        title: "Personalized Daily Feed",
        desc: "Select categories like Politics, Tech, Sports, or Business and build a custom dashboard matched to your interests."
      }
    ],
    backToHome: "Back to Home",
    developedBy: "Technology Partner: Cysmiq AI"
  },
  hi: {
    title: "समाचार का अनुभव करें नए अंदाज़ में",
    subtitle: "द क्लिफ न्यूज़ ऐप को अपने एंड्रॉइड या आईओएस डिवाइस पर इंस्टॉल करें। 60 शब्दों में समाचार पढ़ें, वीडियो बाइट्स देखें और दैनिक ई-पेपर डाउनलोड करें।",
    playStoreButton: "गूगल प्ले से",
    appStoreButton: "ऐप स्टोर से",
    androidSub: "एंड्रॉइड ऐप",
    iosSub: "आईफोन और आईपैड",
    qrAndroidText: "एंड्रॉइड ऐप डाउनलोड के लिए स्कैन करें",
    qrIosText: "iOS ऐप डाउनलोड के लिए स्कैन करें",
    featuresTitle: "प्रीमियम ऐप फीचर्स",
    featuresSubtitle: "न्यूनतम समय में आपको अपडेट रखने के लिए विशेष फीचर्स",
    featuresList: [
      {
        title: "बाइट्स (इनशॉर्ट्स स्टाइल)",
        desc: "60 शब्दों या उससे कम में समाचार का सारांश पढ़ें। कुछ ही सेकंड में अपडेट रहने के लिए रील्स की तरह स्वाइप करें।"
      },
      {
        title: "हाई-स्पीड ई-पेपर रीडर",
        desc: "हमारे अनुकूलित पीडीएफ व्यूअर के साथ सीधे अपने स्मार्टफोन पर दैनिक डिजिटल प्रिंट संस्करण पढ़ें और डाउनलोड करें।"
      },
      {
        title: "शून्य-विलंब सूचनाएं (पुश)",
        desc: "ताज़ा ब्रेकिंग न्यूज़ अलर्ट तुरंत प्राप्त करें ताकि आप कभी भी कोई महत्वपूर्ण राष्ट्रीय या अंतर्राष्ट्रीय घटना न चूकें।"
      },
      {
        title: "व्यक्तिगत समाचार फ़ीड",
        desc: "राजनीति, तकनीक, खेल या व्यवसाय जैसी श्रेणियां चुनें और अपनी पसंद के अनुसार कस्टम डैशबोर्ड बनाएं।"
      }
    ],
    backToHome: "मुख्य पृष्ठ पर जाएं",
    developedBy: "टेक्नोलॉजी पार्टनर: Cysmiq AI"
  }
};

const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.thecliffnews";
const APP_STORE_URL = "https://apps.apple.com/us/app/the-cliff-news/id6746549944";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi ? "ऐप डाउनलोड करें | द क्लिफ न्यूज़" : "Download App | The Cliff News";
  const description = isHi
    ? "द क्लिफ न्यूज़ ऐप डाउनलोड करें - एंड्रॉइड और आईओएस के लिए उपलब्ध ताज़ा ब्रेकिंग न्यूज़, इनशॉर्ट्स और ई-पेपर।"
    : "Download The Cliff News App - available on Google Play and App Store for breaking news, quick reads, and epaper.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/download`,
      languages: {
        en: '/en/download',
        hi: '/hi/download',
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isHi ? 'hi_IN' : 'en_US',
      url: `https://www.thecliffnews.in/${locale}/download`,
    },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { locale } = await params;

  if (!validLocales.includes(locale)) {
    notFound();
  }

  const t = translations[locale as 'en' | 'hi'];

  // QR Code generator URLs
  const playStoreQR = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(PLAY_STORE_URL)}`;
  const appStoreQR = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(APP_STORE_URL)}`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-600/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <div className="mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Link>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              ⚡ LIVE ON APP STORES
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.subtitle}
            </p>

            {/* Store Buttons Grid */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              {/* Google Play Button */}
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-gray-900 dark:bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl border border-gray-800 transition-all duration-300 shadow-md hover:shadow-lg w-48"
              >
                <svg className="w-8 h-8 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 5.277c0-.285.074-.539.204-.76L12.5 13.72l-9.227 9.228a1.69 1.69 0 0 1-.273-.787V5.277Zm10.36 9.303 3.633-3.633L3.896 3.513c-.092-.047-.193-.075-.297-.083l9.76 9.76 1.39-1.39.001-.11v.11L21.75 6.25c.105-.084.186-.192.235-.316l-8.625 8.646ZM3.456 20.916 12.5 14.72l2.457 2.458-10.457 6.046c-.504.292-1.044-.073-1.044-.658v-1.65Z" />
                  <path d="M12.5 14.72 21.727 5.492c.168.21.273.475.273.766v11.484c0 .29-.105.556-.273.766L12.5 14.72Z" fillOpacity="0.8" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-400 leading-none">{t.playStoreButton}</div>
                  <div className="text-sm font-bold leading-tight mt-0.5">Google Play</div>
                </div>
              </a>

              {/* Apple Store Button */}
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-gray-900 dark:bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl border border-gray-800 transition-all duration-300 shadow-md hover:shadow-lg w-48"
              >
                <svg className="w-8 h-8 mr-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.05-1 .04-2.22.67-2.94 1.51-.62.73-1.16 1.87-1.02 2.98 1.11.09 2.26-.58 2.97-1.44z" />
                </svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-semibold text-gray-400 leading-none">{t.appStoreButton}</div>
                  <div className="text-sm font-bold leading-tight mt-0.5">App Store</div>
                </div>
              </a>
            </div>

            {/* QR Codes Section */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-8 border-t border-border mt-8">
              <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-3.5 rounded-2xl border border-border">
                <img src={playStoreQR} alt="Play Store QR Code" className="w-24 h-24 rounded-lg bg-white p-1 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm text-foreground">{t.androidSub}</div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">{t.qrAndroidText}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-3.5 rounded-2xl border border-border">
                <img src={appStoreQR} alt="App Store QR Code" className="w-24 h-24 rounded-lg bg-white p-1 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold text-sm text-foreground">{t.iosSub}</div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[120px]">{t.qrIosText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Device Mockup */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 h-[580px] bg-gray-900 rounded-[45px] p-3 shadow-2xl border-[6px] border-gray-800 overflow-hidden group">
              {/* Dynamic Camera Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-between px-4">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                <span className="w-2 h-2 rounded-full bg-blue-900" />
              </div>

              {/* Speaker Grill */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full z-30" />

              {/* Screen Content Wrapper */}
              <div className="relative w-full h-full rounded-[38px] bg-background overflow-hidden border border-black/50 z-10 flex flex-col justify-between p-4">
                {/* Header Mockup */}
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <div className="font-bold text-sm text-primary">The Cliff News</div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                </div>

                {/* Body Mockup */}
                <div className="flex-1 flex flex-col justify-center space-y-4 py-4 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary text-3xl font-extrabold">
                    CN
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-foreground">Fast, Brief & Local</div>
                    <p className="text-[10px] text-muted-foreground">Read daily news briefings in 60 words or less.</p>
                  </div>
                  <div className="bg-muted p-2.5 rounded-xl border border-border text-left">
                    <div className="text-[9px] font-semibold text-primary uppercase">Trending</div>
                    <div className="text-[10px] font-bold text-foreground line-clamp-1 mt-0.5">PM Modi Global Address Live</div>
                    <p className="text-[9px] text-muted-foreground line-clamp-2 mt-0.5">Watch real time video bytes and download the daily e-paper directly on your mobile...</p>
                  </div>
                </div>

                {/* Footer Mockup */}
                <div className="flex justify-around items-center pt-2 border-t border-border">
                  <span className="w-4 h-4 rounded bg-primary/20" />
                  <span className="w-5 h-5 rounded-full bg-primary" />
                  <span className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Details Grid */}
        <div className="border-t border-border pt-16">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{t.featuresTitle}</h2>
            <p className="text-muted-foreground">{t.featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {t.featuresList.map((feat, index) => (
              <div key={index} className="flex gap-4 p-6 bg-card border border-border hover:border-primary/40 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-20 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">{t.developedBy}</p>
        </div>
      </div>
    </div>
  );
}
