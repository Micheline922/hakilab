/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LawItem } from "../types";

export const CONGO_LAWS: LawItem[] = [
  // CONSTITUTION
  {
    id: "const-art1",
    title: "Article 1 : Nature de l'État et Frontières",
    category: "Livre",
    source: "Constitution de la RDC, Art. 1",
    excerpt: "La République Démocratique du Congo est, dans ses frontières du 30 juin 1960, un État de droit, indépendant, souverain, uni et indivisible, social, démocratique et laïc.",
    context: "L'ancrage territorial et le principe inviolable de l'État de droit fondent l'autorité de toutes les juridictions de la République."
  },
  {
    id: "const-art12",
    title: "Article 12 : Égalité devant la loi",
    category: "Livre",
    source: "Constitution de la RDC, Art. 12",
    excerpt: "Tous les Congolais sont égaux devant la loi et ont droit à une égale protection des lois.",
    context: "Garantit le droit d'accès équitable à la justice pour l'ensemble des citoyens, sans discrimination de tribu, sexe ou classe sociale."
  },
  {
    id: "const-art16",
    title: "Article 16 : Sacralité de la personne humaine",
    category: "Livre",
    source: "Constitution de la RDC, Art. 16",
    excerpt: "La personne humaine est sacrée. L'État a l'obligation de la respecter et de la protéger. Nul ne peut être soumis à des traitements cruels, inhumains ou dégradants.",
    context: "Base fondamentale invoquée dans les poursuites pour tortures, violences corporelles ou arrestations arbitraires par les forces de l'ordre."
  },
  {
    id: "const-art150",
    title: "Article 150 : Rôle du Pouvoir Judiciaire",
    category: "Livre",
    source: "Constitution de la RDC, Art. 150",
    excerpt: "Le pouvoir judiciaire est le garant des libertés individuelles et des droits fondamentaux des citoyens. Les juges ne sont soumis, dans l'exercice de leur fonction, qu'à l'autorité de la loi.",
    context: "Consacre l'indépendance de la magistrature face au pouvoir législatif et exécutif en RDC."
  },

  // CODE CIVIL III - OBLIGATIONS
  {
    id: "ccciii-art33",
    title: "Article 33 : Force obligatoire du contrat",
    category: "Article",
    source: "Code Civil Congolais Livre III, Art. 33",
    excerpt: "Les conventions légalement formées tiennent lieu de loi à ceux qui les ont faites. Elles ne peuvent être révoquées que de leur consentement mutuel ou pour les causes que la loi autorise. Elles doivent être exécutées de bonne foi.",
    context: "Il s'agit du principe clé 'pacta sunt servanda' régissant le droit des affaires et des contrats civils en RDC."
  },
  {
    id: "ccciii-art258",
    title: "Article 258 : Responsabilité Civile Délictuelle (Le pilier CCCIII)",
    category: "Article",
    source: "Code Civil Congolais Livre III, Art. 258",
    excerpt: "Tout fait quelconque de l'homme, qui cause à autrui un dommage, oblige celui par la faute duquel il est arrivé à le réparer.",
    context: "C'est l'article le plus célèbre et le plus plaidé en droit congolais. Tout procès en indemnisation de préjudice matériel, moral ou corporel repose obligatoirement sur cette disposition."
  },
  {
    id: "ccciii-art259",
    title: "Article 259 : Responsabilité pour négligence ou imprudence",
    category: "Article",
    source: "Code Civil Congolais Livre III, Art. 259",
    excerpt: "Chacun est responsable du dommage qu'il a causé non seulement par son fait, mais encore par sa négligence ou par son imprudence.",
    context: "Étend l'obligation de réparation aux accidents non-intentionnels, fautes médicales ou imprudences professionnelles."
  },

  // CODE DE LA FAMILLE (Loi de 2016)
  {
    id: "cfam-art330",
    title: "Article 330 : Définition du Mariage",
    category: "Livre",
    source: "Code de la Famille, Art. 330",
    excerpt: "Le mariage est l'union civile et solennelle entre un homme et une femme d'au moins 18 ans révolus, célébrée publiquement devant l'officier de l'état civil.",
    context: "Le Code de la famille interdit formellement le mariage de mineurs et consacre l'officier de l'état civil comme seul certificateur d'une union légitime."
  },
  {
    id: "cfam-art349",
    title: "Article 349 : Caractère obligatoire de la Dot",
    category: "Livre",
    source: "Code de la Famille, Art. 349",
    excerpt: "La dot est un élément obligatoire pour la validité du mariage coutumier et sa célébration civile. Sa valeur est fixée de commun accord sans dépasser les plafonds légaux.",
    context: "Une particularité majeure du droit de la famille en RDC combinant la coutume ancestrale à la loi écrite républicaine."
  },
  {
    id: "cfam-art444",
    title: "Article 444 : Direction conjointe du foyer",
    category: "Livre",
    source: "Code de la Famille, Art. 444 (Réformé en 2016)",
    excerpt: "Les époux s'obligent mutuellement à une communauté de vie, de soutien et de respect. Le choix de la résidence de la famille est fait de commun accord par les deux époux. Ils gèrent ensemble le patrimoine commun.",
    context: "La réforme historique de 2016 a supprimé la mention de 'l'époux chef de famille' pour accorder une égalité de gestion absolue entre époux."
  },

  // CODE PÉNAL
  {
    id: "cpen-art44",
    title: "Article 44 : Blessures et Coups Volontaires",
    category: "Article",
    source: "Code Pénal Congolais, Art. 44",
    excerpt: "Celui qui aura volontairement causé des blessures ou fait des coups, sera puni d'une servitude pénale d'un mois à deux ans et d'une amende, ou d'une de ces peines seulement. Si la blessure entraîne une incapacité de travail, la peine est doublée.",
    context: "Article clé pour la répression des agressions physiques et violences domestiques."
  },
  {
    id: "cpen-art147",
    title: "Article 147 : Définition du Vol et Sanctions",
    category: "Article",
    source: "Code Pénal Congolais, Art. 147",
    excerpt: "Quiconque aura soustrait frauduleusement une chose qui ne lui appartient pas est coupable de vol. Le vol simple est puni d'une peine de servitude pénale de un à cinq ans.",
    context: "L'infraction civile de soustraction de propriété privée est rigoureusement qualifiée et de compétence correctionnelle."
  },

  // CODE DU TRAVAIL
  {
    id: "ctrav-art42",
    title: "Article 42 : Rupture du Contrat à Durée Indéterminée",
    category: "Article",
    source: "Code du Travail Congolais, Art. 42",
    excerpt: "Le contrat de travail à durée indéterminée ne peut être résilié à l'initiative de l'employeur que pour un motif valable lié à l'aptitude ou à la conduite du travailleur, ou fondé sur les nécessités du service. Tout licenciement sans motif valable donne droit à des dommages-intérêts.",
    context: "C'est la disposition clé contre le licenciement abusif. Le fardeau de la preuve pèse entièrement sur l'employeur devant le Tribunal du Travail."
  },
  {
    id: "ctrav-art62",
    title: "Article 62 : Licenciement Économique",
    category: "Article",
    source: "Code du Travail Congolais, Art. 62",
    excerpt: "Le licenciement pour motif économique de plusieurs travailleurs est soumis à une consultation préalable de la délégation syndicale et à l'autorisation écrite préalable de l'inspecteur du travail de la juridiction compétente.",
    context: "Un garde-fou social majeur empêchant les restructurations sauvages sans supervision étatique en RDC."
  },

  // ARRÊTÉS & JURISPRUDENCES
  {
    id: "juris-rc1200",
    title: "Arrêt R.Const 1200/2021 : Contrôle de constitutionnalité de l'état de siège",
    category: "Jurisprudence",
    source: "Cour Constitutionnelle de la RDC, Arrêt n° R.Const 1200 du 15 mai 2021",
    excerpt: "La Cour déclare conformes à la Constitution les ordonnances du Chef de l'État proclamant l'état de siège dans les provinces de l'Ituri et du Nord-Kivu, tout en affirmant que les juridictions civiles conservent leur compétence sur les litiges sans lien direct avec les opérations militaires.",
    context: "Marque une limite claire aux compétences de la justice militaire de substitution, protégeant le droit naturel des citoyens aux juges civils ordinaires."
  },
  {
    id: "juris-rp4455",
    title: "Arrêt R.P. 4455/Cass : De l'indemnisation morale autonome",
    category: "Jurisprudence",
    source: "Cour de Cassation de la RDC, Arrêt n° R.P. 4455 du 22 octobre 2019",
    excerpt: "La Cour de Cassation juge qu'en application de l'article 258 du Code Civil Livre III, le préjudice moral est autonome par rapport au préjudice matériel et doit faire l'objet d'une réparation distincte de nature à compenser la douleur psychologique ressentie par la victime.",
    context: "Une jurisprudence vitale qui formalise le barème jurisprudentiel de l'indemnisation morale dans le droit médical et des transports."
  },
  {
    id: "arrete-min002",
    title: "Arrêté Ministériel n°002/2018 : Enregistrement des Cabinets d'Avocats",
    category: "Arrêté",
    source: "Arrêté du Ministre de la Justice et Garde des Sceaux n°002/JUST/2018",
    excerpt: "Tout cabinet d'avocat légalement constitué sur le territoire de la RDC doit obligatoirement être inscrit auprès du Barreau près la Cour d'Appel concernée et faire déposer ses conventions d'association par le Chef de Cabinet.",
    context: "Régule la forme d'association inter-avocats pour lutter contre le courtage juridique clandestin."
  },

  // COUTUMES ET USAGES
  {
    id: "cout-mariage",
    title: "Coutume Léman : Accord des clans pour le rachat de l'alliance",
    category: "Coutume",
    source: "Coutumes et Usages de l'ex-Province du Bandundu (Validé)",
    excerpt: "Dans les affaires matrimoniales coutumières, l'absence de consentement formel par versement du symbole 'N'kembo' (présent de reconnaissance) par le chef de famille du marié rend toute cohabitation caduque aux yeux de la communauté matrimoniale locale.",
    context: "Sous réserve de conformité à l'ordre public républicain, les tribunaux de paix reconnaissent ces étapes coutumières pour la célébration effective d'un mariage de fait."
  },
  {
    id: "usage-foncier",
    title: "Usage Foncier Swahili : Partage des concessions coutumières",
    category: "Usage",
    source: "Guide des Usages Fonciers Traditionnels du Grand Kivu (Toléré)",
    excerpt: "Le fermage coutumier de surface ('Kalindula') accorde un droit d'usage perpétuel au métayer sur les récoltes saisonnières, sous réserve d'une redevance symbolique annuelle au chef coutumier ('Mwami').",
    context: "Sert de référence de fait dans la résolution pacifique des conflits fonciers agro-pastoraux à l'Est de la RDC avant comparution devant les tribunaux civils de grande instance."
  }
];
