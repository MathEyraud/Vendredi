/**
 * @fileoverview Données de l'équipe exemple
 */

/**
 * Configuration de l'équipe exemple
 * @type {Object}
 */
const TEAM_EXEMPLE = {
    id: "exemple",
    name: "Équipe exemple",
    members: [
        { id: 1, name: "Sophie Martin", position: "Développeuse Front-end", initials: "SM", allergenes: ["Noix", "Amandes"], birthdate: "04-15", nameDay: "07-26" },
        { id: 2, name: "Thomas Lefebvre", position: "Développeur Back-end", initials: "TL", allergenes: [], birthdate: "09-23", nameDay: "12-21" },
        { id: 3, name: "Julie Dubois", position: "Designer UX/UI", initials: "JD", allergenes: ["Lactose"], birthdate: "07-19", nameDay: "05-22" },
        { id: 4, name: "Antoine Laurent", position: "Chef de projet", initials: "AL", allergenes: [], birthdate: "02-14", nameDay: "01-17" },
        { id: 5, name: "Marie Rousseau", position: "Développeuse Mobile", initials: "MR", allergenes: ["Gluten"], birthdate: "10-31", nameDay: "08-15" },
        { id: 6, name: "Pierre Bernard", position: "DevOps", initials: "PB", allergenes: [], birthdate: "05-25", nameDay: "06-29" },
        { id: 7, name: "Claire Leroy", position: "Développeuse Back-end", initials: "CL", allergenes: ["Sésame"], birthdate: "12-01", nameDay: "03-09" },
        { id: 8, name: "Nicolas Dupont", position: "Data Scientist", initials: "ND", allergenes: [], birthdate: "03-08", nameDay: "12-06" }
    ],
    currentIndex: 1,
    startDate: new Date('2025-01-31')
};