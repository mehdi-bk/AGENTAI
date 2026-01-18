/**
 * PAGE DE GESTION DES FACTURES
 * 
 * Liste complète des factures avec filtres et actions
 * MBK: Invoice management with creation dialog implementation
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
import { Mail, FileText, X, Eye, Plus } from 'lucide-react';
import { invoices, clients } from '@/services/adminService';
import { toast } from 'sonner';

interface Invoice {
    id: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: string;
    dueDate: string;
    paidAt?: string;
    client: {
        email: string;
        fullName: string;
    };
    createdAt: string;
}

interface Client {
    id: string;
    email: string;
    fullName: string;
}

export default function AdminInvoicesPage() {
    const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
    const [clientsList, setClientsList] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Form state for creating invoice
    const [formData, setFormData] = useState({
        clientId: '',
        amount: '',
        dueDate: '',
        currency: 'EUR',
        notes: '',
        items: [{ description: '', quantity: '1', price: '' }]
    });

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const response = await invoices.list({
                page,
                limit: 20,
                status: statusFilter !== 'all' ? statusFilter : undefined
            });

            if (response.success) {
                setInvoicesList(response.data);
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
        loadInvoices();
        loadClients();
    }, [page, statusFilter]);

    const handleCreateInvoice = async () => {
        if (!formData.clientId || !formData.amount || !formData.dueDate) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validate items
        const validItems = formData.items.filter(item => item.description && item.price);
        if (validItems.length === 0) {
            toast.error('Veuillez ajouter au moins un article');
            return;
        }

        try {
            const items = validItems.map(item => ({
                description: item.description,
                quantity: parseInt(item.quantity) || 1,
                price: parseFloat(item.price)
            }));

            const response = await invoices.create({
                clientId: formData.clientId,
                amount: parseFloat(formData.amount),
                dueDate: formData.dueDate,
                currency: formData.currency,
                notes: formData.notes || undefined,
                items
            });

            if (response.success) {
                toast.success('Facture créée avec succès');
                setCreateDialogOpen(false);
                setFormData({
                    clientId: '',
                    amount: '',
                    dueDate: '',
                    currency: 'EUR',
                    notes: '',
                    items: [{ description: '', quantity: '1', price: '' }]
                });
                loadInvoices();
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la création');
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: '1', price: '' }]
        });
    };

    const removeItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });

        // Recalculate total
        const total = newItems.reduce((sum, item) => {
            const quantity = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            return sum + (quantity * price);
        }, 0);
        setFormData(prev => ({ ...prev, amount: total.toFixed(2) }));
    };

    const handleResend = async (id: string) => {
        try {
            const response = await invoices.resend(id);
            if (response.success) {
                toast.success('Facture renvoyée par email');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors du renvoi');
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const response = await invoices.updateStatus(id, status);
            if (response.success) {
                toast.success('Statut mis à jour');
                loadInvoices();
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la mise à jour');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette facture ?')) return;

        try {
            const response = await invoices.cancel(id);
            if (response.success) {
                toast.success('Facture annulée');
                loadInvoices();
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de l\'annulation');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-green-100 text-green-800',
            OVERDUE: 'bg-red-100 text-red-800',
            CANCELLED: 'bg-gray-100 text-gray-800',
            REFUNDED: 'bg-blue-100 text-blue-800'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gestion des Factures</h1>
                    <p className="text-gray-600">Gérez toutes les factures et leurs statuts</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer une Facture
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
                                <SelectItem value="PAID">Payée</SelectItem>
                                <SelectItem value="OVERDUE">En retard</SelectItem>
                                <SelectItem value="CANCELLED">Annulée</SelectItem>
                                <SelectItem value="REFUNDED">Remboursée</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={loadInvoices}>
                            Actualiser
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des factures */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Factures</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">Chargement...</div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Numéro</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Date d'échéance</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Date de paiement</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoicesList.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{invoice.client.fullName}</div>
                                                    <div className="text-sm text-gray-500">{invoice.client.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(invoice.amount)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(invoice.status)}>
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {invoice.paidAt
                                                    ? new Date(invoice.paidAt).toLocaleDateString('fr-FR')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleResend(invoice.id)}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedInvoice(invoice)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Select
                                                        value={invoice.status}
                                                        onValueChange={(value) => handleStatusChange(invoice.id, value)}
                                                    >
                                                        <SelectTrigger className="w-[140px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PENDING">En attente</SelectItem>
                                                            <SelectItem value="PAID">Marquer payée</SelectItem>
                                                            <SelectItem value="OVERDUE">En retard</SelectItem>
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

            {/* Dialog de création */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Créer une Facture</DialogTitle>
                        <DialogDescription>
                            Créez une nouvelle facture pour un client
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                <Label>Date d'échéance *</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <Label>Articles *</Label>
                            <div className="space-y-2 mt-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-end">
                                        <div className="flex-1">
                                            <Input
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <Input
                                                type="number"
                                                placeholder="Qté"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                min="1"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Prix"
                                                value={item.price}
                                                onChange={(e) => updateItem(index, 'price', e.target.value)}
                                            />
                                        </div>
                                        {formData.items.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addItem}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un article
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Montant total (EUR)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0.00"
                                    readOnly
                                    className="bg-gray-50"
                                />
                            </div>
                            <div>
                                <Label>Devise</Label>
                                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label>Notes (optionnel)</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Notes additionnelles..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleCreateInvoice}>
                            Créer la Facture
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
