import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Bell, Shield, Settings as SettingsIcon, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, isError } = useUserProfile(user?.id);
  const updateProfileMutation = useUpdateUserProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  // Preencher formulário quando o perfil carregar
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstname || "");
      setLastName(profile.lastname || "");
      setProfilePictureUrl(profile.profilepictureurl || "");
    }
  }, [profile]);

  const handleSaveProfile = () => {
    if (!user?.id) return;

    updateProfileMutation.mutate({
      userId: user.id,
      updates: {
        firstname: firstName,
        lastname: lastName,
        profilepictureurl: profilePictureUrl || undefined,
      },
    });
  };

  const isFormChanged = 
    firstName !== (profile?.firstname || "") ||
    lastName !== (profile?.lastname || "") ||
    profilePictureUrl !== (profile?.profilepictureurl || "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do sistema e preferências pessoais
        </p>
      </div>

      {/* Perfil */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-card-foreground">
            <User className="w-5 h-5 text-primary" />
            <span>Perfil</span>
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro ao carregar perfil. Por favor, tente novamente.
              </AlertDescription>
            </Alert>
          ) : !profile ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Perfil não encontrado. Por favor, entre em contato com o suporte.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apelido</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Seu apelido"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  O email não pode ser alterado através desta página
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePictureUrl">URL da Foto de Perfil (Opcional)</Label>
                <Input
                  id="profilePictureUrl"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={!isFormChanged || updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      A guardar...
                    </>
                  ) : (
                    "Guardar Alterações"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-card-foreground">
            <Bell className="w-5 h-5 text-primary" />
            <span>Notificações</span>
          </CardTitle>
          <CardDescription>
            Configurações de notificação em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade será implementada em breve. Aqui poderá gerir as suas preferências de notificações por email, push e resumos automáticos.
          </p>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-card-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span>Segurança</span>
          </CardTitle>
          <CardDescription>
            Configurações de segurança em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade será implementada em breve. Aqui poderá configurar autenticação de dois fatores, gerir sessões ativas e visualizar o histórico de acessos.
          </p>
        </CardContent>
      </Card>

      {/* Configurações do Sistema */}
      <Card className="bg-gradient-card border-border shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-card-foreground">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span>Configurações do Sistema</span>
          </CardTitle>
          <CardDescription>
            Configurações avançadas em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade será implementada em breve. Aqui poderá configurar backup automático, modo de manutenção, logs detalhados e cache inteligente.
          </p>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="bg-gradient-card border-destructive/50 shadow-elevation">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações críticas em desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade será implementada em breve. Aqui poderá resetar configurações ou limpar dados do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
