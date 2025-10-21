"use client";

import { useMemo, useState } from "react";

const advantages = [
  {
    title: "Réponse ultra-rapide",
    description:
      "Prise en charge de chaque incident en moins de 60 secondes par nos opérateurs certifiés.",
  },
  {
    title: "Maintenance & SAV offerts",
    description:
      "Notre équipe dédiée assure gratuitement l’entretien du système et la mise à jour des équipements.",
  },
  {
    title: "Intervention express",
    description:
      "Agents mobiles déployés partout à Abidjan en moins de 15 minutes, 7j/7 et 24h/24.",
  },
];

const faqs = [
  {
    question: "Quelle est la durée d’engagement ?",
    answer:
      "Les abonnements sont sans engagement long terme. Vous pouvez résilier à tout moment avec un préavis de 30 jours.",
  },
  {
    question: "Comment fonctionnent les remises multi-sites ?",
    answer:
      "À partir de deux sites, une remise additionnelle de 5 % est appliquée sur chacun des sites sécurisés.",
  },
  {
    question: "Puis-je ajouter des détecteurs supplémentaires ?",
    answer:
      "Oui, notre équipe conçoit un plan sur-mesure et ajoute les détecteurs nécessaires lors de la visite technique initiale.",
  },
];

const pricingHighlights = [
  "Abonnement mensuel à 65 000 F CFA",
  "Frais d’installation à 100 000 F CFA incluant 2 détecteurs, 1 sirène et 1 télécommande",
  "Remise de 10 % pour un paiement annuel",
  "Remise de 5 % pour un paiement trimestriel",
  "À partir de 2 sites : 5 % de remise supplémentaire par site",
];

type StepValues = {
  siteType?: string;
  siteCount?: string;
  location?: string;
  phone?: string;
  email?: string;
  notes?: string;
};

type StepField = keyof StepValues;

type InputType = "select" | "number" | "text" | "tel" | "email" | "textarea";

type StepQuestion = {
  id: number;
  title: string;
  subtitle: string;
  field: StepField;
  inputType: InputType;
  options?: string[];
};

const stepQuestions: StepQuestion[] = [
  {
    id: 1,
    title: "Quel type de site souhaitez-vous protéger ?",
    subtitle: "Choisissez la configuration principale pour adapter la solution.",
    field: "siteType",
    inputType: "select",
    options: [
      "Résidence principale",
      "Entreprise / Bureau",
      "Commerce / Magasin",
      "Entrepôt / Site industriel",
      "Autre (précisez)",
    ],
  },
  {
    id: 2,
    title: "Combien de sites sont à sécuriser ?",
    subtitle: "Nos offres multi-sites déclenchent automatiquement les remises adaptées.",
    field: "siteCount",
    inputType: "number",
  },
  {
    id: 3,
    title: "Où se situe votre site principal ?",
    subtitle: "Nous intervenons partout à Abidjan en moins de 15 minutes.",
    field: "location",
    inputType: "text",
  },
  {
    id: 4,
    title: "Quel est votre numéro de téléphone ?",
    subtitle: "Nous privilégions l’appel pour valider l’audit de sécurité.",
    field: "phone",
    inputType: "tel",
  },
  {
    id: 5,
    title: "Quelle adresse e-mail devons-nous utiliser pour vos factures ?",
    subtitle: "Recevez également nos offres promotionnelles dédiées aux clients Pro Alarme.",
    field: "email",
    inputType: "email",
  },
  {
    id: 6,
    title: "Souhaitez-vous ajouter un commentaire ?",
    subtitle: "Précisez vos besoins particuliers (zones sensibles, horaires, etc.).",
    field: "notes",
    inputType: "textarea",
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<StepValues>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeQuestion: StepQuestion = useMemo(
    () => stepQuestions[Math.min(currentStep, stepQuestions.length - 1)],
    [currentStep]
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
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleNext();
  };

  const summary = useMemo(() => {
    return [
      { label: "Type de site", value: values.siteType },
      { label: "Nombre de sites", value: values.siteCount },
      { label: "Localisation", value: values.location },
      { label: "Téléphone", value: values.phone },
      { label: "E-mail", value: values.email },
      { label: "Notes", value: values.notes },
    ].filter((item) => item.value && item.value.trim().length > 0);
  }, [values]);

  return (
    <div className="bg-[#0d0d0d] text-white">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,#ff1f1f,transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-32 pt-24 md:pt-32">
          <nav className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-red-200">
            <span className="font-semibold text-red-500">Pro Alarme</span>
            <a href="#abonnement" className="hover:text-white">
              Abonnement
            </a>
          </nav>
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-red-200">
                Protection totale Abidjan
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                Le système d’alarme professionnel pensé pour la réactivité absolue.
              </h1>
              <p className="max-w-xl text-lg text-neutral-200">
                Surveillez vos sites sensibles, rassurez vos équipes et réduisez drastiquement les risques. Pro Alarme combine technologie de pointe, supervision 24/7 et interventions express.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#devis"
                  className="rounded-full bg-red-500 px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_40px_rgba(239,68,68,0.4)] transition hover:bg-red-400"
                >
                  Demander un audit gratuit
                </a>
                <a
                  href="tel:+2250102030405"
                  className="rounded-full border border-white/20 px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white"
                >
                  Nous appeler maintenant
                </a>
              </div>
            </div>
            <div className="relative flex h-full justify-center">
              <div className="absolute -left-8 top-8 hidden h-32 w-32 rounded-full border border-red-500/40 md:block" />
              <div className="absolute -right-10 bottom-6 hidden h-24 w-24 rounded-full border border-red-500/30 md:block" />
              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="flex items-center justify-between text-xs text-white/70">
                  <span>Réponse 24/7</span>
                  <span>Centre de télésurveillance</span>
                </div>
                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl bg-black/60 px-6 py-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-300">Incidents</p>
                    <p className="mt-3 text-3xl font-semibold text-white">&lt; 60 s</p>
                    <p className="mt-1 text-sm text-neutral-300">Temps moyen de prise en charge</p>
                  </div>
                  <div className="rounded-2xl bg-black/60 px-6 py-5">
                    <p className="text-sm uppercase tracking-[0.3em] text-red-300">Interventions</p>
                    <p className="mt-3 text-3xl font-semibold text-white">&lt; 15 min</p>
                    <p className="mt-1 text-sm text-neutral-300">Déploiement d’agents partout à Abidjan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-white text-black">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-black md:text-4xl">
                Une offre unique, calibrée pour les professionnels exigeants.
              </h2>
              <p className="text-lg text-neutral-700">
                Notre kit standard intègre 2 détecteurs intelligents, 1 sirène intérieure haute intensité et 1 télécommande d’armement. Nous supervisons vos sites 24/7 et déclenchons immédiatement les protocoles en cas d’alerte.
              </p>
            </div>
            <div className="grid gap-4">
              {pricingHighlights.map((item) => (
                <div
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

        <section className="bg-black py-20 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
            {advantages.map((advantage) => (
              <div
                key={advantage.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                <h3 className="text-xl font-semibold text-white">{advantage.title}</h3>
                <p className="mt-3 text-sm text-neutral-200">{advantage.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="devis" className="relative overflow-hidden bg-neutral-100 py-20">
          <div className="absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 md:flex-row">
            <div className="md:w-1/2">
              <span className="text-xs uppercase tracking-[0.3em] text-red-500">Comment ça marche</span>
              <h2 className="mt-4 text-3xl font-semibold text-black md:text-4xl">
                Un processus fluide pour sécuriser vos sites sans friction.
              </h2>
              <p className="mt-4 text-neutral-700">
                Répondez à quelques questions, nos experts vous recontactent immédiatement pour un diagnostic personnalisé et la planification de l’installation.
              </p>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-semibold text-white">
                    1
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-black">Questions ciblées</h3>
                    <p className="text-sm text-neutral-700">
                      Un mini-audit pour adapter l’offre à vos contraintes opérationnelles.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-semibold text-white">
                    2
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-black">Validation & devis</h3>
                    <p className="text-sm text-neutral-700">
                      En moins d’une heure, vous recevez votre proposition détaillée par e-mail.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-lg font-semibold text-white">
                    3
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-black">Installation express</h3>
                    <p className="text-sm text-neutral-700">
                      Installation et tests en 48h, supervision active dès le premier jour.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div id="abonnement" className="md:w-1/2">
              <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">Demandez votre abonnement</h3>
                  <span className="rounded-full bg-black px-4 py-1 text-xs uppercase tracking-[0.2em] text-white">
                    Flot interactif
                  </span>
                </div>
                <p className="mt-3 text-sm text-neutral-600">
                  Répondez aux questions. Les champs apparaissent au fur et à mesure pour rester concentré sur l’essentiel.
                </p>

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-[0.3em] text-red-500">
                          Étape {currentStep + 1} / {stepQuestions.length}
                        </span>
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-xs uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
                          disabled={currentStep === 0}
                        >
                          Retour
                        </button>
                      </div>
                      <h4 className="mt-4 text-lg font-semibold text-black">{activeQuestion.title}</h4>
                      <p className="mt-2 text-sm text-neutral-600">{activeQuestion.subtitle}</p>

                      <div className="mt-6">
                        {activeQuestion.inputType === "select" && (
                          <select
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            required
                            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                          >
                            <option value="">Sélectionnez une option</option>
                            {activeQuestion.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {activeQuestion.inputType === "number" && (
                          <input
                            type="number"
                            min={1}
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            required
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                          />
                        )}

                        {activeQuestion.inputType === "text" && (
                          <input
                            type="text"
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            required
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                          />
                        )}

                        {activeQuestion.inputType === "tel" && (
                          <input
                            type="tel"
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            required
                            placeholder="Ex : +225 01 02 03 04 05"
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                          />
                        )}

                        {activeQuestion.inputType === "email" && (
                          <input
                            type="email"
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            required
                            placeholder="Ex : contact@entreprise.ci"
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                          />
                        )}

                        {activeQuestion.inputType === "textarea" && (
                          <textarea
                            value={values[activeQuestion.field] ?? ""}
                            onChange={(event) =>
                              handleChange(activeQuestion.field, event.target.value)
                            }
                            rows={4}
                            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 focus:border-red-500 focus:outline-none"
                            placeholder="Zones sensibles, horaires, procédure souhaitée..."
                          />
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-400"
                    >
                      {currentStep === stepQuestions.length - 1
                        ? "Envoyer ma demande"
                        : "Continuer"}
                    </button>
                  </form>
                ) : (
                  <div className="mt-8 space-y-6">
                    <div className="rounded-3xl bg-black px-6 py-6 text-white">
                      <h4 className="text-lg font-semibold text-white">
                        Merci ! Votre demande est enregistrée.
                      </h4>
                      <p className="mt-2 text-sm text-neutral-300">
                        Un conseiller Pro Alarme vous rappellera sous 15 minutes au numéro indiqué pour valider votre abonnement.
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-5xl space-y-8 px-6">
            <h2 className="text-center text-3xl font-semibold text-black">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
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
            <a href="tel:+2250102030405" className="hover:text-white">
              +225 01 02 03 04 05
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
