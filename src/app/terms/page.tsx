export default function TermsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-20 text-neutral-900">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-4xl font-semibold text-black">Termes &amp; Conditions</h1>
        <p className="mt-6 text-sm text-neutral-600">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>

        <section className="mt-10 space-y-6 text-base leading-7 text-neutral-700">
          <p>
            Ces Termes &amp; Conditions encadrent la fourniture des services de télésurveillance, d’installation et de
            maintenance proposés par Pro Alarme Côte d’Ivoire (ci-après « Pro Alarme »). En souscrivant à un abonnement
            ou en sollicitant un devis, le client reconnaît avoir pris connaissance et accepté les présentes conditions
            générales.
          </p>

          <h2 className="text-2xl font-semibold text-black">1. Objet du contrat</h2>
          <p>
            Pro Alarme fournit au client un système de sécurité comprenant le matériel défini dans l’offre commerciale,
            son installation, la télésurveillance 24/7 et l’intervention d’agents en cas d’incident. Tout ajout de matériel
            ou service optionnel fera l’objet d’un avenant tarifaire.
          </p>

          <h2 className="text-2xl font-semibold text-black">2. Durée et résiliation</h2>
          <p>
            Les abonnements sont conclus pour une durée indéterminée avec un préavis de résiliation de 30 jours. La
            résiliation doit être formulée par écrit à l’adresse e-mail contractuelle. Les sommes dues au titre des services
            rendus restent exigibles à la date effective de résiliation.
          </p>

          <h2 className="text-2xl font-semibold text-black">3. Tarifs et facturation</h2>
          <p>
            Le tarif mensuel standard est fixé à 65 000 F CFA. Des remises peuvent s’appliquer selon la périodicité de
            paiement (10 % annuel, 5 % trimestriel) et le nombre de sites sécurisés (5 % supplémentaires par site à partir
            de deux sites). Les frais d’installation, d’un montant de 100 000 F CFA pour le kit de base, sont facturés lors de
            la mise en service.
          </p>

          <h2 className="text-2xl font-semibold text-black">4. Obligations du client</h2>
          <p>
            Le client s’engage à fournir l’accès aux sites pour l’installation et la maintenance, à informer Pro Alarme de
            toute anomalie constatée sur le système et à maintenir ses coordonnées de contact (téléphone et e-mail)
            actualisées afin de garantir la bonne exécution du contrat.
          </p>

          <h2 className="text-2xl font-semibold text-black">5. Maintenance &amp; service après-vente</h2>
          <p>
            La maintenance préventive et corrective du matériel fourni est incluse dans l’abonnement. Pro Alarme intervient
            sans frais supplémentaires pour toute panne liée au matériel ou à l’installation initiale. Les interventions
            provoquées par une mauvaise utilisation ou la détérioration volontaire pourront être facturées au client.
          </p>

          <h2 className="text-2xl font-semibold text-black">6. Responsabilité</h2>
          <p>
            Pro Alarme met en œuvre tous les moyens nécessaires pour assurer la sécurité des sites, notamment par une
            prise en charge des alertes en moins de 60 secondes et l’envoi d’agents en moins de 15 minutes à Abidjan. La
            responsabilité de Pro Alarme ne saurait toutefois être engagée en cas de force majeure ou d’événements
            indépendants de sa volonté.
          </p>

          <h2 className="text-2xl font-semibold text-black">7. Protection des données</h2>
          <p>
            Les données personnelles collectées (téléphone, e-mail, informations sur les sites) sont utilisées pour le
            traitement des demandes, la gestion du contrat et l’envoi d’offres promotionnelles. Conformément à la
            réglementation en vigueur, le client dispose d’un droit d’accès, de rectification et d’opposition en écrivant à
            privacy@proalarme.ci.
          </p>

          <h2 className="text-2xl font-semibold text-black">8. Droit applicable</h2>
          <p>
            Les présentes conditions sont soumises au droit ivoirien. Tout litige relatif à l’interprétation ou à
            l’exécution du contrat sera soumis aux tribunaux compétents d’Abidjan.
          </p>
        </section>
      </div>
    </div>
  );
}
