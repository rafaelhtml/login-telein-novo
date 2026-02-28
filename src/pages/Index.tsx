import { useState, useEffect, useRef } from "react";
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
import agenteIaPromoFallback from "@/assets/agente-ia-promo.png";

interface ImagemDestaque {
  url: string;
  link: string;
  alt: string;
}

interface SiteConfig {
  imagensDestaque: ImagemDestaque[];
  videoDestaque: { youtubeId: string };
}

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
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}config.json?${Date.now()}`)
      .then(r => r.json())
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Renderizar reCAPTCHA quando estiver pronto
  useEffect(() => {
    const renderRecaptcha = () => {
      if (
        recaptchaRef.current &&
        (window as any).grecaptcha &&
        (window as any).grecaptcha.render &&
        recaptchaWidgetId.current === null
      ) {
        try {
          recaptchaWidgetId.current = (window as any).grecaptcha.render(recaptchaRef.current, {
            sitekey: '6Ld-2X0pAAAAALFJnnG5lTj_D7SeDpQPjAM1MGu0'
          });
          setRecaptchaReady(true);
        } catch (error) {
          console.error('Erro ao renderizar reCAPTCHA:', error);
        }
      }
    };

    // Verificar se o grecaptcha já está disponível
    if ((window as any).grecaptcha && (window as any).grecaptcha.render) {
      renderRecaptcha();
    } else {
      // Aguardar o callback onload
      (window as any).onRecaptchaLoad = renderRecaptcha;
    }

    return () => {
      // Cleanup
      if (recaptchaWidgetId.current !== null) {
        try {
          (window as any).grecaptcha?.reset(recaptchaWidgetId.current);
        } catch (error) {
          console.error('Erro ao resetar reCAPTCHA:', error);
        }
      }
    };
  }, []);

  const onSubmit = async (data: FormData) => {
    // Validar reCAPTCHA
    const recaptchaResponse = recaptchaWidgetId.current !== null 
      ? (window as any).grecaptcha?.getResponse(recaptchaWidgetId.current)
      : (window as any).grecaptcha?.getResponse();
    
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
          if (recaptchaWidgetId.current !== null) {
            (window as any).grecaptcha?.reset(recaptchaWidgetId.current);
          } else {
            (window as any).grecaptcha?.reset();
          }
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
      if (recaptchaWidgetId.current !== null) {
        (window as any).grecaptcha?.reset(recaptchaWidgetId.current);
      } else {
        (window as any).grecaptcha?.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const products = [
    { icon: Bot, name: "Agentes de IA 24/7", description: "Crie atendentes por IA que respondem clientes instantaneamente, qualificam leads e agendam reuniões", iconColor: "text-orange-500", bgColor: "bg-orange-100", url: "https://ia.telein.com.br" },
    { icon: PhoneCall, name: "URA Reversa", description: "Robô que liga automaticamente para sua base, qualifica interessados e transfere para seu time", iconColor: "text-blue-500", bgColor: "bg-blue-100", url: "https://urareversa.com.br" },
    { icon: MessageSquare, name: "Chat Omnichannel (Chat Telein)", description: "Centralize WhatsApp e outros canais em uma única plataforma de atendimento", iconColor: "text-orange-500", bgColor: "bg-orange-100", url: "https://site.telein.com.br/chat-telein" },
    { icon: Zap, name: "Disparo em Massa", description: "Envie milhares de mensagens personalizadas via WhatsApp usando API oficial ou convencional", iconColor: "text-blue-500", bgColor: "bg-blue-100" },
    { icon: Mic, name: "Discador", description: "Sistema que disca automaticamente para sua base e conecta apenas chamadas atendidas ao time", iconColor: "text-orange-500", bgColor: "bg-orange-100", url: "https://ipbxinteligente.com.br/discador-gratis/" },
    { icon: Smartphone, name: "Chipmassa", description: "Números virtuais descartáveis para ativar WhatsApp, Telegram e outros apps em massa", iconColor: "text-blue-500", bgColor: "bg-blue-100", url: "https://ipbxinteligente.com.br/chip-massa-numeros-virtuais-para-receber-sms/" },
    { icon: Phone, name: "IPBX Inteligente", description: "PABX IP virtual com recursos avançados de telefonia em nuvem", iconColor: "text-orange-500", bgColor: "bg-orange-100", url: "https://ipbxinteligente.com.br/pabx-virtual-nuvem/" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
          {/* Left Section - Featured, Ecosystem and Video */}
          <div className="space-y-6 order-2 lg:order-1 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
            {/* Featured Image Section - Black Friday Promo */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-glass)] p-6 border border-primary/10 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
              {(() => {
                const imagens = config?.imagensDestaque?.filter(img => img) || [];
                const img = imagens.length > 0 ? imagens[Math.floor(Math.random() * imagens.length)] : null;
                const imgUrl = img?.url && img.url.trim() !== '' ? img.url : agenteIaPromoFallback;
                const imgLink = img?.link || "https://www.youtube.com/watch?v=lCnqreVhR6M";
                const imgAlt = img?.alt || "Promoção Telein";
                return (
                  <a 
                    href={imgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                  >
                    <img 
                      src={imgUrl} 
                      alt={imgAlt} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = agenteIaPromoFallback; }}
                    />
                  </a>
                );
              })()}
            </div>

            {/* Products Ecosystem Section - Compact */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-glass)] p-6 border border-primary/10">
              <h2 className="text-lg font-bold mb-4">
                Recursos do Ecossistema
              </h2>
              <div className="space-y-2">
                {products.map((product, index) => {
                  const content = (
                    <>
                      <div className={`${product.bgColor} p-2 rounded-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <product.icon className={`w-4 h-4 ${product.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xs mb-0.5">{product.name}</h3>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </>
                  );

                  if (product.url) {
                    return (
                      <a
                        key={index}
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* YouTube Video Section - Compact */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-glass)] p-6 border border-primary/10">
              <h2 className="text-lg font-bold mb-4">
                Vídeo em Destaque
              </h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${config?.videoDestaque?.youtubeId || "lCnqreVhR6M"}`}
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
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-[var(--shadow-glass)] p-8 lg:sticky lg:top-8 order-1 lg:order-2 border border-primary/10 animate-scale-in">
            {/* Logo */}
            <div className="text-center mb-6">
              <img 
                src={teleinLogo} 
                alt="Telein Logo" 
                className="h-20 mx-auto mb-4 animate-fade-in-up"
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
                  className="transition-all focus:shadow-[0_0_0_3px_hsl(217_91%_50%/0.1)] focus:border-primary"
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
                    className="transition-all focus:shadow-[0_0_0_3px_hsl(217_91%_50%/0.1)] focus:border-primary"
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
                <div ref={recaptchaRef}></div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-lg hover:shadow-[var(--shadow-glow)] hover:scale-[1.02]"
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

              {/* Register Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/5 hover:scale-[1.02] transition-all duration-300"
                size="lg"
                onClick={() => window.open('https://iniciar.telein.com.br/', '_blank')}
              >
                Cadastrar
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
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover:-translate-y-1"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a 
                    href="https://instagram.com/telein_telecom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-accent transition-all duration-300 hover:scale-125 hover:-translate-y-1"
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
