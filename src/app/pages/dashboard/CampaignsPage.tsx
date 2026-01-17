import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Rocket, Search, Plus, MoreVertical, Bot, Mail, Phone, Play, Pause, Edit } from 'lucide-react';

export default function CampaignsPage() {
  const [filter, setFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  const campaigns = [
    {
      name: 'SaaS Outreach Q1',
      status: 'active',
      sdr: 'Sales-Hunter',
      progress: { research: 80, outreach: 45, followup: 12 },
      stats: { sent: 450, opens: 234, replies: 83, meetings: 12 },
    },
    {
      name: 'Enterprise Pipeline',
      status: 'active',
      sdr: 'Lead-Gen-Pro',
      progress: { research: 100, outreach: 72, followup: 28 },
      stats: { sent: 320, opens: 198, replies: 61, meetings: 9 },
    },
    {
      name: 'Y Combinator Batch',
      status: 'paused',
      sdr: 'Startup-Ninja',
      progress: { research: 100, outreach: 88, followup: 65 },
      stats: { sent: 580, opens: 421, replies: 112, meetings: 18 },
    },
    {
      name: 'Real Estate Investors',
      status: 'draft',
      sdr: 'Sales-Hunter',
      progress: { research: 25, outreach: 0, followup: 0 },
      stats: { sent: 0, opens: 0, replies: 0, meetings: 0 },
    },
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'paused': return 'bg-warning/10 text-warning';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const filteredCampaigns = filter === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.status === filter);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
          <p className="text-gray-600">Manage your AI-powered outreach campaigns</p>
        </div>
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new AI-powered outreach campaign in minutes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Campaign Name</Label>
                <Input placeholder="e.g., Q1 SaaS Outreach" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Target Industry</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Campaign Goal</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meetings">Book Meetings</SelectItem>
                      <SelectItem value="demos">Schedule Demos</SelectItem>
                      <SelectItem value="calls">Sales Calls</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Agent IA</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez un agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-hunter">Sales-Hunter</SelectItem>
                    <SelectItem value="lead-gen-pro">Lead-Gen-Pro</SelectItem>
                    <SelectItem value="startup-ninja">Startup-Ninja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email" className="rounded" defaultChecked />
                  <label htmlFor="email" className="text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> Email
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="voice" className="rounded" />
                  <label htmlFor="voice" className="text-sm flex items-center">
                    <Phone className="w-4 h-4 mr-1" /> Voice
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input placeholder="Search campaigns..." className="pl-10" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Campaigns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{campaign.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bot className="w-4 h-4" />
                    {campaign.sdr}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Research</span>
                    <span>{campaign.progress.research}%</span>
                  </div>
                  <Progress value={campaign.progress.research} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Outreach</span>
                    <span>{campaign.progress.outreach}%</span>
                  </div>
                  <Progress value={campaign.progress.outreach} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Follow-up</span>
                    <span>{campaign.progress.followup}%</span>
                  </div>
                  <Progress value={campaign.progress.followup} className="h-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold">{campaign.stats.sent}</div>
                  <div className="text-xs text-gray-600">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{campaign.stats.opens}</div>
                  <div className="text-xs text-gray-600">Opens</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{campaign.stats.replies}</div>
                  <div className="text-xs text-gray-600">Replies</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-success">{campaign.stats.meetings}</div>
                  <div className="text-xs text-gray-600">Meetings</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {campaign.status === 'active' ? (
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
