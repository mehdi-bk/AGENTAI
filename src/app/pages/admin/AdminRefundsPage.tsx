/**
 * PAGE DE GESTION DES REMBOURSEMENTS
 * 
 * Liste complète des remboursements avec filtres et actions
 * MBK: Full refund management implementation
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Plus, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { refunds, clients } from '@/services/adminService';
import { toast } from 'sonner';

interface Refund {
  id: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  processedAt?: string;
  client: {
    id: string;
    email: string;
    fullName: string;
    company?: string;
  };
}

interface Client {
  id: string;
  email: string;
  fullName: string;
}

export default function AdminRefundsPage() {
  const [refundsList, setRefundsList] = useState<Refund[]>([]);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  
  // Form state for creating refund
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    reason: '',
    currency: 'EUR'
  });
  const [notes, setNotes] = useState('');

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const response = await refunds.list({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });

      if (response.success) {
        setRefundsList(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const response = await clients.list({ limit: 100 });
      if (response.success) {
        setClientsList(response.data);
      }
    } catch (error: any) {
      console.error('Error loading clients:', error);
    }
  };

  useEffect(() => {
    loadRefunds();
    loadClients();
  }, [page, statusFilter]);

  const handleCreateRefund = async () => {
    if (!formData.clientId || !formData.amount || !formData.reason) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await refunds.create({
        clientId: formData.clientId,
        amount: parseFloat(formData.amount),
        reason: formData.reason,
        currency: formData.currency
      });

      if (response.success) {
        toast.success('Remboursement créé avec succès');
        setCreateDialogOpen(false);
        setFormData({ clientId: '', amount: '', reason: '', currency: 'EUR' });
        loadRefunds();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await refunds.updateStatus(id, status, notes);
      if (response.success) {
        toast.success('Statut mis à jour');
        setNotes('');
        loadRefunds();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleUpdateNotes = async (id: string) => {
    if (!notes.trim()) {
      toast.error('Veuillez entrer des notes');
      return;
    }

    try {
      const response = await refunds.updateNotes(id, notes);
      if (response.success) {
        toast.success('Notes mises à jour');
        setNotesDialogOpen(false);
        setNotes('');
        loadRefunds();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800',
      PROCESSED: 'bg-green-100 text-green-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      case 'PROCESSED':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Remboursements</h1>
          <p className="text-gray-600">Gérez toutes les demandes de remboursement</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Créer un Remboursement
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="APPROVED">Approuvé</SelectItem>
                <SelectItem value="REJECTED">Rejeté</SelectItem>
                <SelectItem value="PROCESSED">Traité</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadRefunds}>
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des remboursements */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Remboursements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de création</TableHead>
                    <TableHead>Date de traitement</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refundsList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucun remboursement trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    refundsList.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{refund.client.fullName}</div>
                            <div className="text-sm text-gray-500">{refund.client.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(refund.amount, refund.currency)}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {refund.reason}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(refund.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(refund.status)}
                              {refund.status}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(refund.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {refund.processedAt
                            ? new Date(refund.processedAt).toLocaleDateString('fr-FR')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRefund(refund);
                                setNotes(refund.adminNotes || '');
                                setNotesDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {refund.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(refund.id, 'APPROVED')}
                                >
                                  Approuver
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(refund.id, 'REJECTED')}
                                >
                                  Rejeter
                                </Button>
                              </>
                            )}
                            {refund.status === 'APPROVED' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(refund.id, 'PROCESSED')}
                              >
                                Marquer comme traité
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un Remboursement</DialogTitle>
            <DialogDescription>
              Créez une nouvelle demande de remboursement pour un client
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Client *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clientsList.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.fullName} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Montant *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Raison *</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Raison du remboursement..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateRefund}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de notes */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes Administratives</DialogTitle>
            <DialogDescription>
              {selectedRefund && `Remboursement de ${formatCurrency(selectedRefund.amount, selectedRefund.currency)} pour ${selectedRefund.client.fullName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajouter des notes administratives..."
                rows={4}
              />
            </div>
            {selectedRefund?.adminNotes && (
              <div>
                <Label>Notes existantes</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  {selectedRefund.adminNotes}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={() => selectedRefund && handleUpdateNotes(selectedRefund.id)}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
