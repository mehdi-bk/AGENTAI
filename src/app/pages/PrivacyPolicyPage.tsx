// MBK: Privacy Policy Page - Politique de confidentialité légale et complète
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function PrivacyPolicyPage() {
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
            Politique de Confidentialité
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            <p className="text-lg text-gray-700 mb-6">
              Chez <strong>LeadFlow</strong>, nous nous engageons à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations 
              lorsque vous utilisez notre plateforme SaaS de prospection commerciale automatisée.
            </p>
            <p className="text-sm text-gray-500">
              Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne 
              et aux lois françaises sur la protection des données.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Responsable du Traitement des Données</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Le responsable du traitement de vos données personnelles est :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">LeadFlow</p>
                <p className="text-gray-700 mb-1">Fondateurs : Mehdi Ben Khadra et Roman Gradante</p>
                <p className="text-gray-700 mb-1">Email : privacy@leadflow.ai</p>
                <p className="text-gray-700">Pour toute question concernant vos données, contactez-nous à cette adresse.</p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Données Collectées</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous collectons les données suivantes lorsque vous utilisez notre service :
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">2.1. Données d'Identification</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Nom et prénom</li>
                <li>Adresse email professionnelle</li>
                <li>Numéro de téléphone</li>
                <li>Nom de l'entreprise</li>
                <li>Taille de l'entreprise</li>
                <li>Secteur d'activité</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2. Données de Connexion</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Date et heure de connexion</li>
                <li>Pages visitées</li>
                <li>Durée de session</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3. Données d'Utilisation</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Campagnes créées et gérées</li>
                <li>Prospects ajoutés et contactés</li>
                <li>Emails envoyés et réponses reçues</li>
                <li>Rendez-vous réservés</li>
                <li>Interactions avec l'interface</li>
                <li>Préférences et paramètres</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.4. Données de Paiement</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Informations de facturation (gérées par notre processeur de paiement tiers)</li>
                <li>Historique des transactions</li>
                <li>Informations d'abonnement</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">3. Finalités du Traitement</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Fourniture du service :</strong> Création et gestion de votre compte, accès à la plateforme, exécution des campagnes de prospection</li>
                <li><strong>Authentification :</strong> Vérification de votre identité, gestion des sessions de connexion</li>
                <li><strong>Communication :</strong> Envoi de notifications, réponses à vos demandes, support client</li>
                <li><strong>Amélioration du service :</strong> Analyse de l'utilisation, développement de nouvelles fonctionnalités, optimisation de la performance</li>
                <li><strong>Facturation :</strong> Gestion des abonnements, traitement des paiements, émission de factures</li>
                <li><strong>Conformité légale :</strong> Respect des obligations légales et réglementaires, prévention de la fraude</li>
                <li><strong>Marketing :</strong> Envoi d'informations sur nos services (avec votre consentement explicite)</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Base Légale du Traitement</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, nous traitons vos données sur les bases légales suivantes :
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Exécution du contrat :</strong> Données nécessaires à la fourniture du service que vous avez souscrit</li>
                <li><strong>Consentement :</strong> Pour l'envoi de communications marketing (vous pouvez retirer votre consentement à tout moment)</li>
                <li><strong>Obligation légale :</strong> Conservation des données de facturation pour obligations comptables</li>
                <li><strong>Intérêt légitime :</strong> Amélioration de nos services, sécurité de la plateforme, prévention de la fraude</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Conservation des Données</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous conservons vos données personnelles pour les durées suivantes :
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Données de compte actif :</strong> Pendant toute la durée de votre abonnement et 3 ans après la fermeture du compte</li>
                <li><strong>Données de facturation :</strong> 10 ans conformément aux obligations comptables françaises</li>
                <li><strong>Données de connexion :</strong> 12 mois maximum</li>
                <li><strong>Données de prospection :</strong> Pendant la durée d'utilisation du service et 2 ans après la fin de l'abonnement</li>
                <li><strong>Données après suppression de compte :</strong> Anonymisation ou suppression dans un délai de 30 jours, sauf obligations légales de conservation</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Partage des Données</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données avec :
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">6.1. Prestataires de Services</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Supabase :</strong> Hébergement de la base de données et authentification (conforme RGPD)</li>
                <li><strong>Processeurs de paiement :</strong> Stripe, PayPal (pour le traitement des paiements)</li>
                <li><strong>Services d'email :</strong> Resend, SendGrid (pour l'envoi d'emails transactionnels)</li>
                <li><strong>Services d'analyse :</strong> Google Analytics (avec anonymisation des IP)</li>
                <li><strong>Services d'IA :</strong> OpenAI, Anthropic (pour la génération de contenu, avec garanties de confidentialité)</li>
              </ul>
              <p className="text-gray-700 mt-4 italic">
                Tous nos prestataires sont soumis à des accords de confidentialité stricts et sont conformes au RGPD.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">6.2. Obligations Légales</h3>
              <p className="text-gray-700 ml-4">
                Nous pouvons divulguer vos données si la loi l'exige, en réponse à une demande judiciaire, 
                ou pour protéger nos droits et notre sécurité.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Vos Droits (RGPD)</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie de toutes les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez corriger toute donnée inexacte ou incomplète</li>
                <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données (sous réserve des obligations légales)</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez recevoir vos données dans un format structuré et les transférer à un autre service</li>
                <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes</li>
                <li><strong>Droit à la limitation :</strong> Vous pouvez demander la limitation du traitement dans certains cas</li>
                <li><strong>Droit de retirer le consentement :</strong> Pour les traitements basés sur le consentement, vous pouvez le retirer à tout moment</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Pour exercer vos droits :</strong> Contactez-nous à <a href="mailto:privacy@leadflow.ai" className="text-primary hover:underline">privacy@leadflow.ai</a>. 
                  Nous répondrons dans un délai maximum de 30 jours.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Cookies et Technologies Similaires</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies et technologies similaires pour :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme (authentification, sécurité)</li>
                <li><strong>Cookies de performance :</strong> Analyse de l'utilisation pour améliorer nos services (avec votre consentement)</li>
                <li><strong>Cookies de préférences :</strong> Mémorisation de vos paramètres et préférences</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur. 
                Notez que la désactivation de certains cookies peut affecter le fonctionnement de la plateforme.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Sécurité des Données</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Chiffrement des données en transit (HTTPS/TLS)</li>
                <li>Chiffrement des données sensibles au repos</li>
                <li>Authentification à deux facteurs (2FA) disponible</li>
                <li>Accès restreint aux données (principe du moindre privilège)</li>
                <li>Surveillance et détection d'intrusions</li>
                <li>Sauvegardes régulières et sécurisées</li>
                <li>Audits de sécurité réguliers</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Important :</strong> Aucun système n'est totalement sécurisé. En cas de violation de données, 
                  nous vous notifierons dans les 72 heures conformément au RGPD.
                </p>
              </div>
            </div>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Transferts Internationaux</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Vos données peuvent être transférées et stockées en dehors de l'Union Européenne, notamment :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Supabase (hébergement cloud, conforme RGPD)</li>
                <li>Services d'IA (OpenAI, Anthropic) avec garanties de protection des données</li>
                <li>Services d'analyse (Google Analytics avec anonymisation)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Tous les transferts sont effectués avec des garanties appropriées (clauses contractuelles types, 
                Privacy Shield, ou autres mécanismes approuvés par la Commission Européenne).
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Données des Prospects</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Lorsque vous utilisez LeadFlow pour contacter des prospects :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Vous êtes responsable de la collecte et du traitement des données de vos prospects</li>
                <li>Vous devez vous assurer d'avoir une base légale pour contacter ces prospects (consentement, intérêt légitime, etc.)</li>
                <li>Vous devez respecter les listes d'opposition (Robinson, Bloctel en France)</li>
                <li>Nous stockons ces données pour vous permettre de gérer vos campagnes, mais vous en restez le responsable</li>
                <li>Vous pouvez exporter ou supprimer les données de vos prospects à tout moment</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-gray-700">
                  <strong>Attention :</strong> En cas de non-respect du RGPD dans votre utilisation de LeadFlow, 
                  vous êtes seul responsable. Nous vous recommandons de consulter un avocat spécialisé en protection des données.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Modifications de cette Politique</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Nous pouvons modifier cette politique de confidentialité occasionnellement. Les modifications importantes seront :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Publiées sur cette page avec une nouvelle date de "Dernière mise à jour"</li>
                <li>Notifiées par email aux utilisateurs actifs</li>
                <li>Affichées dans l'interface de la plateforme</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Réclamations</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez :
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Nous contacter directement à <a href="mailto:privacy@leadflow.ai" className="text-primary hover:underline">privacy@leadflow.ai</a></li>
                <li>Déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : 
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">www.cnil.fr</a>
                </li>
              </ul>
            </div>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">14. Contact</h2>
            <div className="bg-white rounded-lg p-6 border">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">LeadFlow - Service Protection des Données</p>
                <p className="text-gray-700 mb-1">Email : <a href="mailto:privacy@leadflow.ai" className="text-primary hover:underline">privacy@leadflow.ai</a></p>
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
