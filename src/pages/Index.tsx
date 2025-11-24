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
import { Eye, EyeOff, Loader2, Youtube, Instagram, Phone, Headphones, Cloud, MessageSquare, Video, BarChart, Bot, PhoneCall, Zap, Mic, Smartphone } from "lucide-react";
import teleinLogo from "@/assets/telein-logo.png";
import blackFridayPromo from "@/assets/black-friday-promo.png";

const formSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Login é obrigatório")
    .max(255, "Login muito longo"),
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
    // Validar reCAPTCHA
    const recaptchaResponse = (window as any).grecaptcha?.getResponse();
    
    if (!recaptchaResponse) {
      toast({
        variant: "destructive",
        title: "Verificação necessária",
        description: "Por favor, selecione 'Não sou um robô'.",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("https://interface.telein.com.br/op_access.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          login: data.email,
          senha: data.password,
          recaptcha: recaptchaResponse,
        }),
      });

      // Verificar se a resposta é OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Backend response:", result);

      // Verificar se há página para redirecionar
      if (result.pagina) {
        // Mostrar toast apropriado antes de redirecionar
        if (result.tipo === "danger" || result.tipo === "warning") {
          if (result.mensagem) {
            toast({
              variant: "destructive",
              title: "Atenção",
              description: result.mensagem,
            });
          }
        } else if (result.tipo === "info") {
          if (result.mensagem) {
            toast({
              title: "Informação",
              description: result.mensagem,
            });
          }
        } else {
          if (result.mensagem) {
            toast({
              title: "Sucesso!",
              description: result.mensagem,
            });
          }
        }
        
        // Redirecionar para a página indicada
        setTimeout(() => {
          window.location.href = `https://interface.telein.com.br/${result.pagina}`;
        }, 500);
      } else {
        // Sem página para redirecionar, apenas mostrar mensagem
        if (result.tipo === "danger" || result.tipo === "warning") {
          toast({
            variant: "destructive",
            title: "Erro",
            description: result.mensagem || "Erro ao fazer login.",
          });
          // Resetar reCAPTCHA
          (window as any).grecaptcha?.reset();
        } else if (result.tipo === "info") {
          toast({
            title: "Informação",
            description: result.mensagem || "Login processado.",
          });
        } else {
          toast({
            title: "Sucesso!",
            description: result.mensagem || "Login realizado com sucesso!",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro de conexão",
        description: "Erro ao conectar com o servidor. Tente novamente.",
      });
      // Resetar reCAPTCHA
      (window as any).grecaptcha?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const products = [
    { icon: Bot, name: "Agentes de IA 24/7", description: "Crie atendentes por IA que respondem clientes instantaneamente, qualificam leads e agendam reuniões", iconColor: "text-orange-500", bgColor: "bg-orange-100" },
    { icon: PhoneCall, name: "URA Reversa", description: "Robô que liga automaticamente para sua base, qualifica interessados e transfere para seu time", iconColor: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: MessageSquare, name: "Chat Omnichannel (Chat Telein)", description: "Centralize WhatsApp e outros canais em uma única plataforma de atendimento", iconColor: "text-orange-500", bgColor: "bg-orange-100" },
    { icon: Zap, name: "Disparo em Massa", description: "Envie milhares de mensagens personalizadas via WhatsApp usando API oficial ou convencional", iconColor: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: Mic, name: "Discador", description: "Sistema que disca automaticamente para sua base e conecta apenas chamadas atendidas ao time", iconColor: "text-orange-500", bgColor: "bg-orange-100" },
    { icon: Smartphone, name: "Chipmassa", description: "Números virtuais descartáveis para ativar WhatsApp, Telegram e outros apps em massa", iconColor: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: Phone, name: "IPBX Inteligente", description: "PABX IP virtual com recursos avançados de telefonia em nuvem", iconColor: "text-orange-500", bgColor: "bg-orange-100" },
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Left Section - Featured, Ecosystem and Video */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Featured Image Section - Black Friday Promo */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-6">
              <a 
                href="https://wa.me/558134542323"
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img 
                  src={blackFridayPromo} 
                  alt="Promoção Black Friday Telein - Contrate 2 meses de URA Reversa e ganhe 30% de desconto no segundo mês - Clique para falar no WhatsApp" 
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            {/* Products Ecosystem Section - Compact */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-6">
              <h2 className="text-lg font-bold mb-4">
                Recursos do Ecossistema
              </h2>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`${product.bgColor} p-2 rounded-md flex-shrink-0`}>
                      <product.icon className={`w-4 h-4 ${product.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs mb-0.5">{product.name}</h3>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube Video Section - Compact */}
            <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-6">
              <h2 className="text-lg font-bold mb-4">
                Vídeo em Destaque
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/lCnqreVhR6M"
                  title="Vídeo em destaque - Telein"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
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

          {/* Right Section - Login Form */}
          <div className="bg-card rounded-2xl shadow-[var(--shadow-elegant)] p-8 lg:sticky lg:top-8 order-1 lg:order-2">
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
                  type="text"
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

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <div className="g-recaptcha" data-sitekey="6Ld-2X0pAAAAALFJnnG5lTj_D7SeDpQPjAM1MGu0"></div>
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
                    href="https://wa.me/558134542323"
                    target="_blank"
                    rel="noopener noreferrer"
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
        </div>
      </div>
    </div>
  );
};

export default Index;
