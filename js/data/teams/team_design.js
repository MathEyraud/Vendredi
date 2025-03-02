/**
 * @fileoverview Données de l'équipe design
 */

/**
 * Configuration de l'équipe design
 * @type {Object}
 */
const TEAM_DESIGN = {
    id: "design",
    name: "Équipe Design",
    members: [
        { id: 1, name: "Maxime Durand", position: "Directeur Artistique", initials: "MD", allergenes: [], birthdate: "07-14" },
        { id: 2, name: "Inès Robert", position: "Designer Produit", initials: "IR", allergenes: ["Gluten", "Lactose"], birthdate: "09-25" },
        { id: 3, name: "Théo Simon", position: "Illustrateur", initials: "TS", allergenes: [], birthdate: "06-18" },
        { id: 4, name: "Léa Roux", position: "UI Designer", initials: "LR", allergenes: ["Chocolat"], birthdate: "02-29" }
    ],
    currentIndex: 1,
    startDate: new Date('2025-03-07')
};