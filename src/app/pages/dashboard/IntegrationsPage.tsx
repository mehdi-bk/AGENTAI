import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Check } from 'lucide-react';

export default function IntegrationsPage() {
  const integrations = [
    { name: 'Google Calendar', description: 'Sync meetings and availability', status: 'connected', category: 'calendar' },
    { name: 'Gmail', description: 'Send emails from your inbox', status: 'connected', category: 'email' },
    { name: 'HubSpot CRM', description: 'Sync contacts and deals', status: 'available', category: 'crm' },
    { name: 'Salesforce', description: 'Enterprise CRM integration', status: 'available', category: 'crm' },
    { name: 'Pipedrive', description: 'Sales pipeline management', status: 'available', category: 'crm' },
    { name: 'Slack', description: 'Get notifications in Slack', status: 'available', category: 'communication' },
    { name: 'Zoom', description: 'Schedule video meetings', status: 'available', category: 'meetings' },
    { name: 'Microsoft Teams', description: 'Collaboration platform', status: 'coming-soon', category: 'communication' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-600">Connect your favorite tools to AI SDR</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <span className="text-2xl">{integration.name[0]}</span>
                </div>
                {integration.status === 'connected' && (
                  <Badge className="bg-success/10 text-success">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {integration.status === 'coming-soon' && (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{integration.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              {integration.status === 'connected' ? (
                <Button variant="outline" className="w-full">
                  Manage
                </Button>
              ) : integration.status === 'available' ? (
                <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                  Connect
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
