/**
 * @fileoverview Contrôleur de gestion des équipes
 * Gère les interactions liées aux équipes et à la rotation
 */

/**
 * Contrôle les interactions avec les équipes et affiche les données
 * @constructor
 * @param {EquipeModel} equipeModel - Modèle de gestion des équipes
 * @param {RotationModel} rotationModel - Modèle de gestion des rotations
 * @param {UIManager} uiManager - Gestionnaire d'interface utilisateur
 */
function EquipeController(equipeModel, rotationModel, uiManager) {
    /**
     * Modèle de gestion des équipes
     * @type {EquipeModel}
     * @private
     */
    this._equipeModel = equipeModel;
    
    /**
     * Modèle de gestion des rotations
     * @type {RotationModel}
     * @private
     */
    this._rotationModel = rotationModel;
    
    /**
     * Gestionnaire d'interface utilisateur
     * @type {UIManager}
     * @private
     */
    this._uiManager = uiManager;
    
    /**
     * Élément contenant la liste des équipes
     * @type {HTMLElement|null}
     * @private
     */
    this._teamListElement = document.getElementById("teamList");
    
    /**
     * Configure les écouteurs d'événements pour la sélection d'équipe
     * @private
     */
    this._setupEventListeners = function() {
        if (this._teamListElement) {
            this._teamListElement.addEventListener("click", (event) => this._handleTeamSelection(event));
        } else {
            console.error("Element 'teamList' non trouvé dans le DOM");
        }
    };
    
    /**
     * Gère la sélection d'une équipe
     * @param {Event} event - Événement de clic
     * @private
     */
    this._handleTeamSelection = function(event) {
        // Vérifie si le clic est sur un lien d'équipe
        if (event.target.tagName === "A") {
            // Empêche le comportement par défaut du lien
            event.preventDefault();
            
            // Récupère et charge la nouvelle équipe
            const equipeId = event.target.getAttribute("data-value");
            this.changeEquipe(equipeId, event.target.textContent);
        }
    };
    
    // Configure les écouteurs d'événements
    this._setupEventListeners();
    
    /**
     * Affiche les données de l'équipe sélectionnée
     * @param {string} [equipeId] - Identifiant de l'équipe (utilise l'équipe actuelle si non spécifié)
     */
    this.afficherEquipe = function(equipeId) {
        // Utilise l'équipe actuelle si non spécifiée
        const idEquipe = equipeId || this._equipeModel.getEquipeActuelle();
        
        // Récupère les participants de l'équipe
        const participants = this._equipeModel.getParticipants(idEquipe);
        
        // Récupère le responsable de la semaine en cours
        const responsableSemaine = this._rotationModel.getResponsableSemaine(participants);
        
        // Récupère les prochains responsables
        const prochainsResponsables = this._rotationModel.getProchainsTours(participants);
        
        // Récupère les allergènes de l'équipe
        const allergenes = this._equipeModel.getAllergenes(idEquipe);
        
        // Met à jour l'interface
        this._uiManager.updateResponsableName(
            responsableSemaine ? responsableSemaine.personne.nom : null
        );
        this._uiManager.updateAllergenes(allergenes);
        this._uiManager.updateScheduleTable(prochainsResponsables);
        
        // Met à jour l'équipe active dans le modèle si elle a changé
        if (equipeId && equipeId !== this._equipeModel.getEquipeActuelle()) {
            this._equipeModel.setEquipeActuelle(equipeId);
        }
    };
    
    /**
     * Change l'équipe sélectionnée
     * @param {string} equipeId - Identifiant de l'équipe
     * @param {string} nomEquipe - Nom de l'équipe à afficher
     */
    this.changeEquipe = function(equipeId, nomEquipe) {
        // Met à jour l'interface
        this._uiManager.updateSelectedTeam(nomEquipe);
        
        // Affiche les données de la nouvelle équipe
        this.afficherEquipe(equipeId);
    };
    
    /**
     * Initialise l'affichage de l'équipe par défaut
     */
    this.initialiserAffichage = function() {
        // Récupère l'identifiant et le nom de l'équipe actuelle
        const equipeId = this._equipeModel.getEquipeActuelle();
        const equipesDisponibles = this._equipeModel.getEquipesDisponibles();
        const nomEquipe = equipesDisponibles[equipeId] || "Équipe inconnue";
        
        // Met à jour l'interface
        this._uiManager.updateSelectedTeam(nomEquipe);
        
        // Affiche les données de l'équipe
        this.afficherEquipe(equipeId);
    };
}