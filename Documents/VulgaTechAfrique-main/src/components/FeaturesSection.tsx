import { Bot, Globe, Users, Zap, BookOpen, Award } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Chatbot Intelligent",
    description: "Un assistant IA disponible 24/7 pour répondre à vos questions et vous guider.",
  },
  {
    icon: Globe,
    title: "Multilingue",
    description: "Cours disponibles en français, anglais, arabe et 7 autres langues africaines.",
  },
  {
    icon: Users,
    title: "Communauté Active",
    description: "Rejoignez des milliers d'apprenants et collaborez sur des projets.",
  },
  {
    icon: Zap,
    title: "Apprentissage Rapide",
    description: "Méthode optimisée pour apprendre les concepts complexes simplement.",
  },
  {
    icon: BookOpen,
    title: "Projets Pratiques",
    description: "Construisez de vrais robots et programmes IA étape par étape.",
  },
  {
    icon: Award,
    title: "Certifications",
    description: "Obtenez des certificats reconnus pour valider vos compétences.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-primary font-medium text-sm uppercase tracking-wider mb-3">Fonctionnalités</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Tout pour apprendre efficacement
          </h2>
          <p className="text-muted-foreground">
            Une plateforme complète conçue pour rendre la robotique et l'IA accessibles, 
            peu importe votre niveau.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border/50 hover:border-border transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>

              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
