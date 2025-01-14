import { Building2, Users, Globe2, Trophy, Target, Workflow } from 'lucide-react';

const InfoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Hero Section */}
      <div 
        className="relative h-[300px] rounded-xl mb-8 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070")'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/75"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-white p-8">
          <img 
            src="data:image/jpeg;base64,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"
            alt="Leoni Logo"
            className="w-24 h-24 rounded-full bg-white p-2 mb-4"
          />
          <h1 className="text-4xl font-bold mb-2">LEONI</h1>
          <p className="text-xl text-center max-w-2xl">
            Leader mondial dans la fabrication de câbles et de systèmes de câblage
          </p>
        </div>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <InfoCard
          icon={Building2}
          title="Fondation"
          content="Établie en 1917, LEONI est devenue une référence mondiale dans son domaine"
        />
        <InfoCard
          icon={Users}
          title="Employés"
          content="Plus de 100,000 employés à travers le monde"
        />
        <InfoCard
          icon={Globe2}
          title="Présence Mondiale"
          content="Présent dans plus de 30 pays avec plus de 100 sites de production"
        />
      </div>

      {/* Mission & Vision */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Notre Mission & Vision</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <Target className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Mission</h3>
              <p className="text-gray-600">
                Fournir des solutions de câblage innovantes et durables qui permettent à nos clients de réussir dans un monde en constante évolution.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Trophy className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p className="text-gray-600">
                Être le partenaire de premier choix pour des solutions de câblage intelligentes qui connectent le futur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Workflow className="w-6 h-6" />
          Nos Valeurs Fondamentales
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Innovation Continue",
            "Excellence Opérationnelle",
            "Développement Durable",
            "Satisfaction Client",
          ].map((value, index) => (
            <div 
              key={index}
              className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            >
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InfoCard = ({ icon: Icon, title, content }: { icon: any, title: string, content: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-start gap-4">
      <div className="bg-blue-50 rounded-lg p-3">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  </div>
);

export default InfoPage;

