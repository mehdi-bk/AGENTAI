import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Calendar, Clock, Video, MapPin, ExternalLink } from 'lucide-react';

export default function MeetingsPage() {
  const upcomingMeetings = [
    { date: 'Jan 15', time: '10:00 AM', contact: 'Sarah Johnson', company: 'TechCorp Inc', type: 'Demo', campaign: 'SaaS Outreach Q1' },
    { date: 'Jan 15', time: '2:30 PM', contact: 'Michael Chen', company: 'StartupXYZ', type: 'Discovery Call', campaign: 'Y Combinator Batch' },
    { date: 'Jan 16', time: '11:00 AM', contact: 'David Kim', company: 'Growth Labs', type: 'Follow-up', campaign: 'Enterprise Pipeline' },
    { date: 'Jan 17', time: '3:00 PM', contact: 'Lisa Anderson', company: 'Innovation Inc', type: 'Demo', campaign: 'SaaS Outreach Q1' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meetings</h1>
        <p className="text-gray-600">Track and manage your scheduled meetings</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Calendar interface would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMeetings.map((meeting, i) => (
              <div key={i} className="p-4 border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{meeting.date.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600">{meeting.date.split(' ')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">{meeting.time}</span>
                    </div>
                    <h4 className="font-semibold">{meeting.contact}</h4>
                    <p className="text-sm text-gray-600">{meeting.company}</p>
                    <Badge variant="secondary" className="mt-2">
                      {meeting.type}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Video className="w-4 h-4 mr-2" />
                  Join Call
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
