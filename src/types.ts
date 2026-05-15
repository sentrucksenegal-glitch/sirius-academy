export type CandidateStatus = 'pending' | 'contacted' | 'accepted' | 'rejected';

export interface Candidate {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  motivation: string;
  status: CandidateStatus;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  objective: string;
  prerequisites: string[];
  targetAudience: string[];
  duration: string;
  price: string;
  paymentType: 'unique' | 'monthly';
  installments?: number;
  monthlyPrice?: string;
  paymentDetails?: string;
  image: string;
  curriculum: string[];
  visible: boolean;
  order: number;
}

export const COURSES: Course[] = [
  {
    id: 'fullstack',
    title: 'Développement Fullstack',
    description: 'Devenez un développeur web complet maîtrisant React, Node.js et les bases de données.',
    detailedDescription: 'Cette formation intensive vous propulse au rang de développeur opérationnel. Vous apprendrez à concevoir des architectures robustes, à gérer des bases de données complexes et à créer des interfaces utilisateurs réactives et performantes.',
    objective: 'Maîtriser l\'écosystème JavaScript moderne pour construire des applications web scalables et prêtes pour la production.',
    prerequisites: ['Logique de programmation de base', 'Familiarité avec le web', 'Ordinateur personnel (minimum 8Go RAM)'],
    targetAudience: ['Étudiants en quête de spécialisation', 'Reconversion professionnelle', 'Développeurs front ou back souhaitant devenir fullstack'],
    duration: '12 semaines',
    price: '250.000 FCFA',
    paymentType: 'monthly',
    installments: 3,
    monthlyPrice: '85.000 FCFA',
    paymentDetails: 'Frais d\'inscription de 50.000 FCFA inclus. Possibilité de régler en 3 tranches mensuelles.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    curriculum: [
      'Fondamentaux HTML/CSS & TypeScript',
      'Maîtrise de React & Gestion d\'état',
      'Backend avec Node.js & Express',
      'Bases de données SQL & NoSQL',
      'Déploiement & CI/CD'
    ],
    visible: true,
    order: 1
  },
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Concevez des interfaces centrées utilisateur et des expériences digitales mémorables.',
    detailedDescription: 'Le design ne se limite pas à l\'esthétique. Apprenez la psychologie cognitive, la recherche utilisateur et le prototypage avancé pour créer des produits digitaux que les gens aiment utiliser.',
    objective: 'Apprendre à transformer des besoins utilisateurs en interfaces élégantes, fonctionnelles et centrées sur l\'humain.',
    prerequisites: ['Aisance avec les outils informatiques', 'Sensibilité esthétique', 'Curiosité pour la psychologie'],
    targetAudience: ['Graphistes souhaitant se digitaliser', 'Entrepreneurs', 'Product Managers'],
    duration: '8 semaines',
    price: '150.000 FCFA',
    paymentType: 'monthly',
    installments: 2,
    monthlyPrice: '75.000 FCFA',
    paymentDetails: '50% à l\'inscription, 50% au milieu du cursus.',
    image: 'https://images.unsplash.com/photo-1561070791-26c11d69963d?auto=format&fit=crop&q=80&w=800',
    curriculum: [
      'Recherche Utilisateur & Personas',
      'Wireframing & Architecture d\'info',
      'Design Visuel avec Figma',
      'Prototypage Interactif',
      'Tests Utilisateurs & Itérations'
    ],
    visible: true,
    order: 2
  },
  {
    id: 'digital-marketing',
    title: 'Marketing Digital',
    description: 'Maîtrisez les réseaux sociaux, le SEO et les régies publicitaires pour propulser tout business.',
    detailedDescription: 'Devenez l\'expert que toutes les entreprises recherchent. Apprenez à élaborer des stratégies de croissance, à gérer des budgets publicitaires et à analyser les données pour un ROI maximal.',
    objective: 'Maîtriser les leviers d\'acquisition digitaux pour générer du trafic qualifié et des ventes.',
    prerequisites: ['Aisance avec les réseaux sociaux', 'Esprit d\'analyse', 'Capacités rédactionnelles'],
    targetAudience: ['Community Managers', 'Entrepreneurs', 'Responsables Marketing'],
    duration: '6 semaines',
    price: '120.000 FCFA',
    paymentType: 'monthly',
    installments: 2,
    monthlyPrice: '60.000 FCFA',
    paymentDetails: 'Paiement en deux mensualités accepté.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    curriculum: [
      'Stratégie de Contenu & Social Media',
      'Publicité Payante (Ads)',
      'SEO & Référencement Naturel',
      'Copywriting & Email Marketing',
      'Analytics & Data Tracking'
    ],
    visible: true,
    order: 3
  },
  {
    id: 'data-science',
    title: 'Data Science & IA',
    description: 'Apprenez à manipuler les données et intégrer les outils d\'IA dans vos processus métiers.',
    detailedDescription: 'Les données sont le nouveau pétrole. Apprenez à extraire de la valeur, à créer des modèles prédictifs et à tirer parti de l\'Intelligence Artificielle pour transformer les entreprises.',
    objective: 'Devenir capable d\'analyser des données massives et de déployer des solutions basées sur l\'IA pour la prise de décision.',
    prerequisites: ['Bases en mathématiques', 'Logique algorithmique', 'Connaissances Excel'],
    targetAudience: ['Analystes', 'Ingénieurs', 'Professionnels de la finance'],
    duration: '10 semaines',
    price: '300.000 FCFA',
    paymentType: 'monthly',
    installments: 3,
    monthlyPrice: '100.000 FCFA',
    paymentDetails: 'Frais de dossier inclus. Règlement en 3 tranches possible.',
    image: 'https://images.unsplash.com/photo-1518186239124-384382ae9bb2?auto=format&fit=crop&q=80&w=800',
    curriculum: [
      'Python pour la Data Science',
      'Analyse Statistique & Visualisation',
      'Introduction au Machine Learning',
      'Deep Learning & NLP Basics',
      'IA Générative pour le Business'
    ],
    visible: true,
    order: 4
  },
  {
    id: 'canva-master',
    title: 'Design Express (Canva)',
    description: 'Créez des visuels professionnels en un temps record pour vos réseaux sociaux.',
    detailedDescription: 'Une formation courte et intensive pour maîtriser Canva et créer des designs percutants sans être un graphiste professionnel. Idéal pour entrepreneurs et community managers.',
    objective: 'Produire des visuels professionnels et cohérents pour le web et l\'impression en utilisant Canva.',
    prerequisites: ['Aucun prérequis technique'],
    targetAudience: ['Propriétaires de petites entreprises', 'Assistants virtuels', 'Particuliers'],
    duration: '3 jours',
    price: '35.000 FCFA',
    paymentType: 'unique',
    paymentDetails: 'Paiement unique à l\'inscription.',
    image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=800',
    curriculum: [
      'Maîtrise de l\'interface Canva',
      'Théorie des couleurs et typographie',
      'Création de kits de marque',
      'Design pour réseaux sociaux',
      'Animation et export vidéo'
    ],
    visible: true,
    order: 5
  }
];
