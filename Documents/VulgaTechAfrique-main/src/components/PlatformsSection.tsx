import { Button } from "@/components/ui/button";
import { MessageCircle, Send, ArrowRight, Check } from "lucide-react";

const platforms = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366]",
    description: "Apprenez directement depuis votre messagerie préférée.",
    features: ["Cours interactifs", "Quiz automatiques", "Support vocal"],
    cta: "Rejoindre sur WhatsApp",
  },
  {
    name: "Telegram",
    icon: Send,
    color: "bg-[#0088cc]",
    description: "Accédez à notre bot pour des sessions enrichies.",
    features: ["Groupes d'étude", "Fichiers & médias", "Notifications"],
    cta: "Rejoindre sur Telegram",
  },
];

const PlatformsSection = () => {
  return (
    <section id="platforms" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Plateformes</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Apprenez où vous êtes déjà
          </h2>
          <p className="text-muted-foreground">
            Pas besoin de télécharger une nouvelle app. Utilisez les messageries que vous connaissez.
          </p>
        </div>

        {/* Platforms */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="bg-card rounded-xl p-6 lg:p-8 border border-border/50"
            >
              {/* Platform Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">{platform.name}</h3>
                  <p className="text-sm text-muted-foreground">Bot d'apprentissage</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                {platform.description}
              </p>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {platform.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {platform.cta}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformsSection;
