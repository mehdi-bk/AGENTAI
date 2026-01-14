import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Bot, Plus, Edit, Trash2, Play } from 'lucide-react';

export default function AISDRSettingsPage() {
  const aiSDRs = [
    { name: 'Sales-Hunter', specialization: 'SaaS', campaigns: 3, performance: 95, status: 'active' },
    { name: 'Lead-Gen-Pro', specialization: 'Enterprise', campaigns: 2, performance: 89, status: 'active' },
    { name: 'Startup-Ninja', specialization: 'Startups', campaigns: 1, performance: 92, status: 'idle' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI SDR Settings</h1>
          <p className="text-gray-600">Configure and manage your AI sales development representatives</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary">
          <Plus className="w-4 h-4 mr-2" />
          Create New AI SDR
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiSDRs.map((sdr, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <Badge variant={sdr.status === 'active' ? 'default' : 'secondary'}>
                  {sdr.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-2">{sdr.name}</h3>
              <p className="text-sm text-gray-600 mb-4">Specialization: {sdr.specialization}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Campaigns</span>
                  <span className="font-medium">{sdr.campaigns}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Performance Score</span>
                  <span className="font-medium text-success">{sdr.performance}/100</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
