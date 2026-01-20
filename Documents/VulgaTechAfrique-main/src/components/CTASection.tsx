import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-xs text-accent font-medium">✨ Gratuit pour commencer</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Prêt à découvrir la robotique ?
          </h2>

          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Rejoignez plus de 50 000 apprenants qui ont déjà commencé leur voyage dans le monde de la robotique et de l'IA.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-6"
            >
              <MessageCircle className="w-4 h-4" />
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-border hover:bg-secondary h-12 px-6"
            >
              Voir les tarifs
            </Button>
          </div>

          {/* Languages */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">Disponible en 10+ langues</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {["🇫🇷", "🇬🇧", "🇪🇸", "🇸🇦", "🇩🇪", "🇵🇹", "🇨🇳", "🇯🇵", "🇮🇳", "🇧🇷"].map((flag, index) => (
                <span key={index} className="text-xl">
                  {flag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
