"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode, SVGProps } from "react";

const agentSecurityImageSrc = "/images/agent-securite.png" as const;
const technicianImageSrc = "/images/technicien.png" as const;
const telesurveillanceImageSrc = "/images/telesurveillance.png" as const;

type IconProps = SVGProps<SVGSVGElement>;

const LightningIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="m13 2-7 12h6l-1 8 7-12h-6z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShieldIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="M12 21c6-2 8-5.667 8-12V5l-8-3-8 3v4c0 6.333 2 10 8 12Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeadsetIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="M4 12a8 8 0 0 1 16 0v6a2 2 0 0 1-2 2h-2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 12v6a2 2 0 0 0 2 2h2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HomeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="m4 11 8-7 8 7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OfficeBuildingIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="M4 21h16V3H8v18ZM8 7h4M8 11h4M8 15h4M14 7h4M14 11h4M14 15h4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 21v-4h4v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StorefrontIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="M3 9h18l-1-5H4L3 9Zm2 0v10h14V9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 19v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4V2m10 2V2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WarehouseIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
    <path
      d="M2 20V9l10-5 10 5v11"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 19v-6h12v6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13v6m6-6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const advantages = [
  {
    title: "Réponse ultra-rapide",
    description:
      "Prise en charge de chaque incident en moins de 60 secondes par nos opérateurs certifiés.",
    icon: LightningIcon,
  },
  {
    title: "Maintenance & SAV offerts",
    description:
      "Notre équipe dédiée assure gratuitement l’entretien du système et la mise à jour des équipements.",
    icon: ShieldIcon,
  },
  {
    title: "Intervention express",
    description:
      "Agents mobiles déployés partout à Abidjan en moins de 15 minutes, 7j/7 et 24h/24.",
    icon: HeadsetIcon,
  },
];

const faqs = [
  {
    question: "Quelle est la durée d’engagement ?",
    answer:
      "Les abonnements sont sans engagement long terme. Vous pouvez résilier à tout moment avec un préavis de 30 jours.",
  },
  {
    question: "Puis-je ajouter des détecteurs supplémentaires ?",
    answer:
      "Oui, notre équipe conçoit un plan sur-mesure et ajoute les détecteurs nécessaires lors de la visite technique initiale.",
  },
];

const businessStructuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "SecurityService"],
  "@id": "https://www.proalarme.ci/#organisation",
  name: "Pro Alarme Côte d’Ivoire",
  url: "https://www.proalarme.ci/",
  telephone: "+2250710701212",
  description:
    "Système d'alarme professionnel Pro Alarme : installation, télésurveillance et intervention express 24/7 partout à Abidjan.",
  image: "https://www.proalarme.ci/images/agent-securite.png",
  priceRange: "$$",
  areaServed: {
    "@type": "City",
    name: "Abidjan",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  makesOffer: [
    {
      "@type": "Offer",
      name: "Abonnement télésurveillance professionnelle",
      price: "50000",
      priceCurrency: "XOF",
      availability: "https://schema.org/InStock",
      description:
        "Abonnement mensuel à 50 000 F CFA incluant installation, télésurveillance et interventions express.",
    },
  ],
  brand: {
    "@type": "Brand",
    name: "Pro Alarme",
  },
  serviceType:
    "Installation et supervision de systèmes d'alarme professionnels pour entreprises et résidences à Abidjan",
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const pricingHighlights = [
  "Abonnement mensuel à seulement 50 000 F CFA",
  "Frais d’installation à 100 000 F CFA incluant des détecteurs, 1 sirène et 1 télécommande",
  "Extension modulable : nous ajoutons les détecteurs requis pour chaque nouveau site",
  "Supervision 24/7 et interventions express incluses dans chaque formule",
  "Tableau de bord client pour suivre alertes et interventions en temps réel",
];

const includedFeatures = [
  "Installation complète par des techniciennes certifiées et audit de vulnérabilité sur site.",
  "Télésurveillance 24/7 avec levée de doute audio/vidéo et rapport d’intervention systématique.",
  "Maintenance préventive et remplacement des équipements défaillants inclus sans frais additionnels.",
  "Tableau de bord client pour suivre l’état des détecteurs, les historiques d’alertes et les interventions.",
];

const guarantees = [
  "Audit et plan d’implantation offerts pour tout nouveau site.",
  "Résiliation possible à tout moment avec préavis de 30 jours.",
  "Accompagnement dédié : un interlocuteur unique suit votre dossier.",
];

const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

type GeoapifyFeatureProperties = {
  formatted?: string;
};

type GeoapifyFeature = {
  properties?: GeoapifyFeatureProperties;
};

type GeoapifyAutocompleteResponse = {
  features?: GeoapifyFeature[];
};

type StepValues = {
  buildingType?: string;
  location?: string;
  phone?: string;
  email?: string;
};

type StepField = keyof StepValues;

type InputType = "select" | "text" | "tel" | "email";

type StepOption = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type StepQuestion = {
  id: number;
  title: string;
  subtitle: string;
  field: StepField;
  inputType: InputType;
  options?: StepOption[];
  required?: boolean;
  placeholder?: string;
};

const stepQuestions: StepQuestion[] = [
  {
    id: 1,
    title: "Quel type de bâtiment souhaitez-vous sécuriser ?",
    subtitle: "Sélectionnez le lieu principal pour personnaliser votre abonnement.",
    field: "buildingType",
    inputType: "select",
    required: true,
    options: [
      {
        label: "Résidentiel",
        value: "Résidentiel",
        icon: <HomeIcon className="h-8 w-8" />,
      },
      {
        label: "Bureaux",
        value: "Bureaux",
        icon: <OfficeBuildingIcon className="h-8 w-8" />,
      },
      {
        label: "Commerce",
        value: "Commerce",
        icon: <StorefrontIcon className="h-8 w-8" />,
      },
      {
        label: "Entrepôt / Industriel",
        value: "Entrepôt / Industriel",
        icon: <WarehouseIcon className="h-8 w-8" />,
      },
    ],
  },
  {
    id: 2,
    title: "Où se situe le site à protéger ?",
    subtitle:
      "Indiquez un quartier, un carrefour ou tout repère bien connu pour situer précisément le site.",
    field: "location",
    inputType: "text",
    required: true,
    placeholder: "Ex. Plateau, Abidjan",
  },
  {
    id: 3,
    title: "Quel est votre numéro de téléphone ?",
    subtitle: "Un expert vous appellera rapidement pour finaliser votre audit.",
    field: "phone",
    inputType: "tel",
    required: true,
    placeholder: "Ex. +225 07 10 70 12 12",
  },
  {
    id: 4,
    title: "Quelle adresse e-mail pouvons-nous utiliser ?",
    subtitle: "L’e-mail est facultatif : il sert pour les devis et suivis écrits.",
    field: "email",
    inputType: "email",
    placeholder: "nom@entreprise.ci",
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<StepValues>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFormActive, setIsFormActive] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<StepField, string | null>>>({});
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [isFetchingLocationSuggestions, setIsFetchingLocationSuggestions] =
    useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] =
    useState(false);

  const formCardRef = useRef<HTMLDivElement | null>(null);
  const locationBlurTimeoutRef = useRef<number | null>(null);
  const hasLocationAutocomplete = Boolean(GEOAPIFY_API_KEY);

  type ScrollAnimationStyle = CSSProperties & {
    "--scroll-animate-delay"?: string;
  };

  const createDelayStyle = (delay: number): ScrollAnimationStyle => ({
    "--scroll-animate-delay": `${delay}ms`,
  });

  const validateQuestion = (question: StepQuestion) => {
    const rawValue = values[question.field];
    const value = typeof rawValue === "string" ? rawValue.trim() : "";
    let errorMessage: string | null = null;

    if (question.required && value.length === 0) {
      errorMessage = "Ce champ est obligatoire.";
    }

    if (!errorMessage && question.field === "phone" && value.length > 0) {
      const phoneRegex = /^\+?[0-9\s.-]{6,}$/;
      if (!phoneRegex.test(value)) {
        errorMessage = "Veuillez indiquer un numéro valide.";
      }
    }

    if (!errorMessage && question.field === "email" && value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Veuillez indiquer une adresse e-mail valide.";
      }
    }

    if (errorMessage) {
      setFieldErrors((prev) => ({ ...prev, [question.field]: errorMessage }));
      return false;
    }

    setFieldErrors((prev) => ({ ...prev, [question.field]: null }));
    return true;
  };

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate-on-scroll]")
    );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.dataset.visible = "true";
            observerInstance.unobserve(target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const activeQuestion: StepQuestion = useMemo(
    () => stepQuestions[Math.min(currentStep, stepQuestions.length - 1)],
    [currentStep]
  );

  const firstQuestion = stepQuestions[0];

  useEffect(() => {
    if (activeQuestion.field !== "location") {
      setShowLocationSuggestions(false);
      setIsFetchingLocationSuggestions(false);
      setLocationSuggestions([]);
      return;
    }

    const query = (values.location ?? "").trim();

    if (!GEOAPIFY_API_KEY || query.length < 3) {
      setLocationSuggestions([]);
      setIsFetchingLocationSuggestions(false);
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    setIsFetchingLocationSuggestions(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
        url.searchParams.set("text", query);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "5");
        url.searchParams.set("apiKey", GEOAPIFY_API_KEY as string);
        url.searchParams.set("filter", "countrycode:ci");

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Geoapify request failed with status ${response.status}`,
          );
        }

        const data = (await response.json()) as GeoapifyAutocompleteResponse;

        if (!isCancelled) {
          const suggestions =
            data.features
              ?.map((feature) => feature.properties?.formatted)
              .filter((formatted): formatted is string => Boolean(formatted)) ?? [];

          setLocationSuggestions(suggestions);
        }
      } catch (error) {
        const errorName =
          error instanceof Error ? error.name : (error as { name?: string }).name;
        const isAbortError = errorName === "AbortError";

        if (!isCancelled && !isAbortError) {
          console.error(
            "Erreur lors de la récupération des suggestions Geoapify",
            error,
          );
          setLocationSuggestions([]);
        }
      } finally {
        if (!isCancelled) {
          setIsFetchingLocationSuggestions(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeQuestion.field, values.location]);

  useEffect(() => {
    return () => {
      if (locationBlurTimeoutRef.current !== null) {
        window.clearTimeout(locationBlurTimeoutRef.current);
      }
    };
  }, []);

  const progressPercentage = useMemo(
    () => Math.round(((currentStep + 1) / stepQuestions.length) * 100),
    [currentStep]
  );

  const liveSummary = useMemo(
    () =>
      stepQuestions
        .filter((question) => {
          const value = values[question.field];
          return typeof value === "string" && value.trim().length > 0;
        })
        .map((question) => ({
          id: question.id,
          label: question.title,
          value: values[question.field] as string,
        })),
    [values]
  );

  const handleNext = () => {
    if (currentStep < stepQuestions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = (field: keyof StepValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleLocationFocus = () => {
    if (locationBlurTimeoutRef.current !== null) {
      window.clearTimeout(locationBlurTimeoutRef.current);
      locationBlurTimeoutRef.current = null;
    }

    if (hasLocationAutocomplete) {
      setShowLocationSuggestions(true);
    }
  };

  const handleLocationBlur = () => {
    if (locationBlurTimeoutRef.current !== null) {
      window.clearTimeout(locationBlurTimeoutRef.current);
    }

    locationBlurTimeoutRef.current = window.setTimeout(() => {
      setShowLocationSuggestions(false);
    }, 120);
  };

  const handleLocationSelect = (suggestion: string) => {
    if (locationBlurTimeoutRef.current !== null) {
      window.clearTimeout(locationBlurTimeoutRef.current);
      locationBlurTimeoutRef.current = null;
    }

    handleChange("location", suggestion);
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleActivateForm = () => {
    if (!isFormActive || isSubmitted) {
      setCurrentStep(0);
      setValues({});
      setIsSubmitted(false);
      setIsSending(false);
      setSubmitError(null);
      setFieldErrors({});
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);

      if (locationBlurTimeoutRef.current !== null) {
        window.clearTimeout(locationBlurTimeoutRef.current);
        locationBlurTimeoutRef.current = null;
      }
    }

    setIsFormActive(true);

    setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const question = activeQuestion;
    const isValid = validateQuestion(question);
    if (!isValid) {
      return;
    }

    if (currentStep < stepQuestions.length - 1) {
      handleNext();
      return;
    }

    if (isSending) {
      return;
    }

    setIsSending(true);
    setSubmitError(null);

    try {
      const payload = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Réponse invalide du serveur");
      }

      handleNext();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire", error);
      setSubmitError(
        "Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    const field = activeQuestion.field;
    handleChange(field, optionValue);
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, stepQuestions.length - 1));
    }, 180);
  };

  const handleInitialQuestionSelect = (optionValue: string) => {
    setValues((prev) => ({
      ...(isSubmitted ? {} : prev),
      buildingType: optionValue,
    }));
    setFieldErrors((prev) => ({ ...prev, buildingType: null }));
    setIsFormActive(true);
    setIsSubmitted(false);
    setIsSending(false);
    setSubmitError(null);
    setCurrentStep((prev) => (prev <= 0 ? 1 : prev));

    window.setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  useEffect(() => {
    if (!isFormActive) {
      return;
    }

    const timeout = window.setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [currentStep, isFormActive, isSubmitted]);

  const summary = useMemo(() => {
    return [
      { label: "Type de bâtiment", value: values.buildingType },
      { label: "Lieu à sécuriser", value: values.location },
      { label: "Téléphone", value: values.phone },
      { label: "E-mail", value: values.email },
    ].filter((item) => item.value && item.value.trim().length > 0);
  }, [values]);

  const activeError = fieldErrors[activeQuestion.field] ?? null;

  return (
    <div className="bg-[#0d0d0d] text-white">
      <Script id="structured-data-localbusiness" type="application/ld+json">
        {JSON.stringify(businessStructuredData)}
      </Script>
      <Script id="structured-data-faq" type="application/ld+json">
        {JSON.stringify(faqStructuredData)}
      </Script>
      <header className="relative overflow-hidden">
        <Image
          src="/images/Pont-abidjan.png"
          alt="Pont d'Abidjan traversant la lagune"
          fill
          priority
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" aria-hidden />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,#ff1f1f,transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-32 pt-24 md:pt-32">
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div
              data-animate-on-scroll
              style={createDelayStyle(160)}
              className="space-y-8"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-red-200">
                Protection total sur Abidjan
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Le système d’alarme professionnel pensé pour la réactivité absolue.
              </h1>
              <p className="max-w-xl text-lg text-neutral-200">
                Surveillez vos sites sensibles, rassurez vos équipes et réduisez drastiquement les risques. Pro Alarme combine technologie de pointe, supervision 24/7 et interventions express.
              </p>
              <ul className="space-y-3 text-sm text-neutral-200">
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                    1
                  </span>
                  Audit gratuit et plan de sécurisation personnalisé pour chaque site.
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                    2
                  </span>
                  Télésurveillance opérée localement avec réponse en moins de 60&nbsp;secondes.
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
                    3
                  </span>
                  Maintenance et interventions incluses pour garantir la continuité de service.
                </li>
              </ul>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={handleActivateForm}
                  data-analytics-id="cta-hero-audit"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-red-400 to-red-500 px-10 py-4 text-center text-base font-semibold uppercase tracking-[0.25em] text-white shadow-[0_18px_45px_rgba(239,68,68,0.45)] transition hover:from-red-400 hover:via-red-500 hover:to-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span className="absolute inset-0 translate-y-[120%] bg-white/20 transition duration-500 ease-out group-hover:translate-y-[-10%]" />
                  <span className="relative flex items-center gap-3">
                    Demander un audit gratuit
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs tracking-[0.3em]">
                      &gt;
                    </span>
                  </span>
                </button>
                <a
                  href="tel:+2250710701212"
                  data-analytics-id="cta-hero-call"
                  className="rounded-full border border-white/20 px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
                >
                  Nous appeler maintenant
                </a>
                <a
                  href="https://wa.me/2250710701212"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics-id="cta-hero-whatsapp"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-green-100 transition hover:border-green-400 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M12.04 2C6.58 2 2.2 6.26 2.2 11.62c0 1.83.53 3.58 1.52 5.12L2 22l5.4-1.64c1.52.83 3.24 1.27 5.04 1.27 5.46 0 9.84-4.26 9.84-9.62C22.28 6.26 17.5 2 12.04 2Zm0 17.5c-1.54 0-3.04-.41-4.36-1.18l-.31-.18-3.2.97.94-3.07-.2-.32a8 8 0 0 1-1.22-4.1c0-4.4 3.66-7.98 8.15-7.98s8.15 3.58 8.15 7.98-3.66 7.98-8.15 7.98Zm4.47-5.9c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.16-1.4-1.3-1.64-.14-.24-.01-.36.1-.48.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.28-.74-1.76-.2-.48-.4-.4-.54-.4-.14 0-.3-.02-.46-.02-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.58 4.12 3.6.58.25 1.04.4 1.4.51.6.19 1.14.16 1.56.1.48-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                  </svg>
                  WhatsApp +225 07 10 70 12 12
                </a>
              </div>
              <div className="max-w-sm rounded-3xl border border-red-500/40 bg-red-500/10 p-6 text-left shadow-[0_18px_45px_rgba(239,68,68,0.2)]">
                <p className="text-xs uppercase tracking-[0.3em] text-red-200">Offre transparente</p>
                <p className="mt-3 text-3xl font-semibold text-white">50 000 F CFA / mois</p>
                <p className="mt-2 text-sm text-neutral-100">
                  Frais d’installation uniques à 100 000 F CFA avec la télésurveillance 24/7 incluse.
                </p>
              </div>
            </div>
            <div
              data-animate-on-scroll
              style={createDelayStyle(280)}
              className="relative flex h-full justify-center"
            >
              <div className="absolute -left-8 top-8 hidden h-32 w-32 rounded-full border border-red-500/40 md:block" />
              <div className="absolute -right-10 bottom-6 hidden h-24 w-24 rounded-full border border-red-500/30 md:block" />
              <div className="relative w-full max-w-md">
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(120)}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                >
                  <Image
                    src={agentSecurityImageSrc}
                    alt="Agent de sécurité Pro Alarme supervisant un centre de contrôle"
                    width={900}
                    height={1200}
                    className="h-full w-full object-cover"
                    priority
                    sizes="(min-width: 768px) 420px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10" />
                  <div className="absolute bottom-6 left-6 right-6 text-sm text-white">
                    <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-red-200">
                      Service Pro
                    </span>
                    <p className="mt-3 text-base leading-relaxed text-neutral-100">
                      Des professionnels qualifiés assurent votre suivi.
                    </p>
                  </div>
                </div>
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(280)}
                  className="relative mt-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:-mt-10"
                >
                  <div className="flex items-center justify-between text-xs text-white/90">
                    <span>Réponse 24/7</span>
                    <span>Centre de télésurveillance</span>
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="rounded-2xl bg-black/60 px-6 py-5">
                      <p className="text-sm uppercase tracking-[0.3em] text-red-300">Incidents</p>
                      <p className="mt-3 text-3xl font-semibold text-white">&lt; 60 s</p>
                      <p className="mt-1 text-sm text-neutral-100">Temps moyen de prise en charge</p>
                    </div>
                    <div className="rounded-2xl bg-black/60 px-6 py-5">
                      <p className="text-sm uppercase tracking-[0.3em] text-red-300">Interventions</p>
                      <p className="mt-3 text-3xl font-semibold text-white">&lt; 15 min</p>
                      <p className="mt-1 text-sm text-neutral-100">Déploiement d’agents partout à Abidjan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section
          data-animate-on-scroll
          id="devis"
          className="relative overflow-hidden bg-neutral-100 py-20 scroll-mt-24"
        >
          <div className="absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6">
            <div
              id="audit-form"
              data-animate-on-scroll
              style={createDelayStyle(80)}
              className="-mt-12 rounded-3xl border border-red-500/20 bg-white px-6 py-8 text-black shadow-xl scroll-mt-36 sm:px-8 sm:py-10"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-red-500">Commencez ici</span>
              <h3 className="mt-3 text-2xl font-semibold text-black">{firstQuestion.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{firstQuestion.subtitle}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {firstQuestion.options?.map((option) => {
                  const isSelected = values.buildingType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInitialQuestionSelect(option.value)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? "border-red-500 bg-red-50 text-red-600 shadow-sm"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-red-400 hover:bg-red-50/60"
                      }`}
                      aria-pressed={isSelected}
                    >
                      {option.icon ? (
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            isSelected
                              ? "bg-red-500/15 text-red-500"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {option.icon}
                        </span>
                      ) : null}
                      <span className="text-sm font-medium leading-tight">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-xs text-neutral-500">
                Votre sélection est reprise automatiquement dans le formulaire complet juste en dessous.
              </p>
            </div>
            <div className="flex flex-col gap-12 md:flex-row">
              <div
                data-animate-on-scroll
                style={createDelayStyle(240)}
                className="md:w-1/2"
              >
                <div
                  ref={formCardRef}
                  data-animate-on-scroll
                  style={createDelayStyle(360)}
                  className="rounded-3xl border border-black/10 bg-white p-8 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">Demandez votre abonnement</h3>
                  <span className="rounded-full bg-black px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                    Flot interactif
                  </span>
                </div>
                <p className="mt-3 text-sm text-neutral-600">
                  Répondez aux questions. Les champs apparaissent au fur et à mesure pour rester concentré sur l’essentiel.
                </p>

                {!isFormActive ? (
                  <div className="mt-8 space-y-6 text-center">
                    <p className="text-sm text-neutral-600">
                      Sélectionnez le type de bâtiment ci-dessus ou cliquez sur « Remplir le formulaire complet » pour continuer.
                    </p>
                    <button
                      type="button"
                      onClick={handleActivateForm}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-400"
                    >
                      Remplir le formulaire complet
                    </button>
                  </div>
                ) : !isSubmitted ? (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.3em] text-red-500">
                          Etape {currentStep + 1} / {stepQuestions.length}
                        </span>
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black disabled:opacity-40"
                          disabled={currentStep === 0}
                        >
                          Revenir
                        </button>
                      </div>
                      <div className="mt-4">
                        <div className="h-2 w-full rounded-full bg-neutral-200">
                          <div
                            className="h-2 rounded-full bg-red-500 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                          <span>Progression</span>
                          <span>{progressPercentage}%</span>
                        </div>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-black">{activeQuestion.title}</h3>
                      <p className="mt-2 text-sm text-neutral-600">{activeQuestion.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      {activeQuestion.options ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {activeQuestion.options.map((option) => {
                            const isSelected = values[activeQuestion.field] === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleOptionSelect(option.value)}
                                className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                                  isSelected
                                    ? "border-red-500 bg-red-50 text-red-600 shadow-sm"
                                    : "border-neutral-200 bg-white text-neutral-800 hover:border-red-400 hover:bg-red-50/60"
                                }`}
                                aria-pressed={isSelected}
                              >
                                {option.icon ? (
                                  <span
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                      isSelected
                                        ? "bg-red-500/15 text-red-500"
                                        : "bg-neutral-100 text-neutral-600"
                                    }`}
                                  >
                                    {option.icon}
                                  </span>
                                ) : null}
                                <span className="text-sm font-medium leading-tight">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}

                      {!activeQuestion.options && activeQuestion.inputType === "text" && (
                        activeQuestion.field === "location" ? (
                          <div className="relative">
                            <input
                              type="text"
                              value={values.location ?? ""}
                              onChange={(event) => {
                                handleChange("location", event.target.value);
                                if (hasLocationAutocomplete) {
                                  if (locationBlurTimeoutRef.current !== null) {
                                    window.clearTimeout(locationBlurTimeoutRef.current);
                                    locationBlurTimeoutRef.current = null;
                                  }
                                  setShowLocationSuggestions(true);
                                }
                              }}
                              onFocus={handleLocationFocus}
                              onBlur={handleLocationBlur}
                              className={`w-full rounded-2xl border px-4 py-3 text-sm text-neutral-800 focus:outline-none ${
                                activeError
                                  ? "border-red-500"
                                  : "border-neutral-200 focus:border-red-500"
                              }`}
                              placeholder={activeQuestion.placeholder}
                              aria-invalid={Boolean(activeError)}
                              role={hasLocationAutocomplete ? "combobox" : undefined}
                              aria-expanded={
                                hasLocationAutocomplete ? showLocationSuggestions : undefined
                              }
                              aria-controls={
                                hasLocationAutocomplete ? "location-suggestions" : undefined
                              }
                              aria-autocomplete={hasLocationAutocomplete ? "list" : undefined}
                              aria-haspopup={hasLocationAutocomplete ? "listbox" : undefined}
                              autoComplete="off"
                            />
                            {hasLocationAutocomplete && showLocationSuggestions && (
                              <div
                                id="location-suggestions"
                                role="listbox"
                                className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl"
                              >
                                {isFetchingLocationSuggestions ? (
                                  <p className="px-4 py-3 text-sm text-neutral-500">
                                    Recherche en cours…
                                  </p>
                                ) : locationSuggestions.length > 0 ? (
                                  <ul className="divide-y divide-neutral-100">
                                    {locationSuggestions.map((suggestion) => (
                                      <li key={suggestion}>
                                        <button
                                          type="button"
                                          className="flex w-full items-start px-4 py-3 text-left text-sm text-neutral-700 transition hover:bg-red-50"
                                          onMouseDown={(event) => event.preventDefault()}
                                          onClick={() => handleLocationSelect(suggestion)}
                                        >
                                          {suggestion}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (values.location ?? "").trim().length >= 3 ? (
                                  <p className="px-4 py-3 text-sm text-neutral-500">
                                    Aucun lieu trouvé. Essayez une autre saisie.
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) => handleChange(activeQuestion.field, event.target.value)}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm text-neutral-800 focus:outline-none ${
                              activeError
                                ? "border-red-500"
                                : "border-neutral-200 focus:border-red-500"
                            }`}
                            placeholder={activeQuestion.placeholder}
                            aria-invalid={Boolean(activeError)}
                          />
                        )
                      )}

                      {!activeQuestion.options && activeQuestion.inputType === "tel" && (
                        <input
                          type="tel"
                          value={values[activeQuestion.field] ?? ""}
                          onChange={(event) => handleChange(activeQuestion.field, event.target.value)}
                          className={`w-full rounded-2xl border px-4 py-3 text-sm text-neutral-800 focus:outline-none ${
                            activeError ? "border-red-500" : "border-neutral-200 focus:border-red-500"
                          }`}
                          placeholder={activeQuestion.placeholder}
                          aria-invalid={Boolean(activeError)}
                        />
                      )}

                        {!activeQuestion.options && activeQuestion.inputType === "email" && (
                          <input
                            type="email"
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) => handleChange(activeQuestion.field, event.target.value)}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm text-neutral-800 focus:outline-none ${
                              activeError ? "border-red-500" : "border-neutral-200 focus:border-red-500"
                            }`}
                            placeholder={activeQuestion.placeholder}
                            aria-invalid={Boolean(activeError)}
                          />
                        )}

                        {activeError ? (
                          <p className="text-xs text-red-500">{activeError}</p>
                        ) : null}
                      </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {currentStep === stepQuestions.length - 1
                        ? isSending
                          ? "Envoi..."
                          : "Envoyer ma demande"
                        : "Continuer"}
                    </button>
                    {submitError ? (
                      <p className="text-center text-xs text-red-500">{submitError}</p>
                    ) : null}
                    {liveSummary.length > 0 && (
                      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">Recapitulatif en direct</p>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                          {liveSummary.map((item) => (
                            <li key={item.id} className="flex items-start justify-between gap-3">
                              <span className="max-w-[55%] font-medium text-neutral-500">{item.label}</span>
                              <span className="flex-1 text-right text-neutral-900">{item.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="mt-8 space-y-6">
                    <div className="rounded-3xl bg-black px-6 py-6 text-white">
                      <h4 className="text-lg font-semibold text-white">
                        Merci ! Votre demande est enregistrée.
                      </h4>
                      <p className="mt-2 text-sm text-neutral-100">
                        Un conseiller Pro Alarme vous rappellera dans les meilleurs délais au numéro indiqué pour valider votre abonnement.
                      </p>
                      <p className="mt-4 text-sm text-neutral-100">
                        Le démarrage de votre contrat demandera un règlement global de 150 000 F CFA&nbsp;:
                        100 000 F CFA de frais d’installation puis 50 000 F CFA pour le premier mois d’abonnement.
                      </p>
                      <p className="mt-4 text-sm text-neutral-100">
                        L’installation est planifiée sous 72 heures après validation de votre dossier.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                        Récapitulatif transmis
                      </h5>
                      <ul className="space-y-3 text-sm text-neutral-700">
                        {summary.map((item) => (
                          <li key={item.label} className="flex justify-between rounded-2xl bg-neutral-100 px-4 py-3">
                            <span className="font-medium text-neutral-500">{item.label}</span>
                            <span className="text-neutral-900">{item.value}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="mailto:commercial@proalarme.ci"
                        className="inline-flex items-center justify-center rounded-full border border-black px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
                      >
                        Écrire au service commercial
                      </a>
                      <a
                        href="https://wa.me/2250710701212"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-analytics-id="cta-success-whatsapp"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-green-700 transition hover:bg-green-500 hover:text-white"
                      >
                        Contacter via WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </section>

        <section data-animate-on-scroll className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div
              data-animate-on-scroll
              style={createDelayStyle(0)}
              className="space-y-6"
            >
              <h2 className="text-3xl font-semibold text-black md:text-4xl">
                Une offre unique, calibrée pour Vous!
              </h2>
              <p className="text-lg text-white">
                Notre solution évolutive s’adapte à vos besoins : nous dimensionnons l’équipement et les détecteurs nécessaires pour protéger chaque site, puis déclenchons immédiatement les protocoles en cas d’alerte.
              </p>
            </div>
            <div className="grid gap-4">
              {pricingHighlights.map((item, index) => (
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(index * 100)}
                  key={item}
                  className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-6 py-5 shadow-sm"
                >
                  <span className="mt-1 h-3 w-3 rounded-full bg-red-500" />
                  <p className="text-base text-neutral-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section data-animate-on-scroll className="bg-black py-20 text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row">
            <div
              data-animate-on-scroll
              style={createDelayStyle(0)}
              className="lg:w-2/5"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-red-300">Tout est compris</span>
              <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
                Un accompagnement complet pour sécuriser sans surprise vos opérations.
              </h2>
              <p className="mt-4 text-sm text-neutral-200">
                Chaque abonnement inclut les prestations nécessaires pour rester opérationnel 24/7 et pas de coûts cachés.
              </p>
            </div>
            <ul className="flex-1 space-y-4">
              {includedFeatures.map((feature, index) => (
                <li
                  data-animate-on-scroll
                  style={createDelayStyle(index * 120)}
                  key={feature}
                  className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm leading-relaxed text-neutral-100"
                >
                  <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-xs font-semibold text-red-200">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section data-animate-on-scroll className="bg-neutral-50 py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 lg:flex-row">
            <div
              data-animate-on-scroll
              style={createDelayStyle(0)}
              className="space-y-6 lg:w-1/2"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-red-500">Notre équipe</span>
              <h2 className="text-3xl font-semibold text-black md:text-4xl">
                Des expertes et experts proches de vos réalités terrain.
              </h2>
              <p className="text-lg text-neutral-700">
                Agents de sécurité, techniciennes et superviseurs suivent votre installation et vous accompagnent à chaque étape, de l’audit initial aux interventions urgentes.
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                  Recrutement rigoureux et formations continues des équipes.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                  Technicien(ne)s qualifiié(e)s pour vos dispositifs.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-500" />
                  Supervision 24/7 et reporting après chaque intervention.
                </li>
              </ul>
            </div>
            <div className="grid flex-1 gap-6 md:grid-cols-2">
              <div
                data-animate-on-scroll
                style={createDelayStyle(160)}
                className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              >
                <Image
                  src={technicianImageSrc}
                  alt="Technicienne Pro Alarme installant un système sur site"
                  width={1000}
                  height={1200}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 768px) 320px, 100vw"
                />
              </div>
              <div className="grid gap-6">
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(240)}
                  className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  <Image
                    src={telesurveillanceImageSrc}
                    alt="Opérateur de télésurveillance surveillant les alertes en temps réel"
                    width={900}
                    height={900}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 768px) 320px, 100vw"
                  />
                </div>
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(320)}
                  className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                >
                  <Image
                    src={agentSecurityImageSrc}
                    alt="Agent de sécurité Pro Alarme échangeant avec une cliente"
                    width={900}
                    height={900}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 768px) 320px, 100vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-animate-on-scroll className="bg-black py-20 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div
                  data-animate-on-scroll
                  style={createDelayStyle(index * 140)}
                  key={advantage.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-semibold text-white">{advantage.title}</h3>
                  <p className="mt-3 text-sm text-neutral-200">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section data-animate-on-scroll className="bg-white py-20">
          <div className="mx-auto max-w-5xl space-y-8 px-6">
            <h2 className="text-center text-3xl font-semibold text-black">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  data-animate-on-scroll
                  style={createDelayStyle(index * 120)}
                  key={faq.question}
                  className="group rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-5 transition hover:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-black">
                    <span>{faq.question}</span>
                    <span className="text-red-500 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-neutral-700">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-animate-on-scroll className="bg-black py-20 text-white">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 text-center">
            <div
              data-animate-on-scroll
              style={createDelayStyle(0)}
              className="max-w-3xl space-y-4"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-red-300">Passer à l’action</span>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Réservez votre audit gratuit et sécurisez vos sites dès cette semaine.
              </h2>
              <p className="text-sm text-neutral-200">
                Un conseiller dédié coordonne la visite technique, valide votre plan de sécurisation et active la télésurveillance sans coupure d’activité.
              </p>
            </div>
            <div
              data-animate-on-scroll
              style={createDelayStyle(200)}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <button
                type="button"
                onClick={handleActivateForm}
                data-analytics-id="cta-bottom-audit"
                className="rounded-full bg-red-500 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-400"
              >
                Demander mon devis rapide
              </button>
              <a
                href="tel:+2250710701212"
                data-analytics-id="cta-bottom-call"
                className="rounded-full border border-white/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
              >
                Parler à une experte maintenant
              </a>
              <a
                href="https://wa.me/2250710701212"
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="cta-bottom-whatsapp"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-100 transition hover:border-green-400 hover:text-white"
              >
                Échanger sur WhatsApp
              </a>
            </div>
            <ul className="grid gap-3 text-left text-xs text-neutral-100 sm:grid-cols-3">
              {guarantees.map((guarantee, index) => (
                <li
                  data-animate-on-scroll
                  style={createDelayStyle(index * 140)}
                  key={guarantee}
                  className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="mt-0.5 text-red-300">•</span>
                  <span>{guarantee}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-white">Pro Alarme Côte d’Ivoire</h4>
            <p className="mt-2 text-sm text-neutral-400">
              Sécurisez vos sites stratégiques avec une équipe locale disponible 7j/7, 24h/24.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-neutral-400 md:items-end">
            <a href="tel:+2250710701212" className="hover:text-white">
              +225 07 10 70 12 12
            </a>
            <a href="mailto:contact@proalarme.ci" className="hover:text-white">
              contact@proalarme.ci
            </a>
            <a href="/terms" className="hover:text-white">
              Termes & conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
