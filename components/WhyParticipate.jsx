import { cn } from "@/lib/utils";
import {
  IconTrophy,
  IconUsers,
  IconMicrophone,
  IconBulb,
  IconHeartHandshake,
  IconTrendingUp,
  IconGift,
  IconCertificate,
} from "@tabler/icons-react";

export function WhyParticipate() {
  const features = [
    {
      title: "Exprimez votre talent",
      description:
        "Montrez vos compétences en art oratoire et éblouissez le public avec vos discours percutants.",
      icon: <IconMicrophone />,
    },
    {
      title: "Développez votre réseau",
      description:
        "Rencontrez d'autres jeunes talentueux et professionnels qui partagent vos centres d'intérêt.",
      icon: <IconUsers />,
    },
    {
      title: "Obtenez des récompenses",
      description:
        "Gagnez des prix prestigieux et des opportunités uniques pour valoriser votre talent.",
      icon: <IconGift />,
    },
    {
      title: "Renforcez vos compétences",
      description:
        "Améliorez vos aptitudes en communication et leadership grâce aux feedbacks et à la compétition.",
      icon: <IconBulb />,
    },
    {
      title: "Gagnez en visibilité",
      description:
        "Votre participation vous permettra de briller sur la scène publique et d'attirer des opportunités.",
      icon: <IconTrendingUp />,
    },
    {
      title: "Soutien et accompagnement",
      description:
        "Bénéficiez d'un encadrement et de conseils de la part d'experts pour perfectionner vos performances.",
      icon: <IconHeartHandshake />,
    },
    {
      title: "Certificats de participation",
      description:
        "Recevez un certificat officiel attestant de votre participation au concours.",
      icon: <IconCertificate />,
    },
    {
      title: "Gagnez le trophée",
      description:
        "Saisissez l'opportunité de remporter le grand prix et le titre de meilleur orateur de l'année.",
      icon: <IconTrophy />,
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold ">
          Pourquoi participer ?
        </h2>
        <p className="text-lg text-neutral-600 mt-4">
          Rejoignez le concours et saisissez l'opportunité de briller, d'enrichir vos compétences et de remporter des récompenses exceptionnelles.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex w-full max-sm:w-[100vw] flex-col lg:border-r py-10 relative group/feature border-gray-300",
        (index === 0 || index === 4) && "border-l",
        index < 4 && "border-b"
      )}
    >
      <div className="mb-4 relative z-10 px-10 text-neutral-600">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600  relative z-10 px-10">
        {description}
      </p>
    </div>
  );
}

export default WhyParticipate;
