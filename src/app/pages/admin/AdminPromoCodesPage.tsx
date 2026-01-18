/**
 * PAGE DE GESTION DES CODES PROMOTIONNELS
 * 
 * Liste complète des codes promo avec création et gestion
 * MBK: Promo code management system implementation
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
import { Plus, Eye, Copy, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { promoCodes } from '@/services/adminService';
import { toast } from 'sonner';

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses?: number;
  maxUsesPerUser: number;
  isActive: boolean;
  totalUses?: number;
  remainingUses?: number;
  isExpired?: boolean;
  isActiveNow?: boolean;
  newCustomersOnly: boolean;
  restrictedPlans: string[];
}

export default function AdminPromoCodesPage() {
  const [promoCodesList, setPromoCodesList] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<PromoCode | null>(null);
  
  // Form state for creating promo code
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    startDate: '',
    endDate: '',
    maxUses: '',
    maxUsesPerUser: '1',
    newCustomersOnly: false,
    restrictedPlans: [] as string[]
  });

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await promoCodes.list({
        page,
        limit: 20,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active'
      });

      if (response.success) {
        setPromoCodesList(response.data);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, [page, statusFilter]);

  const handleCreatePromoCode = async () => {
    if (!formData.code || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.discountType === 'PERCENTAGE' && parseFloat(formData.discountValue) > 100) {
      toast.error('Le pourcentage ne peut pas dépasser 100%');
      return;
    }

    try {
      const response = await promoCodes.create({
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : undefined,
        maxUsesPerUser: parseInt(formData.maxUsesPerUser),
        newCustomersOnly: formData.newCustomersOnly,
        restrictedPlans: formData.restrictedPlans
      });

      if (response.success) {
        toast.success('Code promotionnel créé avec succès');
        setCreateDialogOpen(false);
        setFormData({
          code: '',
          discountType: 'PERCENTAGE',
          discountValue: '',
          startDate: '',
          endDate: '',
          maxUses: '',
          maxUsesPerUser: '1',
          newCustomersOnly: false,
          restrictedPlans: []
        });
        loadPromoCodes();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver ce code promotionnel ?')) return;

    try {
      const response = await promoCodes.deactivate(id);
      if (response.success) {
        toast.success('Code promotionnel désactivé');
        loadPromoCodes();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la désactivation');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copié dans le presse-papiers');
  };

  const getStatusBadge = (code: PromoCode) => {
    if (!code.isActive) {
      return 'bg-gray-100 text-gray-800';
    }
    if (code.isExpired) {
      return 'bg-red-100 text-red-800';
    }
    if (code.isActiveNow) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (code: PromoCode) => {
    if (!code.isActive) return 'Désactivé';
    if (code.isExpired) return 'Expiré';
    if (code.isActiveNow) return 'Actif';
    return 'À venir';
  };

  const formatDiscount = (code: PromoCode) => {
    if (code.discountType === 'PERCENTAGE') {
      return `${code.discountValue}%`;
    }
    return `${code.discountValue}€`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des Codes Promotionnels</h1>
          <p className="text-gray-600">Créez et gérez les codes promotionnels</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Créer un Code Promo
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
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actifs uniquement</SelectItem>
                <SelectItem value="false">Désactivés uniquement</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadPromoCodes}>
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des codes promo */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Codes Promotionnels</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type de réduction</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Utilisations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodesList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucun code promotionnel trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    promoCodesList.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold">{code.code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(code.code)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {code.discountType === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatDiscount(code)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(code.startDate).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="text-gray-500">
                              → {new Date(code.endDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{code.totalUses || 0} utilisations</div>
                            {code.maxUses && (
                              <div className="text-gray-500">
                                {code.remainingUses !== null ? `${code.remainingUses} restantes` : 'Illimité'}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(code)}>
                            {getStatusText(code)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCode(code);
                                // Could open a details dialog here
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {code.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivate(code.id)}
                              >
                                Désactiver
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un Code Promotionnel</DialogTitle>
            <DialogDescription>
              Créez un nouveau code promotionnel pour vos clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="PROMO2024"
                  maxLength={20}
                />
              </div>
              <div>
                <Label>Type de réduction *</Label>
                <Select value={formData.discountType} onValueChange={(value) => setFormData({ ...formData, discountType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Valeur de réduction *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === 'PERCENTAGE' ? '10' : '50'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.discountType === 'PERCENTAGE' ? 'Pourcentage (max 100%)' : 'Montant en euros'}
                </p>
              </div>
              <div>
                <Label>Utilisations max par utilisateur</Label>
                <Input
                  type="number"
                  value={formData.maxUsesPerUser}
                  onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début *</Label>
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Date de fin *</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Utilisations totales max (optionnel)</Label>
              <Input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="Illimité si vide"
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="newCustomersOnly"
                checked={formData.newCustomersOnly}
                onChange={(e) => setFormData({ ...formData, newCustomersOnly: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="newCustomersOnly" className="cursor-pointer">
                Nouveaux clients uniquement
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreatePromoCode}>
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
