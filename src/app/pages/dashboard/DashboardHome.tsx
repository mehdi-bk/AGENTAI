import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { TrendingUp, Users, Mail, Calendar, Rocket, ArrowRight, Bot, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardHome() {
  const stats = [
    { label: 'Campagnes actives', value: '8', change: '+2 depuis la semaine dernière', trending: true, icon: Rocket },
    { label: 'Rendez-vous réservés', value: '23', change: '+43% ce mois-ci', trending: true, icon: Calendar },
    { label: 'Taux de réponse', value: '18.5%', change: '+2.3% d\'augmentation', trending: true, icon: Mail },
    { label: 'Agents IA actifs', value: '3/5', change: '60% de capacité utilisée', trending: false, icon: Bot },
  ];
  
  const activities = [
    { time: 'Il y a 2 heures', action: 'Agent IA "Sales-Hunter" a envoyé 45 emails', type: 'success' },
    { time: 'Il y a 3 heures', action: 'Rendez-vous réservé avec John chez Acme Corp', type: 'success' },
    { time: 'Il y a 5 heures', action: 'Campagne "SaaS Outreach Q1" phase de recherche terminée', type: 'info' },
    { time: 'Il y a 1 jour', action: 'Nouveau prospect ajouté à "Enterprise Pipeline"', type: 'info' },
    { time: 'Il y a 1 jour', action: '3 réponses positives reçues', type: 'success' },
  ];
  
  const activeCampaigns = [
    { name: 'Prospection SaaS T1', progress: 65, status: 'active', sdr: 'Sales-Hunter', sent: 450, replies: 83 },
    { name: 'Pipeline Entreprises', progress: 42, status: 'active', sdr: 'Lead-Gen-Pro', sent: 320, replies: 61 },
    { name: 'Batch Y Combinator', progress: 88, status: 'active', sdr: 'Startup-Ninja', sent: 580, replies: 112 },
  ];
  
  const chartData = [
    { date: 'Jan 1', meetings: 3 },
    { date: 'Jan 8', meetings: 5 },
    { date: 'Jan 15', meetings: 7 },
    { date: 'Jan 22', meetings: 12 },
    { date: 'Jan 29', meetings: 15 },
    { date: 'Feb 5', meetings: 18 },
    { date: 'Feb 12', meetings: 23 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue ! Voici ce qui se passe avec vos campagnes.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                {stat.trending && (
                  <TrendingUp className="w-4 h-4 text-success" />
                )}
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
              <div className={`text-xs ${stat.trending ? 'text-success' : 'text-gray-500'}`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-success' : 'bg-accent'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Active Campaigns Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Campagnes actives</CardTitle>
              <Button size="sm" variant="ghost" asChild>
                <a href="/dashboard/campaigns">
                  Voir tout <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeCampaigns.map((campaign, i) => (
                <div key={i} className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{campaign.name}</h4>
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600">{campaign.sdr}</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{campaign.sent} sent</span>
                    <span>{campaign.replies} replies</span>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <Rocket className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rendez-vous réservés au fil du temps</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Daily</Button>
              <Button variant="outline" size="sm">Weekly</Button>
              <Button variant="default" size="sm">Monthly</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px' 
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meetings" 
                  stroke="#1E40AF" 
                  strokeWidth={3}
                  dot={{ fill: '#1E40AF', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
