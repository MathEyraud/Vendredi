/**
 * @fileoverview Point d'entrée principal de l'application
 * Initialise l'application et gère les interactions utilisateur principales
 */

/**
 * Initialise l'application une fois le DOM chargé
 * - Charge l'équipe par défaut
 * - Met en place les écouteurs d'événements pour le changement d'équipe
 * @throws {Error} Si les éléments du DOM requis ne sont pas trouvés
 */
document.addEventListener("DOMContentLoaded", function initApplication() {
    /**
     * Élément du bouton affichant l'équipe sélectionnée
     * @type {HTMLElement}
     */
    const selectedTeam = document.getElementById("selectedTeam");
    if (!selectedTeam) {
        throw new Error("Element 'selectedTeam' non trouvé dans le DOM");
    }

    /**
     * Élément contenant la liste des équipes disponibles
     * @type {HTMLElement}
     */
    const teamList = document.getElementById("teamList");
    if (!teamList) {
        throw new Error("Element 'teamList' non trouvé dans le DOM");
    }

    /**
     * Gère le changement d'équipe sélectionnée
     * @param {Event} event - L'événement de clic
     */
    function handleTeamSelection(event) {

        // Vérifie si le clic est sur un lien d'équipe
        if (event.target.tagName === "A") {
            
            // Empêche le comportement par défaut du lien
            event.preventDefault();
            
            // Met à jour le texte du bouton avec le nom de l'équipe
            selectedTeam.textContent = event.target.textContent;
            
            // Récupère et charge la nouvelle équipe
            const equipeId = event.target.getAttribute("data-value");
            const participants = chargerEquipe(equipeId);
            
            // Met à jour l'affichage
            afficherEquipe(participants);
        }
    }

    // Initialisation : charge et affiche l'équipe par défaut
    const equipeParDefaut = "equipe_oifp.js";
    const participantsInitiaux = chargerEquipe(equipeParDefaut);
    afficherEquipe(participantsInitiaux);

    // Met en place l'écouteur pour le changement d'équipe
    teamList.addEventListener("click", handleTeamSelection);

    // Dans la fonction d'initialisation
    const countdown = new CountdownTimer();
});