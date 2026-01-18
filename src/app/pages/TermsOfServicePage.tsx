// MBK: Terms of Service Page - Conditions d'utilisation légales et complètes
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function TermsOfServicePage() {
  // MBK: Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              Les présentes Conditions Générales d'Utilisation (ci-après les "CGU") régissent l'utilisation de la plateforme 
              <strong> LeadFlow</strong>, un service SaaS de prospection commerciale automatisée par intelligence artificielle.
            </p>
            <p className="text-sm text-gray-500">
              En utilisant notre service, vous acceptez sans réserve les présentes conditions. Si vous n'acceptez pas ces conditions, 
              veuillez ne pas utiliser notre plateforme.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Informations Légales</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                La plateforme LeadFlow est exploitée par :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">LeadFlow</p>
                <p className="text-gray-700 mb-1">Fondateurs : Mehdi Ben Khadra et Roman Gradante</p>
                <p className="text-gray-700 mb-1">Email : contact@leadflow.ai</p>
                <p className="text-gray-700 mb-1">Support : support@leadflow.ai</p>
                <p className="text-gray-700">Pour toute question légale : legal@leadflow.ai</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Objet et Définitions</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">2.1. Objet</h3>
              <p className="text-gray-700 mb-4">
                LeadFlow est une plateforme SaaS permettant aux entreprises de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Automatiser la prospection commerciale par email et téléphone</li>
                <li>Gérer des campagnes de démarchage avec intelligence artificielle</li>
                <li>Qualifier et contacter des prospects de manière automatisée</li>
                <li>Réserver des rendez-vous commerciaux</li>
                <li>Analyser les performances des campagnes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2. Définitions</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>"Service" :</strong> La plateforme LeadFlow accessible via internet</li>
                <li><strong>"Utilisateur" ou "Client" :</strong> Toute personne physique ou morale utilisant le Service</li>
                <li><strong>"Compte" :</strong> L'espace personnel créé par l'Utilisateur pour accéder au Service</li>
                <li><strong>"Abonnement" :</strong> L'engagement contractuel donnant accès au Service selon un plan tarifaire</li>
                <li><strong>"Campagne" :</strong> Une action de prospection automatisée créée par l'Utilisateur</li>
                <li><strong>"Prospect" :</strong> Une personne ou entreprise ciblée par une Campagne</li>
                <li><strong>"Contenu" :</strong> Tous les éléments (textes, données, fichiers) ajoutés par l'Utilisateur</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Acceptation des Conditions</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                L'utilisation du Service implique l'acceptation pleine et entière des présentes CGU. 
                En créant un compte ou en utilisant le Service, vous reconnaissez avoir lu, compris et accepté ces conditions.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Important :</strong> Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le Service. 
                  L'utilisation du Service vaut acceptation des CGU en vigueur au moment de l'utilisation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Création de Compte et Inscription</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">4.1. Conditions d'Inscription</h3>
              <p className="text-gray-700 mb-4">
                Pour utiliser le Service, vous devez :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Être âgé d'au moins 18 ans ou avoir l'autorisation d'un représentant légal</li>
                <li>Fournir des informations exactes, complètes et à jour</li>
                <li>Maintenir la sécurité de votre compte (mot de passe, 2FA)</li>
                <li>Être responsable de toutes les activités sous votre compte</li>
                <li>Notifier immédiatement toute utilisation non autorisée</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2. Vérification</h3>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Vérifier l'identité des Utilisateurs</li>
                <li>Refuser ou suspendre un compte en cas de suspicion de fraude</li>
                <li>Demander des documents justificatifs supplémentaires</li>
                <li>Limiter l'accès en cas de non-respect des CGU</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Description du Service</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">5.1. Fonctionnalités</h3>
              <p className="text-gray-700 mb-4">
                LeadFlow propose les fonctionnalités suivantes (selon votre plan d'abonnement) :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Génération automatique d'emails personnalisés par IA</li>
                <li>Envoi d'emails de prospection en masse</li>
                <li>Appels téléphoniques automatisés avec IA vocale</li>
                <li>Gestion de campagnes de prospection</li>
                <li>Qualification automatique de prospects</li>
                <li>Réservation automatique de rendez-vous</li>
                <li>Analytics et reporting de performance</li>
                <li>Intégrations avec CRM et outils tiers</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.2. Disponibilité</h3>
              <p className="text-gray-700 mb-4">
                Nous nous efforçons d'assurer une disponibilité du Service de 99.9%. Cependant :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Des interruptions peuvent survenir pour maintenance, mises à jour ou cas de force majeure</li>
                <li>Nous ne garantissons pas une disponibilité à 100%</li>
                <li>Les maintenances seront annoncées dans la mesure du possible</li>
                <li>Nous ne sommes pas responsables des interruptions dues à des tiers (fournisseurs internet, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">5.3. Modifications du Service</h3>
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Modifier, suspendre ou interrompre toute fonctionnalité à tout moment</li>
                <li>Ajouter de nouvelles fonctionnalités</li>
                <li>Retirer des fonctionnalités (avec préavis raisonnable)</li>
                <li>Modifier l'interface et l'expérience utilisateur</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Tarification et Paiement</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">6.1. Plans d'Abonnement</h3>
              <p className="text-gray-700 mb-4">
                Les tarifs et fonctionnalités de chaque plan sont détaillés sur notre site web. 
                Nous nous réservons le droit de modifier les tarifs à tout moment, avec un préavis de 30 jours pour les abonnements en cours.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2. Facturation</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Les abonnements sont facturés mensuellement ou annuellement selon le plan choisi</li>
                <li>Le paiement est dû à l'avance pour chaque période d'abonnement</li>
                <li>Les factures sont envoyées par email et disponibles dans votre compte</li>
                <li>Les paiements sont traités par des prestataires tiers sécurisés (Stripe, PayPal)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.3. Renouvellement Automatique</h3>
              <p className="text-gray-700 mb-4">
                Votre abonnement se renouvelle automatiquement à la fin de chaque période, sauf résiliation de votre part. 
                Vous pouvez désactiver le renouvellement automatique à tout moment dans les paramètres de votre compte.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.4. Retard de Paiement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>En cas de paiement refusé ou retardé, nous pouvons suspendre votre accès au Service</li>
                <li>Des frais de retard peuvent s'appliquer conformément à la législation en vigueur</li>
                <li>Après 30 jours de non-paiement, votre compte peut être définitivement fermé</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.5. Remboursements</h3>
              <p className="text-gray-700 mb-4">
                Conformément à la législation française, vous disposez d'un droit de rétractation de 14 jours à compter de la souscription. 
                Au-delà de ce délai, aucun remboursement n'est dû sauf cas exceptionnels à notre discrétion.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Obligations de l'Utilisateur</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">7.1. Utilisation Légale</h3>
              <p className="text-gray-700 mb-4">
                Vous vous engagez à utiliser le Service uniquement à des fins légales et conformément aux présentes CGU. 
                Vous vous engagez notamment à :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Respecter toutes les lois et réglementations applicables (RGPD, loi anti-spam, etc.)</li>
                <li>Ne pas utiliser le Service pour envoyer du spam ou des communications non sollicitées</li>
                <li>Respecter les listes d'opposition (Robinson, Bloctel en France)</li>
                <li>Obtenir les consentements nécessaires avant de contacter des prospects</li>
                <li>Ne pas utiliser le Service pour des activités frauduleuses, illégales ou nuisibles</li>
                <li>Ne pas tenter de contourner les limitations techniques du Service</li>
                <li>Ne pas accéder ou tenter d'accéder à des comptes d'autres utilisateurs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.2. Responsabilité des Données</h3>
              <p className="text-gray-700 mb-4">
                Vous êtes seul responsable de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>La légalité des données de prospects que vous importez</li>
                <li>L'obtention des consentements nécessaires pour contacter vos prospects</li>
                <li>Le respect du RGPD et des lois sur la protection des données</li>
                <li>Le contenu des emails et messages envoyés via le Service</li>
                <li>Les conséquences de vos campagnes de prospection</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Attention :</strong> Toute violation des lois sur la protection des données ou le démarchage 
                  commercial engage votre seule responsabilité. LeadFlow ne peut être tenu responsable de l'utilisation 
                  illégale que vous faites du Service.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.3. Sécurité du Compte</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Vous êtes responsable de la confidentialité de vos identifiants de connexion</li>
                <li>Vous devez notifier immédiatement toute utilisation non autorisée de votre compte</li>
                <li>Vous ne devez pas partager votre compte avec des tiers</li>
                <li>Nous recommandons fortement l'activation de l'authentification à deux facteurs (2FA)</li>
              </ul>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Propriété Intellectuelle</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">8.1. Propriété de LeadFlow</h3>
              <p className="text-gray-700 mb-4">
                Tous les éléments de la plateforme LeadFlow (code, design, logos, marques, contenus) sont la propriété 
                exclusive de LeadFlow ou de ses partenaires. Toute reproduction, même partielle, est interdite sans autorisation écrite.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.2. Propriété de l'Utilisateur</h3>
              <p className="text-gray-700 mb-4">
                Vous conservez tous les droits sur :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Les données de prospects que vous importez</li>
                <li>Le contenu des emails que vous créez (hors génération IA)</li>
                <li>Vos propres créations et contenus</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.3. Licence d'Utilisation</h3>
              <p className="text-gray-700 mb-4">
                En utilisant le Service, nous vous accordons une licence limitée, non exclusive, non transférable et révocable 
                d'utiliser la plateforme pour vos besoins professionnels, dans le cadre de votre abonnement.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">8.4. Contenu Généré par IA</h3>
              <p className="text-gray-700 mb-4">
                Les contenus générés par notre IA (emails, scripts) sont fournis "en l'état". Vous pouvez les utiliser pour vos 
                campagnes, mais LeadFlow ne garantit pas leur originalité ou leur absence de similarité avec d'autres contenus.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Limitation de Responsabilité</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">9.1. Exclusion de Garanties</h3>
              <p className="text-gray-700 mb-4">
                Le Service est fourni "en l'état" et "selon disponibilité". Nous ne garantissons pas :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Que le Service répondra à toutes vos attentes</li>
                <li>Que le Service sera ininterrompu, sécurisé ou exempt d'erreurs</li>
                <li>Que les résultats de vos campagnes seront conformes à vos objectifs</li>
                <li>Que les données seront toujours disponibles ou non perdues</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">9.2. Limitation de Responsabilité</h3>
              <p className="text-gray-700 mb-4">
                Dans les limites autorisées par la loi :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Notre responsabilité est limitée au montant des sommes versées par vous au cours des 12 derniers mois</li>
                <li>Nous ne sommes pas responsables des dommages indirects (perte de profits, perte de données, etc.)</li>
                <li>Nous ne sommes pas responsables de l'utilisation illégale que vous faites du Service</li>
                <li>Nous ne sommes pas responsables des actions de tiers (prospects, fournisseurs, etc.)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">9.3. Force Majeure</h3>
              <p className="text-gray-700 mb-4">
                Nous ne sommes pas responsables des retards ou défaillances dus à des cas de force majeure (catastrophes naturelles, 
                grèves, pannes internet, etc.).
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Résiliation</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">10.1. Résiliation par l'Utilisateur</h3>
              <p className="text-gray-700 mb-4">
                Vous pouvez résilier votre abonnement à tout moment depuis les paramètres de votre compte. 
                La résiliation prend effet à la fin de la période d'abonnement en cours. Aucun remboursement partiel n'est dû.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">10.2. Résiliation par LeadFlow</h3>
              <p className="text-gray-700 mb-4">
                Nous pouvons suspendre ou résilier votre compte immédiatement en cas de :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Violation des présentes CGU</li>
                <li>Utilisation illégale du Service</li>
                <li>Non-paiement des sommes dues</li>
                <li>Comportement frauduleux ou abusif</li>
                <li>Atteinte à la réputation de LeadFlow</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">10.3. Conséquences de la Résiliation</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Votre accès au Service sera immédiatement suspendu</li>
                <li>Vos données seront conservées pendant 30 jours, puis supprimées définitivement</li>
                <li>Vous pouvez exporter vos données avant la suppression définitive</li>
                <li>Aucun remboursement n'est dû en cas de résiliation pour violation des CGU</li>
              </ul>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Protection des Données</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Le traitement de vos données personnelles est régi par notre 
                <Link to="/privacy-policy" className="text-primary hover:underline ml-1">Politique de Confidentialité</Link>, 
                qui fait partie intégrante des présentes CGU.
              </p>
              <p className="text-gray-700">
                En utilisant le Service, vous acceptez également notre politique de confidentialité.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Modifications des CGU</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les modifications importantes seront :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Publiées sur cette page avec une nouvelle date de "Dernière mise à jour"</li>
                <li>Notifiées par email aux utilisateurs actifs (30 jours avant l'entrée en vigueur)</li>
                <li>Affichées dans l'interface de la plateforme</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Important :</strong> Si vous n'acceptez pas les nouvelles CGU, vous devez résilier votre abonnement 
                  avant leur entrée en vigueur. La poursuite de l'utilisation du Service vaut acceptation des nouvelles conditions.
                </p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Droit Applicable et Juridiction</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Les présentes CGU sont régies par le droit français. En cas de litige :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Une solution amiable sera recherchée en priorité</li>
                <li>À défaut d'accord, les tribunaux français seront compétents</li>
                <li>Conformément à la législation européenne, vous pouvez également recourir à la médiation ou à la plateforme 
                  de règlement en ligne des litiges de l'UE</li>
              </ul>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">14. Dispositions Générales</h2>
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-xl font-semibold mb-3 mt-4">14.1. Intégralité de l'Accord</h3>
              <p className="text-gray-700 mb-4">
                Les présentes CGU, ainsi que notre Politique de Confidentialité, constituent l'intégralité de l'accord entre vous et LeadFlow 
                concernant l'utilisation du Service.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">14.2. Divisibilité</h3>
              <p className="text-gray-700 mb-4">
                Si une clause des présentes CGU est jugée invalide, les autres clauses restent en vigueur.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">14.3. Non-Renonciation</h3>
              <p className="text-gray-700 mb-4">
                Le fait pour LeadFlow de ne pas exercer un droit prévu par les présentes CGU ne constitue pas une renonciation à ce droit.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">14.4. Cession</h3>
              <p className="text-gray-700 mb-4">
                Vous ne pouvez pas céder ou transférer vos droits et obligations sans notre accord écrit. 
                Nous pouvons céder nos droits et obligations à tout moment, notamment en cas de fusion ou d'acquisition.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">15. Contact</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant les présentes Conditions Générales d'Utilisation :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">LeadFlow - Service Juridique</p>
                <p className="text-gray-700 mb-1">Email : <a href="mailto:legal@leadflow.ai" className="text-primary hover:underline">legal@leadflow.ai</a></p>
                <p className="text-gray-700 mb-1">Support : <a href="mailto:support@leadflow.ai" className="text-primary hover:underline">support@leadflow.ai</a></p>
                <p className="text-gray-700">Nous répondrons à votre demande dans les meilleurs délais.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t flex items-center justify-between">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <p className="text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
