/**
 * PAGE DE GESTION DES CLIENTS
 * 
 * Liste complète des clients avec filtres, recherche,
 * et actions de gestion
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Search, Eye, CreditCard, UserX, UserCheck, Download, MoreVertical } from 'lucide-react';
import { clients } from '@/services/adminService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  subscriptionType: string;
  status: string;
  currentCredits: number;
  createdAt: string;
  _count: {
    campaigns: number;
    invoices: number;
  };
}

export default function AdminClientsPage() {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditDescription, setCreditDescription] = useState('');
  const navigate = useNavigate();

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clients.list({
        page,
        limit: 20,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        subscriptionType: subscriptionFilter !== 'all' ? subscriptionFilter : undefined
      });

      if (response.success) {
        setClientsList(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [page, statusFilter, subscriptionFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        loadClients();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  const handleAdjustCredits = async () => {
    if (!selectedClient || !creditAmount) return;

    try {
      const response = await clients.adjustCredits(
        selectedClient.id,
        parseInt(creditAmount),
        creditDescription
      );

      if (response.success) {
        toast.success('Crédits ajustés avec succès');
        setCreditDialogOpen(false);
        setCreditAmount('');
        setCreditDescription('');
        loadClients();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'ajustement');
    }
  };

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    try {
      const response = await clients.updateStatus(clientId, newStatus);
      if (response.success) {
        toast.success('Statut mis à jour');
        loadClients();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleExport = async () => {
    try {
      const response = await clients.export();
      // Télécharger le CSV
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clients-${new Date().toISOString()}.csv`;
      a.click();
      toast.success('Export réussi');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      SUSPENDED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-orange-100 text-orange-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Clients</h1>
          <p className="text-gray-600">Gérez tous les clients et leurs abonnements</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par email, nom, entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Abonnement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les abonnements</SelectItem>
                <SelectItem value="STARTER">Starter</SelectItem>
                <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadClients}>
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des clients */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Abonnement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Crédits</TableHead>
                    <TableHead>Campagnes</TableHead>
                    <TableHead>Factures</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientsList.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.email}</TableCell>
                      <TableCell>{client.fullName}</TableCell>
                      <TableCell>{client.company || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.subscriptionType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{client.currentCredits}</TableCell>
                      <TableCell>{client._count.campaigns}</TableCell>
                      <TableCell>{client._count.invoices}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedClient(client)}
                              >
                                <CreditCard className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Ajuster les Crédits</DialogTitle>
                                <DialogDescription>
                                  Ajouter ou retirer des crédits pour {client.email}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label>Montant</Label>
                                  <Input
                                    type="number"
                                    value={creditAmount}
                                    onChange={(e) => setCreditAmount(e.target.value)}
                                    placeholder="Positif pour ajouter, négatif pour retirer"
                                  />
                                </div>
                                <div>
                                  <Label>Description (optionnel)</Label>
                                  <Textarea
                                    value={creditDescription}
                                    onChange={(e) => setCreditDescription(e.target.value)}
                                    placeholder="Raison de l'ajustement..."
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setCreditDialogOpen(false)}>
                                  Annuler
                                </Button>
                                <Button onClick={handleAdjustCredits}>
                                  Confirmer
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Select
                            value={client.status}
                            onValueChange={(value) => handleStatusChange(client.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Activer</SelectItem>
                              <SelectItem value="SUSPENDED">Suspendre</SelectItem>
                              <SelectItem value="INACTIVE">Désactiver</SelectItem>
                              <SelectItem value="CANCELLED">Annuler</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Page {page} sur {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
