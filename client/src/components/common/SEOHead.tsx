import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  path?: string;
  type?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const DEFAULT_KEYWORDS_KM = [
  'PassKru',
  'ប៉ាសគ្រូ',
  'ត្រៀមប្រឡងគ្រូ',
  'វិញ្ញាសាប្រឡងគ្រូ',
  'គ្រូបង្រៀនក្របខណ្ឌ',
  'ក្រសួងអប់រំ យុវជន និងកីឡា',
  'ប្រឡង NIE',
  'ប្រឡង RTTC',
  'ប្រឡង PTTC',
  'គ្រូមត្តេយ្យ',
  'បណ្តុំវិញ្ញាសា',
  'វប្បធម៌ទូទៅ',
  'គណិតវិទ្យា',
  'ភាសាខ្មែរ',
];

const DEFAULT_KEYWORDS_EN = [
  'PassKru',
  'Cambodian Teacher Exam',
  'MoEYS Exam Papers',
  'NIE Exam Preparation',
  'RTTC Past Papers',
  'PTTC Primary Teacher Exam',
  'General Knowledge Exam Cambodia',
];

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://passkru.edu.kh/og-passkru.png',
  path = '',
  type = 'website',
  jsonLd,
}) => {
  const { lang } = useLanguage();
  const km = lang === 'km';

  const siteName = km ? 'PassKru (ប៉ាសគ្រូ)' : 'PassKru';
  const defaultTitle = km
    ? 'PassKru - វេទិកាត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋ'
    : 'PassKru - All-in-One Cambodian Teacher Exam Preparation';

  const defaultDescription = km
    ? 'វេទិកាត្រៀមប្រឡងគ្រូបង្រៀនក្របខណ្ឌរដ្ឋទូទាំងប្រទេសកម្ពុជា រួមមានបណ្តុំវិញ្ញាសាចាស់ៗ វិញ្ញាសាត្រៀម គន្លឹះដោះស្រាយ ពិគ្រោះយោបល់ជាមួយគ្រូបង្វឹក និងប្រឡងសាកល្បង។'
    : 'All-in-one preparation platform helping Cambodian candidates master the National Teacher Examination across all teaching levels (NIE, RTTC, PTTC, Kindergarten).';

  const pageTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const keywordList = (keywords || (km ? DEFAULT_KEYWORDS_KM : DEFAULT_KEYWORDS_EN)).join(', ');
  const canonicalUrl = `https://passkru.edu.kh${path.startsWith('/') ? path : '/' + path}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Helper to set meta tags
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMetaTag('meta[name="description"]', 'name', 'description', pageDescription);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywordList);

    // Open Graph / Facebook / Telegram
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', km ? 'km_KH' : 'en_US');

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Language attribute
    document.documentElement.lang = km ? 'km' : 'en';

    // JSON-LD Structured Data
    const scriptId = 'passkru-jsonld';
    let scriptElement = document.getElementById(scriptId);
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }

    const defaultJsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        'name': 'PassKru',
        'alternateName': 'ប៉ាសគ្រូ',
        'url': 'https://passkru.edu.kh',
        'logo': 'https://passkru.edu.kh/PassKru-logo.svg',
        'description': defaultDescription,
        'sameAs': ['https://t.me/passkru_official'],
      },
    ];

    const finalJsonLd = jsonLd
      ? Array.isArray(jsonLd)
        ? [...defaultJsonLd, ...jsonLd]
        : [...defaultJsonLd, jsonLd]
      : defaultJsonLd;

    scriptElement.textContent = JSON.stringify(finalJsonLd);
  }, [pageTitle, pageDescription, keywordList, canonicalUrl, siteName, image, type, km, jsonLd]);

  return null;
};
