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
        { id: 1, name: "Maxime Durand", position: "Directeur Artistique", initials: "MD", allergenes: [] },
        { id: 2, name: "Inès Robert", position: "Designer Produit", initials: "IR", allergenes: ["Gluten", "Lactose"] },
        { id: 3, name: "Théo Simon", position: "Illustrateur", initials: "TS", allergenes: [] },
        { id: 4, name: "Léa Roux", position: "UI Designer", initials: "LR", allergenes: ["Chocolat"] }
    ],
    currentIndex: 1,
    startDate: new Date('2025-03-07')
};