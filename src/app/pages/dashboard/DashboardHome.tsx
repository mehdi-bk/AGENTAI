import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { TrendingUp, Users, Mail, Calendar, Rocket, ArrowRight, Bot, Play, Pause } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboard as dashboardService, campaigns } from '@/services/dashboardService';
import { toast } from 'sonner';

export default function DashboardHome() {
  // MBK: Removed hardcoded demo data - will be replaced with real API calls
  const [stats, setStats] = useState([
    { label: 'Campagnes actives', value: '0', change: 'Aucune donnée', trending: false, icon: Rocket },
    { label: 'Rendez-vous réservés', value: '0', change: 'Aucune donnée', trending: false, icon: Calendar },
    { label: 'Taux de réponse', value: '0%', change: 'Aucune donnée', trending: false, icon: Mail },
    { label: 'Agents IA actifs', value: '0/0', change: 'Aucune donnée', trending: false, icon: Bot },
  ]);
  
  const [activities, setActivities] = useState<any[]>([]);
  const [activeCampaigns, setActiveCampaigns] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // MBK: Fetch real data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats
        const statsResponse = await dashboardService.getStats();
        if (statsResponse.success) {
          const statsData = statsResponse.data;
          setStats([
            { 
              label: 'Campagnes actives', 
              value: String(statsData.activeCampaigns || 0), 
              change: `${statsData.totalCampaigns || 0} campagnes au total`, 
              trending: statsData.activeCampaigns > 0, 
              icon: Rocket 
            },
            { 
              label: 'Rendez-vous réservés', 
              value: String(statsData.meetingsCount || 0), 
              change: 'Total des rendez-vous', 
              trending: statsData.meetingsCount > 0, 
              icon: Calendar 
            },
            { 
              label: 'Taux de réponse', 
              value: statsData.responseRate || '0%', 
              change: 'Taux moyen de réponse', 
              trending: parseFloat(statsData.responseRate || '0') > 0, 
              icon: Mail 
            },
            { 
              label: 'Crédits disponibles', 
              value: String(statsData.credits || 0), 
              change: 'Crédits restants', 
              trending: false, 
              icon: Bot 
            },
          ]);
        }
        
        // Fetch activities
        const activitiesResponse = await dashboardService.getActivities();
        if (activitiesResponse.success) {
          const activitiesData = activitiesResponse.data || [];
          // Format activities with relative time
          const formatted = activitiesData.map((activity: any) => ({
            time: formatRelativeTime(new Date(activity.time)),
            action: activity.action,
            type: activity.type
          }));
          setActivities(formatted);
        }
        
        // Fetch active campaigns
        const campaignsResponse = await campaigns.list('ACTIVE');
        if (campaignsResponse.success) {
          setActiveCampaigns(campaignsResponse.data || []);
        }
        
        // Generate chart data from activities (placeholder)
        // TODO: Get real chart data from API
        setChartData([]);
        
      } catch (error: any) {
        console.error('Error loading dashboard data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
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
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune activité récente</p>
              </div>
            ) : (
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
            )}
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
            {activeCampaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune campagne active</p>
                <Button className="mt-4" variant="outline" asChild>
                  <a href="/dashboard/campaigns">Créer une campagne</a>
                </Button>
              </div>
            ) : (
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
            )}
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
          {chartData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>Aucune donnée disponible</p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
