/**
 * @fileoverview Données de l'équipe développement
 */

/**
 * Configuration de l'équipe développement
 * @type {Object}
 */
const TEAM_DEV = {
    id: "dev",
    name: "Équipe Développement",
    members: [
        { id: 1, name: "Sophie Martin", position: "Développeuse Front-end", initials: "SM", allergenes: ["Noix", "Amandes"] },
        { id: 2, name: "Thomas Lefebvre", position: "Développeur Back-end", initials: "TL", allergenes: [] },
        { id: 3, name: "Julie Dubois", position: "Designer UX/UI", initials: "JD", allergenes: ["Lactose"] },
        { id: 4, name: "Antoine Laurent", position: "Chef de projet", initials: "AL", allergenes: [] },
        { id: 5, name: "Marie Rousseau", position: "Développeuse Mobile", initials: "MR", allergenes: ["Gluten"] },
        { id: 6, name: "Pierre Bernard", position: "DevOps", initials: "PB", allergenes: [] },
        { id: 7, name: "Claire Leroy", position: "Développeuse Back-end", initials: "CL", allergenes: ["Sésame"] },
        { id: 8, name: "Nicolas Dupont", position: "Data Scientist", initials: "ND", allergenes: [] }
    ],
    currentIndex: 0,
    startDate: new Date('2025-03-07')
};