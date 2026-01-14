import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Search, Filter, Download, Users } from 'lucide-react';

export default function ProspectsPage() {
  const prospects = [
    { name: 'Sarah Johnson', company: 'TechCorp Inc', title: 'VP of Sales', industry: 'SaaS', size: '51-200', research: 'completed', outreach: 'sent', confidence: 92 },
    { name: 'Michael Chen', company: 'StartupXYZ', title: 'Founder & CEO', industry: 'E-commerce', size: '11-50', research: 'completed', outreach: 'replied', confidence: 88 },
    { name: 'Emily Rodriguez', company: 'Enterprise Solutions', title: 'Director of Marketing', industry: 'Consulting', size: '201-500', research: 'in-progress', outreach: 'not-started', confidence: 75 },
    { name: 'David Kim', company: 'Growth Labs', title: 'Head of Sales', industry: 'SaaS', size: '11-50', research: 'completed', outreach: 'meeting-booked', confidence: 95 },
    { name: 'Lisa Anderson', company: 'Innovation Inc', title: 'CMO', industry: 'Agency', size: '51-200', research: 'completed', outreach: 'sent', confidence: 85 },
  ];
  
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-success/10 text-success',
      'in-progress': 'bg-warning/10 text-warning',
      'pending': 'bg-gray-100 text-gray-600',
      'not-started': 'bg-gray-100 text-gray-600',
      'sent': 'bg-accent/10 text-accent',
      'replied': 'bg-secondary/10 text-secondary',
      'meeting-booked': 'bg-success/10 text-success',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Prospects</h1>
          <p className="text-gray-600">Manage and track your prospect pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Users className="w-4 h-4 mr-2" />
            Add Prospects
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Search prospects..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prospect</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Research Status</TableHead>
              <TableHead>Outreach Status</TableHead>
              <TableHead>AI Confidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.map((prospect, i) => (
              <TableRow key={i} className="hover:bg-gray-50 cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {prospect.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{prospect.name}</div>
                      <div className="text-sm text-gray-500">{prospect.title}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{prospect.company}</div>
                  <div className="text-sm text-gray-500">{prospect.size}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{prospect.industry}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(prospect.research)}>
                    {prospect.research.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(prospect.outreach)}>
                    {prospect.outreach.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${prospect.confidence >= 90 ? 'bg-success' : prospect.confidence >= 80 ? 'bg-accent' : 'bg-warning'}`}
                        style={{ width: `${prospect.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{prospect.confidence}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
