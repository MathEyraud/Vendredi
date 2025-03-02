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
        { id: 1, name: "Sophie Martin", position: "Développeuse Front-end", initials: "SM", allergenes: ["Noix", "Amandes"], birthdate: "04-15" },
        { id: 2, name: "Thomas Lefebvre", position: "Développeur Back-end", initials: "TL", allergenes: [], birthdate: "09-23" },
        { id: 3, name: "Julie Dubois", position: "Designer UX/UI", initials: "JD", allergenes: ["Lactose"], birthdate: "07-19" },
        { id: 4, name: "Antoine Laurent", position: "Chef de projet", initials: "AL", allergenes: [], birthdate: "02-14" },
        { id: 5, name: "Marie Rousseau", position: "Développeuse Mobile", initials: "MR", allergenes: ["Gluten"], birthdate: "10-31" },
        { id: 6, name: "Pierre Bernard", position: "DevOps", initials: "PB", allergenes: [], birthdate: "05-25" },
        { id: 7, name: "Claire Leroy", position: "Développeuse Back-end", initials: "CL", allergenes: ["Sésame"], birthdate: "12-01" },
        { id: 8, name: "Nicolas Dupont", position: "Data Scientist", initials: "ND", allergenes: [], birthdate: "03-08" }
    ],
    currentIndex: 0,
    startDate: new Date('2025-02-07')
};