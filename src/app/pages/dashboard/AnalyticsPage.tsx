import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { TrendingUp, TrendingDown, Mail, Calendar, DollarSign, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AnalyticsPage() {
  const metrics = [
    { label: 'Total Outreach', value: '1,247', change: '+23%', trending: true, icon: Mail },
    { label: 'Open Rate', value: '42.3%', change: '+5.2%', trending: true, icon: Target },
    { label: 'Reply Rate', value: '18.7%', change: '+3.1%', trending: true, icon: Mail },
    { label: 'Meetings Booked', value: '47', change: '+38%', trending: true, icon: Calendar },
    { label: 'Cost Per Meeting', value: '€38.20', change: '-12%', trending: true, icon: DollarSign },
    { label: 'ROI', value: '4.5x', change: '+0.8x', trending: true, icon: TrendingUp },
  ];
  
  const funnelData = [
    { stage: 'Sent', value: 1247, fill: '#1E40AF' },
    { stage: 'Opened', value: 527, fill: '#8B5CF6' },
    { stage: 'Replied', value: 233, fill: '#06B6D4' },
    { stage: 'Meeting', value: 47, fill: '#10B981' },
  ];
  
  const campaignData = [
    { name: 'SaaS Q1', reply: 18.5, meeting: 3.2 },
    { name: 'Enterprise', reply: 21.3, meeting: 4.1 },
    { name: 'YC Batch', reply: 24.7, meeting: 5.3 },
  ];
  
  const channelData = [
    { name: 'Email', value: 842 },
    { name: 'Voice', value: 405 },
  ];
  
  const COLORS = ['#1E40AF', '#8B5CF6'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-gray-600">Track performance and measure success</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Last 7 days</Button>
          <Button variant="outline" size="sm">Last 30 days</Button>
          <Button variant="default" size="sm">Last quarter</Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {metrics.map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <metric.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center text-sm ${metric.trending ? 'text-success' : 'text-error'}`}>
                  {metric.trending ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Performance Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campaign Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reply" fill="#1E40AF" name="Reply Rate %" />
                <Bar dataKey="meeting" fill="#10B981" name="Meeting Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meilleurs agents IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sales-Hunter', meetings: 18, rate: 21.5, score: 95 },
                { name: 'Lead-Gen-Pro', meetings: 15, rate: 18.2, score: 89 },
                { name: 'Startup-Ninja', meetings: 14, rate: 19.8, score: 92 },
              ].map((sdr, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-semibold">{sdr.name}</div>
                    <div className="text-sm text-gray-600">{sdr.meetings} meetings • {sdr.rate}% reply rate</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{sdr.score}</div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
