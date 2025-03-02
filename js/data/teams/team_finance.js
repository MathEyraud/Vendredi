/**
 * @fileoverview Données de l'équipe finance
 */

/**
 * Configuration de l'équipe finance
 * @type {Object}
 */
const TEAM_FINANCE = {
    id: "finance",
    name: "Équipe Finance",
    members: [
        { id: 1, name: "Julien Girard", position: "Contrôleur de gestion", initials: "JG", allergenes: [], birthdate: "" },
        { id: 2, name: "Sarah Legrand", position: "Comptable", initials: "SL", allergenes: ["Fruits rouges"], birthdate: "" },
        { id: 3, name: "Alexandre Morel", position: "Analyste financier", initials: "AM", allergenes: [], birthdate: "" },
        { id: 4, name: "Camille Blanc", position: "Trésorière", initials: "CB", allergenes: ["Noix"], birthdate: "" },
        { id: 5, name: "Victor Perrin", position: "Auditeur", initials: "VP", allergenes: ["Gluten"], birthdate: "" }
    ],
    currentIndex: 3,
    startDate: new Date('2025-03-07')
};