import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Users, Bot, Calendar, DollarSign, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const globalStats = [
    { label: 'Total Clients', value: '47', icon: Users },
    { label: 'AI SDRs Running', value: '126', icon: Bot },
    { label: 'Total Meetings', value: '1,847', icon: Calendar },
    { label: 'System Health', value: '99.8%', icon: Activity },
    { label: 'Revenue MRR', value: '€67,200', icon: DollarSign },
    { label: 'Growth Rate', value: '+24%', icon: TrendingUp },
  ];
  
  const clients = [
    { company: 'TechCorp Inc', plan: 'Professional', sdrs: 3, status: 'active', mrr: '€1,500', joined: 'Jan 2026' },
    { company: 'StartupXYZ', plan: 'Starter', sdrs: 1, status: 'trial', mrr: '€800', joined: 'Jan 2026' },
    { company: 'Enterprise Solutions', plan: 'Enterprise', sdrs: 8, status: 'active', mrr: '€4,200', joined: 'Dec 2025' },
    { company: 'Growth Labs', plan: 'Professional', sdrs: 2, status: 'active', mrr: '€1,500', joined: 'Dec 2025' },
    { company: 'Innovation Inc', plan: 'Starter', sdrs: 1, status: 'churned', mrr: '€0', joined: 'Nov 2025' },
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'trial': return 'bg-accent/10 text-accent';
      case 'churned': return 'bg-error/10 text-error';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and client management</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {globalStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-error/10 to-warning/10">
                  <stat.icon className="w-6 h-6 text-error" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>AI SDRs Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{client.company}</TableCell>
                  <TableCell>{client.plan}</TableCell>
                  <TableCell>{client.sdrs}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(client.status)}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{client.mrr}</TableCell>
                  <TableCell>{client.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
