import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Check, Calendar, Mail, Users, Slack, Video, Building2, Plus, X, Settings, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function IntegrationsPage() {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Marie Dubois', email: 'marie@example.com', role: 'Administrateur', status: 'active' },
    { id: 2, name: 'Jean Martin', email: 'jean@example.com', role: 'Membre', status: 'active' },
  ]);
  
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  
  const integrations = [
    { 
      name: 'Google Calendar', 
      description: 'Synchronisez vos rendez-vous et disponibilités', 
      status: 'connected', 
      category: 'calendar',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Gmail', 
      description: 'Envoyez des emails depuis votre boîte', 
      status: 'connected', 
      category: 'email',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-red-500 to-red-600'
    },
    { 
      name: 'HubSpot CRM', 
      description: 'Synchronisez contacts et opportunités', 
      status: 'available', 
      category: 'crm',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Salesforce', 
      description: 'Intégration CRM entreprise', 
      status: 'available', 
      category: 'crm',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-500'
    },
    { 
      name: 'Pipedrive', 
      description: 'Gestion du pipeline de ventes', 
      status: 'available', 
      category: 'crm',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Slack', 
      description: 'Recevez des notifications dans Slack', 
      status: 'available', 
      category: 'communication',
      icon: <Slack className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Zoom', 
      description: 'Planifiez des réunions vidéo', 
      status: 'available', 
      category: 'meetings',
      icon: <Video className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Microsoft Teams', 
      description: 'Plateforme de collaboration', 
      status: 'coming-soon', 
      category: 'communication',
      icon: <Users className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600'
    },
  ];
  
  const handleAddMember = () => {
    if (!newMemberEmail) {
      toast.error('Veuillez entrer une adresse email');
      return;
    }
    
    if (!newMemberEmail.includes('@')) {
      toast.error('Adresse email invalide');
      return;
    }
    
    // Vérifier si l'email existe déjà
    const exists = teamMembers.some(member => member.email === newMemberEmail);
    if (exists) {
      toast.error('Ce membre fait déjà partie de l\'équipe');
      return;
    }
    
    const newMember = {
      id: teamMembers.length + 1,
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'Membre',
      status: 'pending'
    };
    
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail('');
    setAddMemberOpen(false);
    toast.success(`Invitation envoyée à ${newMemberEmail}`);
  };
  
  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success('Membre retiré de l\'équipe');
  };
  
  const handleConnect = (name: string) => {
    toast.success(`Connexion à ${name} en cours...`);
    // Ici vous ajouteriez la logique OAuth réelle
  };
  
  const handleDisconnect = (name: string) => {
    toast.success(`Déconnecté de ${name}`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Intégrations</h1>
        <p className="text-gray-600">Connectez vos outils et gérez votre équipe</p>
      </div>
      
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="team">Équipe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations" className="space-y-6">
          {/* Intégrations connectées */}
          <Card>
            <CardHeader>
              <CardTitle>Connecté</CardTitle>
              <CardDescription>Services actuellement connectés à votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {integrations.filter(i => i.status === 'connected').map((integration, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-white`}>
                        {integration.icon}
                      </div>
                      <Badge className="bg-success/10 text-success">
                        <Check className="w-3 h-3 mr-1" />
                        Connecté
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Gérer
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(integration.name)}
                      >
                        Déconnecter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Intégrations disponibles */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibles</CardTitle>
              <CardDescription>Connectez de nouveaux services pour améliorer votre workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.filter(i => i.status === 'available').map((integration, i) => (
                  <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-white`}>
                        {integration.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      onClick={() => handleConnect(integration.name)}
                    >
                      Connecter
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Bientôt disponible */}
          <Card>
            <CardHeader>
              <CardTitle>Bientôt disponible</CardTitle>
              <CardDescription>Intégrations en cours de développement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {integrations.filter(i => i.status === 'coming-soon').map((integration, i) => (
                  <div key={i} className="p-4 border rounded-lg opacity-75">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-white`}>
                        {integration.icon}
                      </div>
                      <Badge variant="secondary">Bientôt</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                    <Button variant="outline" className="w-full" disabled>
                      Bientôt disponible
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-6">
          {/* Gestion de l'équipe */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Membres de l'équipe</CardTitle>
                  <CardDescription>Gérez les membres qui ont accès à votre compte</CardDescription>
                </div>
                <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Inviter un membre
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Inviter un nouveau membre</DialogTitle>
                      <DialogDescription>
                        Envoyez une invitation par email pour ajouter un membre à votre équipe
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="email">Adresse email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="membre@exemple.com"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-primary to-secondary"
                          onClick={handleAddMember}
                        >
                          Envoyer l'invitation
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setAddMemberOpen(false)}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {member.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                        {member.status === 'active' ? 'Actif' : 'En attente'}
                      </Badge>
                      <Badge variant="outline">{member.role}</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Permissions et rôles */}
          <Card>
            <CardHeader>
              <CardTitle>Rôles et permissions</CardTitle>
              <CardDescription>Configurez les niveaux d'accès pour votre équipe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Administrateur</h4>
                  <p className="text-sm text-gray-600 mb-3">Accès complet à toutes les fonctionnalités</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Gérer l'équipe</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Gérer les intégrations</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Gérer les campagnes</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Accéder à la facturation</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Membre</h4>
                  <p className="text-sm text-gray-600 mb-3">Accès aux fonctionnalités principales</p>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Voir les campagnes</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Créer des campagnes</li>
                    <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-success" /> Voir les prospects</li>
                    <li className="flex items-center"><X className="w-4 h-4 mr-2 text-gray-400" /> Gérer la facturation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
