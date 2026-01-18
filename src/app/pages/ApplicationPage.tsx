// MBK: Job Application Page - Page de candidature avec formulaire complet
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Brain, ArrowLeft, Upload, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

export default function ApplicationPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
    linkedin: '',
    salary: '',
    location: '',
    frenchFluent: '',
    englishFluent: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Le fichier est trop volumineux. Taille maximale : 5MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        toast.error('Format de fichier non supporté. Veuillez uploader un PDF ou un document Word.');
        return;
      }
      setFormData(prev => ({ ...prev, resume: file }));
      toast.success('CV téléchargé avec succès');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Taille maximale : 5MB');
        return;
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc') && !file.type.includes('docx')) {
        toast.error('Format de fichier non supporté. Veuillez uploader un PDF ou un document Word.');
        return;
      }
      setFormData(prev => ({ ...prev, resume: file }));
      toast.success('CV téléchargé avec succès');
    }
  };

  const handleAutofill = async () => {
    if (!formData.resume) {
      toast.error('Veuillez d\'abord télécharger votre CV');
      return;
    }
    toast.info('Fonctionnalité d\'autocomplétion en cours de développement');
    // TODO: Implement resume parsing with AI
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.resume) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('linkedin', formData.linkedin);
      formDataToSend.append('salary', formData.salary);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('frenchFluent', formData.frenchFluent);
      formDataToSend.append('englishFluent', formData.englishFluent);
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/careers/apply`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de la candidature');
      }

      toast.success('Candidature envoyée avec succès ! Nous vous contacterons bientôt.');
      navigate('/careers');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Erreur lors de l\'envoi de la candidature. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LeadFlow</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/careers">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Candidature
          </h1>
          <p className="text-gray-600">
            Remplissez le formulaire ci-dessous pour postuler chez LeadFlow
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Upload Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-2 block">CV / Résumé</Label>
                  <div className="space-y-3">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">
                        {formData.resume ? formData.resume.name : 'Glissez-déposez votre CV ici'}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        ou cliquez pour sélectionner un fichier
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {formData.resume && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary">
                          <FileText className="w-4 h-4" />
                          <span>{formData.resume.name}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleAutofill}
                      disabled={!formData.resume}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Autocomplétion depuis le CV
                    </Button>
                    <p className="text-xs text-gray-500">
                      Téléchargez votre CV ici pour remplir automatiquement les champs clés de la candidature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Type here..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              {/* LinkedIn */}
              <div>
                <Label htmlFor="linkedin">Lien LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="Type here..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                />
              </div>

              {/* Salary Expectations */}
              <div>
                <Label htmlFor="salary">Quelles sont vos attentes salariales ?</Label>
                <Input
                  id="salary"
                  type="text"
                  placeholder="Type here..."
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Où êtes-vous basé(e) ?</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Type here..."
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              {/* French Fluency */}
              <div>
                <Label className="mb-3 block">Êtes-vous fluent en français ?</Label>
                <RadioGroup
                  value={formData.frenchFluent}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, frenchFluent: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="french-yes" />
                    <Label htmlFor="french-yes" className="font-normal cursor-pointer">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="french-no" />
                    <Label htmlFor="french-no" className="font-normal cursor-pointer">Non</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* English Fluency */}
              <div>
                <Label className="mb-3 block">Êtes-vous fluent en anglais ?</Label>
                <RadioGroup
                  value={formData.englishFluent}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, englishFluent: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="english-yes" />
                    <Label htmlFor="english-yes" className="font-normal cursor-pointer">Oui</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="english-no" />
                    <Label htmlFor="english-no" className="font-normal cursor-pointer">Non</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Soumettre la candidature'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
