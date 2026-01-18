/**
 * PAGE DE CONNEXION ADMIN
 * 
 * Interface de connexion sécurisée pour les administrateurs
 * MBK: Admin login page with 2FA support
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { adminAuth } from '@/services/adminService';
import { toast } from 'sonner';
import { Shield, Lock } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [code2FA, setCode2FA] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAuth.login({ email, password });

            if (response.success) {
                if (response.requires2FA) {
                    setRequires2FA(true);
                    setTempToken(response.tempToken);
                    toast.info('Code 2FA requis');
                } else {
                    toast.success('Connexion réussie !');
                    navigate('/admin');
                }
            } else {
                toast.error(response.message || 'Erreur de connexion');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAuth.verify2FA({
                tempToken,
                code: code2FA
            });

            if (response.success) {
                toast.success('Connexion réussie !');
                navigate('/admin');
            } else {
                toast.error(response.message || 'Code 2FA invalide');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erreur de vérification');
        } finally {
            setLoading(false);
        }
    };

    if (requires2FA) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Authentification à Deux Facteurs</CardTitle>
                        <p className="text-sm text-gray-600">
                            Entrez le code à 6 chiffres depuis votre application d'authentification
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify2FA} className="space-y-4">
                            <div>
                                <Label htmlFor="code2FA">Code 2FA</Label>
                                <Input
                                    id="code2FA"
                                    type="text"
                                    value={code2FA}
                                    onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="text-center text-2xl tracking-widest"
                                    required
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading || code2FA.length !== 6}>
                                {loading ? 'Vérification...' : 'Vérifier'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    setRequires2FA(false);
                                    setCode2FA('');
                                }}
                            >
                                Retour
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Panneau d'Administration</CardTitle>
                    <p className="text-sm text-gray-600">
                        Connectez-vous pour accéder au panneau admin
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
