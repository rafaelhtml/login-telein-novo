import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, Youtube, Instagram, Phone, Headphones, Cloud, MessageSquare, Video, BarChart } from "lucide-react";
import teleinLogo from "@/assets/telein-logo.png";

const formSchema = z.object({
  email: z.string()
    .trim()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z.string()
    .min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof formSchema>;

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Aqui você implementará a lógica de login com o backend
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("senha", data.password);
      if (rememberMe) {
        formData.append("lembrar", "1");
      }
      
      const response = await fetch("https://interface.telein.com.br/s_login.php", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Login realizado!",
          description: "Você será redirecionado...",
        });
        // Redireciona após sucesso
        setTimeout(() => {
          window.location.href = "https://interface.telein.com.br/";
        }, 1000);
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "E-mail ou senha incorretos.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Não foi possível se conectar ao servidor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const products = [
    { icon: Phone, name: "PABX IP", description: "Central telefônica inteligente" },
    { icon: Headphones, name: "Call Center", description: "Gestão completa de atendimento" },
    { icon: Cloud, name: "Nuvem", description: "Infraestrutura escalável" },
    { icon: MessageSquare, name: "WhatsApp", description: "Integração e automação" },
    { icon: Video, name: "Videoconferência", description: "Reuniões profissionais" },
    { icon: BarChart, name: "Analytics", description: "Métricas e relatórios" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <img 
                src={teleinLogo} 
                alt="Telein Logo" 
                className="h-20 mx-auto mb-4"
              />
              <h1 className="text-xl font-semibold text-muted-foreground">
                Acesso ao Sistema
              </h1>
            </div>

            {/* Divider */}
            <div className="border-t border-border mb-6" />

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail ou login</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="E-mail ou login"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  className="transition-all"
                />
                {errors.email && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembrar
                </label>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Links */}
              <div className="space-y-3 text-center text-sm">
                <a 
                  href="https://interface.telein.com.br/passlost/esquecisenha.php"
                  className="block text-primary hover:underline"
                >
                  Esqueci minha senha
                </a>
                
                <a 
                  href="https://ipbxinteligente.com.br/"
                  className="block text-primary hover:underline"
                >
                  Nosso Site
                </a>
                
                <div className="text-muted-foreground">
                  Precisa de ajuda?{" "}
                  <a 
                    href="https://interface.telein.com.br/integra/ligueme/ligue.php?interface=bdb0d1b9e0"
                    className="text-primary hover:underline"
                  >
                    Fale Conosco
                  </a>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center gap-4 pt-2">
                  <a 
                    href="https://www.youtube.com/channel/UCYnFC1JBxDTtFn2qUoUTs2A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://instagram.com/telein_telecom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>

                {/* Privacy Policy */}
                <a 
                  href="https://site.telein.com.br/politica-de-privacidade/"
                  className="block text-muted-foreground hover:text-primary text-xs pt-2"
                >
                  Política de Privacidade
                </a>
              </div>
            </form>
          </div>

          {/* Products Ecosystem Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Nosso Ecossistema
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map((product, index) => (
                  <Card key={index} className="border-border hover:border-primary transition-colors">
                    <CardContent className="p-4 text-center">
                      <product.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* YouTube Video Section */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Vídeo Mais Recente
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed?listType=user_uploads&list=UCYnFC1JBxDTtFn2qUoUTs2A"
                  title="Vídeo mais recente - Telein"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                Confira nosso conteúdo no{" "}
                <a 
                  href="https://www.youtube.com/channel/UCYnFC1JBxDTtFn2qUoUTs2A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  YouTube
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
