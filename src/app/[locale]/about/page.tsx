import { Metadata } from 'next';
import Link from 'next/link';
import { organization } from '@/config/organization';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isHi = locale === 'hi';

  const title = isHi
    ? 'द क्लिफ न्यूज़ के बारे में | प्रिंट समाचार पत्र और डिजिटल न्यूज़ नेटवर्क'
    : 'About The Cliff News | Print Newspaper & Digital News Network';
  const description = isHi
    ? 'द क्लिफ न्यूज़ एक भारतीय प्रिंट समाचार पत्र और समाचार मीडिया संगठन है, जिसका अपना प्रिंटिंग प्रेस, न्यूज़ वेबसाइट, आईओएस और एंड्रॉयड ऐप्स हैं।'
    : 'The Cliff News is an Indian print newspaper with an in-house press and a digital presence through its news website, Android and iOS apps, video platforms and social media.';

  return {
    title,
    description,
    alternates: {
      canonical: `${organization.mainNewsWebsite}/${locale}/about`,
      languages: {
        'en-IN': `${organization.mainNewsWebsite}/en/about`,
        'hi-IN': `${organization.mainNewsWebsite}/hi/about`,
        'x-default': `${organization.mainNewsWebsite}/en/about`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isHi ? 'hi_IN' : 'en_US',
      url: `${organization.mainNewsWebsite}/${locale}/about`,
      images: [
        {
          url: `${organization.mainNewsWebsite}/logo.png`,
          width: 1200,
          height: 630,
          alt: isHi 
            ? 'द क्लिफ न्यूज़ प्रिंट समाचार पत्र और डिजिटल समाचार नेटवर्क'
            : 'The Cliff News print newspaper and digital news network',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${organization.mainNewsWebsite}/logo.png`],
    }
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isHi = locale === 'hi';

  // Social Channels mapping (only render if verified/configured)
  const activeSocials = [
    {
      name: "Facebook",
      url: organization.socialLinks.facebook,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      url: organization.socialLinks.instagram,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      url: organization.socialLinks.linkedin,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      name: "YouTube",
      url: organization.socialLinks.youtube,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      )
    },
    {
      name: "X",
      url: organization.socialLinks.x,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      )
    },
    {
      name: "WhatsApp",
      url: organization.socialLinks.whatsapp,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M3 21l1.9 -5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      )
    }
  ].filter(s => s.url !== ""); // Filter out placeholder profiles

  const t = {
    // English
    en: {
      lang: "en-IN",
      eyebrow: "About The Cliff News",
      h1: "The Cliff News: Indian Print Newspaper and Digital News Network",
      intro: "The Cliff News is an Indian print newspaper and news media organization headquartered in the Bhopal region of Madhya Pradesh. Alongside its physical newspaper publication and in-house printing infrastructure, The Cliff News operates a multilingual digital news platform, mobile applications, video channels, and official social-media accounts.",
      trustLabel: "Print Publication • Digital News Platform • Mobile Applications",
      slogan: "Print credibility. Digital accessibility. News wherever readers are.",
      readNews: "Read The Cliff News",
      downloadApp: "Download the News App",
      followChannels: "Follow Our Official Channels",
      
      whatIsTitle: "What is The Cliff News?",
      whatIsAnswer: "The Cliff News is an Indian print newspaper and multimedia news organization. It publishes physical newspaper editions using its printing infrastructure and extends its journalism digitally through TheCliffNews.in, Android and iOS applications, video reporting, social-media channels, e-paper services, news alerts, and multilingual coverage.",
      
      printTitle: "A Print Newspaper with Its Own Media Infrastructure",
      printP1: "The Cliff News operates as a physical, registered print newspaper with deep roots in community journalism. Unlike purely digital outlets, our print foundation is supported by our proprietary in-house industrial printing press located at our central operations facility in the Industrial Area of Mandideep, Bhopal.",
      printP2: "Owning and operating our physical press allows our editorial team to maintain absolute control over the quality, scheduling, and distribution of our news. Our physical newspaper circulates across multiple states and major cities, bringing accredited, physically verified news to thousands of households daily.",
      printP3: "Our headquarters in Bhopal serves as the operational center for our print and digital publications. This facility combines a high-tech newsroom with industrial printing capabilities to ensure media solutions and professional excellence.",
      
      digitalTitle: "The Digital Presence of The Cliff News",
      digitalIntro: "To serve modern, mobile-first audiences, The Cliff News extends its editorial coverage through a fast-growing digital ecosystem:",
      digitalPortal: "Official News Portal",
      digitalPortalDesc: "Access breaking news, local coverage, and full reports in real time at thecliffnews.in.",
      digitalAndroid: "Android App",
      digitalAndroidDesc: "Get updates on the go, read local feeds, and download e-paper editions directly.",
      digitalIos: "iOS App",
      digitalIosDesc: "Experience high-performance, personalized news notifications on Apple App Store.",
      digitalEpaper: "Digital E-Paper",
      digitalEpaperDesc: "Read digital replicas of our physical daily newspaper editions online.",
      digitalAlerts: "Breaking News Alerts",
      digitalAlertsDesc: "Get instant notifications on major state, national, and international developments.",
      digitalVideo: "Video Journalism",
      digitalVideoDesc: "Watch short video reports and in-depth video bytes on our YouTube and website portals.",
      
      appTitle: "Download The Cliff News App",
      appDesc: "Get Hindi and English news, e-paper editions, quick reads, video updates, personalized feeds, and real-time notifications on your phone.",
      downloadAndroid: "Download for Android",
      downloadIos: "Download for iPhone",
      
      socialTitle: "Follow The Cliff News",
      socialDesc: "Follow the verified and official digital channels of The Cliff News for breaking news, newspaper updates, video reports, public-interest journalism, and important regional and national developments.",
      
      coverageTitle: "Our Journalism and Coverage",
      coverageDesc: "Our editorial department produces public-interest reporting in print and across our digital platforms covering key areas:",
      coverageList: ["National News", "International News", "Madhya Pradesh News", "Politics and Governance", "Business and Economy", "Sports", "Entertainment", "Education", "Health", "Technology", "Public-Interest Reporting", "Local and Regional Developments"],
      
      languagesTitle: "News in Hindi and English",
      languagesDesc: "We serve our audience through comprehensive Hindi and English news experiences. Real-time language toggles allow readers to switch dynamically based on preference.",
      linkToEnglish: "View English News Platform",
      linkToHindi: "हिंदी समाचार प्लेटफार्म देखें",
      
      valuesTitle: "Editorial Values",
      valuesText: "Our editorial team follows strict principles of responsible journalism:",
      valueItems: [
        { title: "Accuracy & Verification", desc: "Every report is subjected to editorial verification before publishing. We seek primary sources and verify claims." },
        { title: "Independence", desc: "Our reporting is editorially independent and free from commercial or political pressure." },
        { title: "Corrections & Transparency", desc: "The editorial team aims to verify information, distinguish reporting from opinion, correct material errors, and provide responsible coverage in the public interest." }
      ],
      editorialLinksTitle: "Quick Resources",
      
      credentialsTitle: "Organization Credentials",
      credentialsDesc: "Registration, listing, and circulation information is provided for organizational identification and transparency. It does not represent an endorsement of individual editorial content.",
      credLabelName: "Organization Name",
      credLabelType: "Entity Type",
      credLabelWebsite: "Main News Website",
      credLabelPCI: "Publication/Media Reference (PCI Code)",
      credLabelRegs: "Registrations",
      credLabelCert: "Circulation Certification",
      credLabelInfra: "Media Infrastructure",
      cred1Val: "National News Network",
      cred4Val: "RNI, CBC, DAVP Listed",
      cred5Val: "Verified CA Circulation",
      cred6Val: "In-house Printing Press | iOS & Android Apps",
      
      contactTitle: "Contact The Cliff News",
      contactDesc: "Have a news tip, advertising inquiry, or corporate query? Get in touch with our team directly.",
      addressLabel: "Headquarters & Editorial Office",
      pressLabel: "Printing Press & Production Facility",
      emailLabel: "General & Editorial Email",
      phoneLabel: "Phone Number",
      mapsLabel: "View on Google Maps",
      faqTitle: "Frequently Asked Questions",
      
      faqs: [
        {
          q: "What is The Cliff News?",
          a: "The Cliff News is an Indian print newspaper and news media organization. It operates a physical newspaper publication using its in-house printing infrastructure and distributes news digitally via its official website, mobile apps, video platforms, and social media networks."
        },
        {
          q: "Is The Cliff News a print newspaper?",
          a: "Yes, The Cliff News is a registered print newspaper. We operate our own in-house printing press facility located in the Industrial Area of Mandideep, Bhopal, giving us complete control over our editorial and publication operations."
        },
        {
          q: "Does The Cliff News have a digital news website?",
          a: "Yes, our official digital news portal is available at www.thecliffnews.in, providing real-time news updates, categories coverage, and e-paper access in English and Hindi."
        },
        {
          q: "Where is The Cliff News based?",
          a: "The Cliff News is headquartered in Bhopal, Madhya Pradesh, India. Our office is located at 374, G Sector, Ayodhya Nagar, Bhopal, and our printing operations are in Mandideep, Bhopal."
        },
        {
          q: "Is The Cliff News available on Android and iPhone?",
          a: "Yes, The Cliff News has official applications available for download on both the Google Play Store (Android) and the Apple App Store (iOS)."
        },
        {
          q: "In which languages does The Cliff News publish news?",
          a: "The Cliff News publishes regional, national, and international news coverage in both Hindi and English."
        },
        {
          q: "Where can readers follow The Cliff News?",
          a: "Readers can follow our official verified profiles on Facebook, Instagram, LinkedIn, and YouTube."
        },
        {
          q: "How can readers contact The Cliff News?",
          a: "You can reach us via email at Thecliffnewspaper@gmail.com, by phone at +91 87709 67135, or through the contact form on our website."
        },
        {
          q: "Does The Cliff News publish an e-paper?",
          a: "Yes, digital replica e-paper editions of our print newspaper are published and accessible online on our official platform."
        },
        {
          q: "How can businesses advertise with The Cliff News?",
          a: "Businesses can place print advertisements in our physical publication and digital advertisements on our news website and mobile apps. Contact our advertising desk at Thecliffnewspaper@gmail.com."
        }
      ]
    },
    
    // Hindi
    hi: {
      lang: "hi-IN",
      eyebrow: "द क्लिफ न्यूज़ के बारे में",
      h1: "द क्लिफ न्यूज़: प्रिंट समाचार पत्र और डिजिटल न्यूज़ नेटवर्क",
      intro: "द क्लिफ न्यूज़ मध्य प्रदेश के भोपाल क्षेत्र में मुख्यालय वाला एक भारतीय प्रिंट समाचार पत्र और समाचार मीडिया संगठन है। अपने भौतिक समाचार पत्र प्रकाशन और इन-हाउस प्रिंटिंग बुनियादी ढांचे के साथ, द क्लिफ न्यूज़ एक बहुभाषी डिजिटल समाचार मंच, मोबाइल एप्लिकेशन, वीडियो चैनल और आधिकारिक सोशल मीडिया खाते संचालित करता है।",
      trustLabel: "प्रिंट प्रकाशन • डिजिटल समाचार मंच • मोबाइल एप्लिकेशन",
      slogan: "प्रिंट विश्वसनीयता। डिजिटल पहुंच। समाचार जहां पाठक हैं।",
      readNews: "द क्लिफ न्यूज़ पढ़ें",
      downloadApp: "न्यूज़ ऐप डाउनलोड करें",
      followChannels: "हमारे आधिकारिक चैनलों को फॉलो करें",
      
      whatIsTitle: "द क्लिफ न्यूज़ क्या है?",
      whatIsAnswer: "द क्लिफ न्यूज़ एक भारतीय प्रिंट समाचार पत्र और मल्टीमीडिया समाचार संगठन है। यह अपने प्रिंटिंग बुनियादी ढांचे का उपयोग करके भौतिक समाचार पत्र संस्करणों को प्रकाशित करता है और TheCliffNews.in, एंड्रॉइड और आईओएस एप्लिकेशन, वीडियो रिपोर्टिंग, सोशल मीडिया चैनल, ई-पेपर सेवाओं, समाचार अलर्ट और बहुभाषी कवरेज के माध्यम से पत्रकारिता का विस्तार करता है।",
      
      printTitle: "एक प्रिंट समाचार पत्र जिसका अपना मीडिया इन्फ्रास्ट्रक्चर है",
      printP1: "द क्लिफ न्यूज़ सामुदायिक पत्रकारिता में गहरी जड़ों के साथ एक भौतिक, पंजीकृत प्रिंट समाचार पत्र के रूप में संचालित होता है। विशुद्ध रूप से डिजिटल आउटलेट्स के विपरीत, हमारी प्रिंट नींव न्यू इंडस्ट्रियलिया, मंडीदीप, भोपाल में हमारी केंद्रीय संचालन सुविधा में स्थित हमारे मालिकाना इन-हाउस औद्योगिक प्रिंटिंग प्रेस द्वारा समर्थित है।",
      printP2: "अपने स्वयं के प्रेस का संचालन हमारे संपादकीय विभाग को समाचार की गुणवत्ता, समयबद्धता और वितरण पर पूर्ण नियंत्रण बनाए रखने में सक्षम बनाता है। हमारा भौतिक समाचार पत्र कई राज्यों और प्रमुख शहरों में प्रसारित होता है, जिससे प्रतिदिन हजारों घरों में सत्यापित और विश्वसनीय समाचार पहुंचता है।",
      printP3: "भोपाल में हमारा मुख्यालय हमारे प्रिंट और डिजिटल प्रकाशनों के संचालन केंद्र के रूप में कार्य करता है। यह सुविधा मीडिया समाधान और व्यावसायिक उत्कृष्टता सुनिश्चित करने के लिए एक आधुनिक न्यूज़रूम को औद्योगिक मुद्रण क्षमताओं के साथ जोड़ती है।",
      
      digitalTitle: "द क्लिफ न्यूज़ की डिजिटल उपस्थिति",
      digitalIntro: "आधुनिक मोबाइल दर्शकों की सेवा के लिए, द क्लिफ न्यूज़ अपने डिजिटल ईकोसिस्टम के माध्यम से कवरेज का विस्तार करता है:",
      digitalPortal: "आधिकारिक समाचार पोर्टल",
      digitalPortalDesc: "thecliffnews.in पर रीयल-टाइम अपडेट और गहन रिपोर्टिंग प्राप्त करें।",
      digitalAndroid: "एंड्रॉयड ऐप",
      digitalAndroidDesc: "चलते-फिरते अपडेट प्राप्त करें, स्थानीय समाचार पढ़ें और सीधे ई-पेपर डाउनलोड करें।",
      digitalIos: "आईओएस ऐप",
      digitalIosDesc: "ऐप्पल ऐप स्टोर पर उच्च-प्रदर्शन, व्यक्तिगत समाचार सूचनाएं प्राप्त करें।",
      digitalEpaper: "डिजिटल ई-पेपर",
      digitalEpaperDesc: "हमारे दैनिक प्रिंट समाचार पत्र के डिजिटल ई-पेपर संस्करण ऑनलाइन पढ़ें।",
      digitalAlerts: "ब्रेकिंग न्यूज़ अलर्ट",
      digitalAlertsDesc: "प्रमुख राज्य, राष्ट्रीय और अंतर्राष्ट्रीय घटनाक्रमों पर तुरंत सूचनाएं प्राप्त करें।",
      digitalVideo: "वीडियो पत्रकारिता",
      digitalVideoDesc: "हमारे आधिकारिक YouTube और वेबसाइट पोर्टल पर लघु वीडियो और विस्तृत रिपोर्ट देखें।",
      
      appTitle: "द क्लिफ न्यूज़ ऐप डाउनलोड करें",
      appDesc: "हिंदी और अंग्रेजी समाचार, ई-पेपर संस्करण, त्वरित पठन, वीडियो अपडेट, व्यक्तिगत फीड और रीयल-टाइम नोटिफिकेशन अपने फोन पर प्राप्त करें।",
      downloadAndroid: "एंड्रॉयड के लिए डाउनलोड करें",
      downloadIos: "आईफोन के लिए डाउनलोड करें",
      
      socialTitle: "द क्लिफ न्यूज़ को फॉलो करें",
      socialDesc: "ब्रेकिंग न्यूज, समाचार पत्र अपडेट, वीडियो रिपोर्ट, जनहित पत्रकारिता और महत्वपूर्ण क्षेत्रीय और राष्ट्रीय घटनाक्रमों के लिए द क्लिफ न्यूज के सत्यापित आधिकारिक चैनलों को फॉलो करें।",
      
      coverageTitle: "हमारी पत्रकारिता और कवरेज",
      coverageDesc: "हमारा संपादकीय विभाग प्रिंट और डिजिटल प्लेटफॉर्म पर निम्नलिखित प्रमुख क्षेत्रों में जिम्मेदार रिपोर्टिंग तैयार करता है:",
      coverageList: ["राष्ट्रीय समाचार", "अंतर्राष्ट्रीय समाचार", "मध्य प्रदेश समाचार", "राजनीति और शासन", "व्यापार और अर्थव्यवस्था", "खेल", "मनोरंजन", "शिक्षा", "स्वास्थ्य", "तकनीक", "जनहित रिपोर्टिंग", "स्थानीय और क्षेत्रीय विकास"],
      
      languagesTitle: "हिंदी और अंग्रेजी में समाचार",
      languagesDesc: "हम हिंदी और अंग्रेजी समाचार अनुभवों के माध्यम से अपने पाठकों की सेवा करते हैं। रीयल-टाइम भाषा स्विच पाठकों को अपनी पसंद के आधार पर गतिशील रूप से बदलने की सुविधा देता है।",
      linkToEnglish: "English News Platform देखें",
      linkToHindi: "हिंदी समाचार प्लेटफार्म देखें",
      
      valuesTitle: "संपादकीय मूल्य",
      valuesText: "हमारी संपादकीय टीम जिम्मेदार पत्रकारिता के सख्त सिद्धांतों का पालन करती है:",
      valueItems: [
        { title: "सटीकता और सत्यापन", desc: "प्रकाशन से पहले प्रत्येक रिपोर्ट को संपादकीय सत्यापन के अधीन किया जाता है। हम प्राथमिक स्रोतों की तलाश करते हैं और दावों का सत्यापन करते हैं।" },
        { title: "स्वतंत्रता", desc: "हमारी रिपोर्टिंग व्यावसायिक या राजनीतिक दबावों से पूरी तरह स्वतंत्र और जनहित के प्रति समर्पित है।" },
        { title: "सुधार और पारदर्शिता", desc: "संपादकीय टीम का उद्देश्य जानकारी को सत्यापित करना, राय से रिपोर्टिंग को अलग करना, भौतिक त्रुटियों को सुधारना और जनहित में जिम्मेदार कवरेज प्रदान करना है।" }
      ],
      editorialLinksTitle: "त्वरित संसाधन",
      
      credentialsTitle: "संगठन के क्रेडेंशियल",
      credentialsDesc: "संगठनात्मक पहचान और पारदर्शिता के लिए पंजीकरण, लिस्टिंग और सर्कुलेशन की जानकारी प्रदान की जाती है। यह किसी भी संपादकीय सामग्री के विज्ञापन या सरकारी समर्थन का प्रतिनिधित्व नहीं करता है।",
      credLabelName: "संगठन का नाम",
      credLabelType: "संस्था का प्रकार",
      credLabelWebsite: "मुख्य समाचार वेबसाइट",
      credLabelPCI: "प्रकाशन/मीडिया संदर्भ (PCI कोड)",
      credLabelRegs: "पंजीकरण एवं लिस्टिंग",
      credLabelCert: "सर्कुलेशन प्रमाणन",
      credLabelInfra: "मीडिया अवसंरचना",
      cred1Val: "राष्ट्रीय समाचार नेटवर्क",
      cred4Val: "आरएनआई, सीबीसी, डीएवीपी सूचीबद्ध",
      cred5Val: "सत्यापित सीए सर्कुलेशन",
      cred6Val: "इन-हाउस प्रिंटिंग प्रेस | आईओएस और एंड्रॉइड ऐप्स",
      
      contactTitle: "द क्लिफ न्यूज़ से संपर्क करें",
      contactDesc: "समाचार इनपुट, विज्ञापन पूछताछ, या संगठनात्मक प्रश्नों के लिए सीधे हमारी टीम से संपर्क करें।",
      addressLabel: "मुख्यालय और संपादकीय कार्यालय",
      pressLabel: "प्रिंटिंग प्रेस और उत्पादन सुविधा",
      emailLabel: "सामान्य और संपादकीय ईमेल",
      phoneLabel: "फ़ोन नंबर",
      mapsLabel: "गूगल मैप्स पर देखें",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      
      faqs: [
        {
          q: "द क्लिफ न्यूज़ क्या है?",
          a: "द क्लिफ न्यूज़ एक भारतीय प्रिंट समाचार पत्र और समाचार मीडिया संगठन है। यह अपने इन-हाउस प्रिंटिंग इंफ्रास्ट्रक्चर का उपयोग करके एक भौतिक समाचार पत्र प्रकाशित करता है और अपनी आधिकारिक वेबसाइट, मोबाइल ऐप, वीडियो प्लेटफॉर्म और सोशल मीडिया नेटवर्क के माध्यम से डिजिटल रूप से समाचार वितरित करता है।"
        },
        {
          q: "क्या द क्लिफ न्यूज़ एक प्रिंट समाचार पत्र है?",
          a: "हाँ, द क्लिफ न्यूज़ एक पंजीकृत प्रिंट समाचार पत्र है। हम औद्योगिक क्षेत्र मंडीदीप, भोपाल में स्थित अपनी इन-हाउस प्रिंटिंग प्रेस सुविधा संचालित करते हैं, जिससे हमारे पास प्रकाशन संचालन पर पूर्ण नियंत्रण रहता है।"
        },
        {
          q: "क्या द क्लिफ न्यूज़ की कोई डिजिटल समाचार वेबसाइट है?",
          a: "हाँ, हमारा आधिकारिक डिजिटल समाचार पोर्टल www.thecliffnews.in पर उपलब्ध है, जो अंग्रेजी और हिंदी में वास्तविक समय के समाचार अपडेट और ई-पेपर प्रदान करता है।"
        },
        {
          q: "द क्लिफ न्यूज़ कहाँ स्थित है?",
          a: "द क्लिफ न्यूज़ का मुख्यालय भोपाल, मध्य प्रदेश, भारत में है। हमारा कार्यालय 374, जी सेक्टर, अयोध्या नगर, भोपाल में स्थित है, और हमारी प्रिंटिंग मंडीदीप, भोपाल में है।"
        },
        {
          q: "क्या द क्लिफ न्यूज़ एंड्रॉइड और आईफोन पर उपलब्ध है?",
          a: "हाँ, द क्लिफ न्यूज़ के आधिकारिक एप्लिकेशन Google Play Store (Android) और Apple App Store (iOS) दोनों पर डाउनलोड के लिए उपलब्ध हैं।"
        },
        {
          q: "द क्लिफ न्यूज़ किन भाषाओं में समाचार प्रकाशित करता है?",
          a: "द क्लिफ न्यूज़ हिंदी और अंग्रेजी दोनों भाषाओं में क्षेत्रीय, राष्ट्रीय और अंतर्राष्ट्रीय समाचार कवरेज प्रकाशित करता है।"
        },
        {
          q: "पाठक द क्लिफ न्यूज़ को कहाँ फॉलो कर सकते हैं?",
          a: "पाठक फेसबुक, इंस्टाग्राम, लिंक्डइन और यूट्यूब पर हमारे आधिकारिक सत्यापित प्रोफाइल को फॉलो कर सकते हैं।"
        },
        {
          q: "पाठक द क्लिफ न्यूज़ से कैसे संपर्क कर सकते हैं?",
          a: "आप हमसे ईमेल Thecliffnewspaper@gmail.com पर, फोन +91 87709 67135 पर, या हमारी वेबसाइट के संपर्क फ़ॉर्म के माध्यम से संपर्क कर सकते हैं।"
        },
        {
          q: "क्या द क्लिफ न्यूज़ ई-पेपर प्रकाशित करता है?",
          a: "हाँ, हमारे प्रिंट समाचार पत्र के डिजिटल ई-पेपर संस्करण हमारी आधिकारिक वेबसाइट पर ऑनलाइन पढ़े जा सकते हैं।"
        },
        {
          q: "व्यवसाय द क्लिफ न्यूज़ के साथ विज्ञापन कैसे कर सकते हैं?",
          a: "व्यवसाय हमारे प्रिंट समाचार पत्र और डिजिटल समाचार वेबसाइट/ऐप्स पर विज्ञापन दे सकते हैं। हमारे विज्ञापन विभाग से Thecliffnewspaper@gmail.com पर संपर्क करें।"
        }
      ]
    }
  };

  const curr = isHi ? t.hi : t.en;

  // JSON-LD Structured Data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
        "@id": `${organization.mainNewsWebsite}/#organization`,
        "name": organization.name,
        "alternateName": organization.alternateName,
        "url": organization.mainNewsWebsite,
        "logo": {
          "@type": "ImageObject",
          "url": `${organization.mainNewsWebsite}/logo.png`,
          "width": "200",
          "height": "60"
        },
        "description": organization.description,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": organization.officeAddress.streetAddress,
          "addressLocality": organization.officeAddress.addressLocality,
          "addressRegion": organization.officeAddress.addressRegion,
          "postalCode": organization.officeAddress.postalCode,
          "addressCountry": organization.officeAddress.addressCountry
        },
        "sameAs": activeSocials.map(s => s.url)
      },
      {
        "@type": "AboutPage",
        "@id": `${organization.mainNewsWebsite}/${locale}/about`,
        "url": `${organization.mainNewsWebsite}/${locale}/about`,
        "name": isHi ? "द क्लिफ न्यूज़ के बारे में" : "About The Cliff News",
        "description": curr.intro,
        "inLanguage": isHi ? "hi-IN" : "en-IN",
        "mainEntity": {
          "@id": `${organization.mainNewsWebsite}/#organization`
        },
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${organization.mainNewsWebsite}/#website`,
          "url": organization.mainNewsWebsite,
          "name": organization.name
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${organization.mainNewsWebsite}/${locale}/about#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": isHi ? "होम" : "Home",
            "item": `${organization.mainNewsWebsite}/${locale}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isHi ? "हमारे बारे में" : "About",
            "item": `${organization.mainNewsWebsite}/${locale}/about`
          }
        ]
      },
      // Android Mobile App Schema
      {
        "@type": "MobileApplication",
        "@id": organization.androidApp,
        "name": organization.name,
        "operatingSystem": "Android",
        "applicationCategory": "NewsApplication",
        "downloadUrl": organization.androidApp,
        "publisher": {
          "@id": `${organization.mainNewsWebsite}/#organization`
        }
      },
      // iOS Mobile App Schema
      {
        "@type": "MobileApplication",
        "@id": organization.iosApp,
        "name": organization.name,
        "operatingSystem": "iOS",
        "applicationCategory": "NewsApplication",
        "downloadUrl": organization.iosApp,
        "publisher": {
          "@id": `${organization.mainNewsWebsite}/#organization`
        }
      },
      // Dynamic FAQ Page Schema from FAQ Visible Data Array
      {
        "@type": "FAQPage",
        "@id": `${organization.mainNewsWebsite}/${locale}/about#faq`,
        "mainEntity": curr.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#fbfbfa] text-[#1a1a1a] font-sans antialiased">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* Styled Layout Blocks */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        
        {/* 1. Hero Section */}
        <header className="border-b-2 border-black pb-8 mb-10">
          <span className="text-[#f39b16] font-bold text-xs uppercase tracking-wider block mb-2">
            {curr.eyebrow}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight tracking-tight mb-4 font-serif">
            {curr.h1}
          </h1>
          <p className="text-lg text-[#333333] leading-relaxed mb-6 font-serif">
            {curr.intro}
          </p>
          <div className="text-xs text-[#666666] italic mb-6 border-l-2 border-[#f39b16] pl-3">
            {curr.slogan}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href={organization.mainNewsWebsite} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2.5 bg-[#f39b16] text-white text-sm font-bold rounded hover:bg-[#d9820f] transition-all"
            >
              {curr.readNews}
            </a>
            <a 
              href="#app-download" 
              className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded hover:bg-neutral-800 transition-all"
            >
              {curr.downloadApp}
            </a>
            <a 
              href="#social-links" 
              className="px-5 py-2.5 border border-black text-black text-sm font-bold rounded hover:bg-neutral-100 transition-all"
            >
              {curr.followChannels}
            </a>
          </div>

          <div className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-6">
            {curr.trustLabel}
          </div>
        </header>

        {/* 2. Clear Identity Statement (Highlighted Answer) */}
        <section className="bg-white border-2 border-black p-6 rounded mb-10 shadow-sm">
          <h2 className="text-xl font-bold text-black mb-3 font-serif">
            {curr.whatIsTitle}
          </h2>
          <blockquote className="text-base text-neutral-700 leading-relaxed italic border-l-4 border-black pl-4">
            {curr.whatIsAnswer}
          </blockquote>
        </section>

        {/* 3. Print Media Foundation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.printTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            {curr.printP1}
          </p>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            {curr.printP2}
          </p>
          <p className="text-base text-neutral-700 leading-relaxed">
            {curr.printP3}
          </p>
        </section>

        {/* 4. Digital Presence Cards Grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.digitalTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-6">
            {curr.digitalIntro}
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalPortal}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalPortalDesc}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalAndroid}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalAndroidDesc}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalIos}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalIosDesc}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalEpaper}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalEpaperDesc}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalAlerts}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalAlertsDesc}</p>
            </div>
            <div className="border border-neutral-200 bg-white p-5 rounded">
              <h3 className="font-bold text-black mb-2">{curr.digitalVideo}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{curr.digitalVideoDesc}</p>
            </div>
          </div>
        </section>

        {/* 5. App Download Section */}
        <section id="app-download" className="bg-[#151515] text-white p-8 rounded mb-10 border border-black">
          <h2 className="text-2xl font-bold mb-3 font-serif text-[#f39b16]">
            {curr.appTitle}
          </h2>
          <p className="text-neutral-300 text-sm leading-relaxed mb-6">
            {curr.appDesc}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a
              href={organization.androidApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f39b16] hover:bg-[#d9820f] text-white px-5 py-3 rounded text-sm font-bold transition-all"
              aria-label="Download The Cliff News App for Android"
            >
              <span>{curr.downloadAndroid}</span>
            </a>
            <a
              href={organization.iosApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black px-5 py-3 rounded text-sm font-bold transition-all"
              aria-label="Download The Cliff News App for iOS"
            >
              <span>{curr.downloadIos}</span>
            </a>
          </div>
        </section>

        {/* 6. Official Social Links */}
        <section id="social-links" className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.socialTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-6">
            {curr.socialDesc}
          </p>
          
          <div className="flex flex-wrap gap-3">
            {activeSocials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded text-neutral-700 hover:text-black hover:border-black transition-all text-sm font-semibold"
                aria-label={`Follow The Cliff News on ${social.name}`}
              >
                {social.icon}
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* 7. Journalism and Coverage */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.coverageTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            {curr.coverageDesc}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {curr.coverageList.map((item) => (
              <span 
                key={item} 
                className="text-xs bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* 8. Language Accessibility */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.languagesTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            {curr.languagesDesc}
          </p>
          
          <div className="flex gap-4">
            <Link 
              href="/en/about" 
              className="text-sm font-bold text-[#f39b16] hover:underline"
            >
              {curr.linkToEnglish}
            </Link>
            <Link 
              href="/hi/about" 
              className="text-sm font-bold text-[#f39b16] hover:underline"
            >
              {curr.linkToHindi}
            </Link>
          </div>
        </section>

        {/* 9. Editorial Values */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.valuesTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-4">
            {curr.valuesText}
          </p>
          
          <div className="space-y-4 mb-6">
            {curr.valueItems.map((val) => (
              <div key={val.title} className="border-l-2 border-black pl-4 py-1">
                <h3 className="font-bold text-black text-sm mb-1">{val.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-black text-base mb-3">{curr.editorialLinksTitle}</h3>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-600">
            <Link href="/" className="hover:text-black">{isHi ? 'होम' : 'Home'}</Link>
            <Link href="/privacy" className="hover:text-black">{isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}</Link>
            <Link href="/terms" className="hover:text-black">{isHi ? 'सेवा की शर्तें' : 'Terms of Service'}</Link>
            <Link href="/contact" className="hover:text-black">{isHi ? 'संपर्क करें' : 'Contact Us'}</Link>
            <Link href="/book-advertisement" className="hover:text-black">{isHi ? 'विज्ञापन दें' : 'Advertise with Us'}</Link>
            <Link href="/epaper" className="hover:text-black">{isHi ? 'ई-पेपर' : 'E-Paper'}</Link>
          </div>
        </section>

        {/* 10. Credentials Section */}
        <section className="mb-10 bg-neutral-50 p-6 border border-neutral-200 rounded">
          <h2 className="text-2xl font-bold text-black mb-2 font-serif">
            {curr.credentialsTitle}
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed mb-6">
            {curr.credentialsDesc}
          </p>
          
          <dl className="grid gap-y-3 gap-x-6 text-sm md:grid-cols-2">
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelName}</dt>
              <dd className="font-semibold text-black">{organization.name}</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelType}</dt>
              <dd className="font-semibold text-black">{curr.cred1Val}</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelWebsite}</dt>
              <dd className="font-semibold text-[#f39b16] break-all">{organization.mainNewsWebsite}</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelPCI}</dt>
              <dd className="font-semibold text-black">101818</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelRegs}</dt>
              <dd className="font-semibold text-black">{curr.cred4Val}</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelCert}</dt>
              <dd className="font-semibold text-black">{curr.cred5Val}</dd>
            </div>
            <div className="border-b border-neutral-200 pb-2 md:col-span-2">
              <dt className="text-xs font-bold uppercase text-neutral-500 mb-1">{curr.credLabelInfra}</dt>
              <dd className="font-semibold text-black">{curr.cred6Val}</dd>
            </div>
          </dl>
        </section>

        {/* 11. Contact and Location */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.contactTitle}
          </h2>
          <p className="text-base text-neutral-700 leading-relaxed mb-6">
            {curr.contactDesc}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">{curr.addressLabel}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {organization.officeAddress.streetAddress}<br />
                {organization.officeAddress.addressLocality}, {organization.officeAddress.addressRegion}<br />
                PIN {organization.officeAddress.postalCode}, {organization.officeAddress.addressCountry}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">{curr.pressLabel}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {organization.pressAddress.streetAddress}<br />
                {organization.pressAddress.addressLocality}, {organization.pressAddress.addressRegion}<br />
                PIN {organization.pressAddress.postalCode}, {organization.pressAddress.addressCountry}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">{curr.emailLabel}</h3>
              <p className="text-sm">
                <a href={`mailto:${organization.contact.email}`} className="text-[#f39b16] font-semibold hover:underline">
                  {organization.contact.email}
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-sm mb-1">{curr.phoneLabel}</h3>
              <p className="text-sm">
                <a href={`tel:+91${organization.contact.phone}`} className="text-[#f39b16] font-semibold hover:underline">
                  {organization.contact.phoneDisplay}
                </a>
              </p>
            </div>
          </div>

          <div className="text-sm font-bold text-[#f39b16]">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("374, G Sector, Ayodhya Nagar, Bhopal, Madhya Pradesh, India")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {curr.mapsLabel} &rarr;
            </a>
          </div>
        </section>

        {/* 12. Frequently Asked Questions */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-4 font-serif border-b border-neutral-300 pb-2">
            {curr.faqTitle}
          </h2>
          
          <div className="space-y-6">
            {curr.faqs.map((faq, index) => (
              <div key={index} className="border-b border-neutral-100 pb-4">
                <h3 className="font-bold text-black text-base mb-2 font-serif">
                  Q. {faq.q}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}