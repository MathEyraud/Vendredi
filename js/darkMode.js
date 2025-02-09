/**
 * @fileoverview Gestion du mode sombre (dark mode) de l'application
 * Permet de basculer entre le mode clair et sombre et persiste le choix de l'utilisateur
 */

/**
 * Element DOM représentant le switch de bascule du mode sombre
 * @type {HTMLInputElement}
 * @throws {Error} Si l'élément 'toggleDarkMode' n'est pas trouvé dans le DOM
 */
const darkModeToggle = document.getElementById("toggleDarkMode");
if (!darkModeToggle) {
    throw new Error("Element 'toggleDarkMode' non trouvé dans le DOM");
}

/**
 * Initialise l'état du mode sombre au chargement de la page
 * Vérifie la préférence stockée dans le localStorage et applique le mode correspondant
 */
function initDarkMode() {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }
}

/**
 * Gère le basculement du mode sombre
 * Met à jour l'interface et persiste le choix dans le localStorage
 * @param {Event} event - L'événement de changement du toggle
 */
function handleDarkModeToggle(event) {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
}

// Initialisation au chargement
initDarkMode();

// Écouteur d'événement pour le toggle
darkModeToggle.addEventListener("change", handleDarkModeToggle);