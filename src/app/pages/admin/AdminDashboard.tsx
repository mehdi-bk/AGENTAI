/**
 * DASHBOARD ADMIN PRINCIPAL
 * 
 * Affiche les statistiques globales avec graphiques interactifs
 * et données en temps réel
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Users, DollarSign, TrendingUp, Activity, Calendar, CreditCard } from 'lucide-react';
import { dashboard } from '@/services/adminService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

interface DashboardStats {
  clients: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  revenue: {
    monthly: number;
    yearly: number;
  };
  campaigns: {
    total: number;
    active: number;
  };
  users: {
    newLast30Days: number;
    newLast7Days: number;
  };
  credits: {
    total: number;
    used: number;
    conversionRate: number;
  };
}

interface ChartData {
  revenue: Array<{ date: string; amount: number }>;
  users: Array<{ date: string; count: number }>;
  campaigns: Array<{ date: string; count: number }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Charger les données
  const loadData = async () => {
    try {
      setLoading(true);
      const [statsResponse, chartsResponse] = await Promise.all([
        dashboard.getStats(),
        dashboard.getCharts(period)
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (chartsResponse.success) {
        setChartData(chartsResponse.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Actualisation automatique toutes les 30 secondes
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      interval = setInterval(loadData, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [period, autoRefresh]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const globalStats = stats ? [
    {
      label: 'Total Clients',
      value: stats.clients.total.toString(),
      icon: Users,
      sublabel: `${stats.clients.active} actifs`
    },
    {
      label: 'Revenus Mensuels',
      value: formatCurrency(stats.revenue.monthly),
      icon: DollarSign,
      sublabel: formatCurrency(stats.revenue.yearly) + ' / an'
    },
    {
      label: 'Campagnes Actives',
      value: stats.campaigns.active.toString(),
      icon: Activity,
      sublabel: `${stats.campaigns.total} au total`
    },
    {
      label: 'Nouveaux Utilisateurs',
      value: stats.users.newLast7Days.toString(),
      icon: TrendingUp,
      sublabel: `${stats.users.newLast30Days} sur 30 jours`
    },
    {
      label: 'Taux de Conversion',
      value: stats.credits.conversionRate + '%',
      icon: CreditCard,
      sublabel: `${stats.credits.used} crédits utilisés`
    },
    {
      label: 'Clients Suspendus',
      value: stats.clients.suspended.toString(),
      icon: Activity,
      sublabel: `${stats.clients.inactive} inactifs`
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord Admin</h1>
          <p className="text-gray-600">Vue d'ensemble du système et statistiques en temps réel</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">90 derniers jours</SelectItem>
              <SelectItem value="365">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-actualisation ON' : 'Auto-actualisation OFF'}
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {globalStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              {stat.sublabel && (
                <div className="text-xs text-gray-500">{stat.sublabel}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      {chartData && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Graphique des revenus */}
          <Card>
            <CardHeader>
              <CardTitle>Revenus par Jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis tickFormatter={(value) => `€${value}`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Revenus"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique des nouveaux utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.users}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Nouveaux utilisateurs" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique des campagnes */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Campagnes Lancées</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.campaigns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleDateString('fr-FR')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Campagnes"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => window.location.href = '/admin/clients'}>
              <Users className="w-4 h-4 mr-2" />
              Gérer les Clients
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/invoices'}>
              <DollarSign className="w-4 h-4 mr-2" />
              Voir les Factures
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/refunds'}>
              <CreditCard className="w-4 h-4 mr-2" />
              Remboursements
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/admin/promo-codes'}>
              <Activity className="w-4 h-4 mr-2" />
              Codes Promo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
