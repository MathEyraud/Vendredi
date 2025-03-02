/**
 * @fileoverview Données de l'équipe marketing
 */

/**
 * Configuration de l'équipe marketing
 * @type {Object}
 */
const TEAM_MARKETING = {
    id: "marketing",
    name: "Équipe Marketing",
    members: [
        { id: 1, name: "Émilie Garnier", position: "Responsable Marketing", initials: "EG", allergenes: [] },
        { id: 2, name: "Lucas Moreau", position: "Content Manager", initials: "LM", allergenes: [] },
        { id: 3, name: "Chloé Petit", position: "Social Media", initials: "CP", allergenes: [] },
        { id: 4, name: "Hugo Lemaire", position: "SEO Specialist", initials: "HL", allergenes: [] },
        { id: 5, name: "Laura Fournier", position: "Brand Manager", initials: "LF", allergenes: [] }
    ],
    currentIndex: 2,
    startDate: new Date('2025-03-07')
};