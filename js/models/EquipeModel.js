/**
 * @fileoverview Modèle de gestion des équipes
 * Centralise les données et opérations liées aux équipes
 */

/**
 * @typedef {Object} Participant
 * @property {string} nom - Nom du participant
 * @property {string[]} allergenes - Liste des allergènes du participant
 */

/**
 * @typedef {Object} Equipe
 * @property {Participant[]} participants - Liste des participants de l'équipe
 */

/**
 * Gère les données et opérations liées aux équipes
 * @constructor
 */
function EquipeModel() {
    /**
     * Registre des équipes disponibles
     * @type {Object.<string, Equipe>}
     * @private
     */
    this._equipes = {
        "equipe_oifp.js": equipeOIFP,
        "equipe_marketing.js": equipeMarketing,
        "equipe_pirate.js": equipePirate,
    };
    
    /**
     * Équipe actuellement sélectionnée
     * @type {string}
     * @private
     */
    this._equipeActuelle = StorageService.getSelectedTeam();
    
    /**
     * Récupère l'identifiant de l'équipe actuellement sélectionnée
     * @returns {string} Identifiant de l'équipe actuelle
     */
    this.getEquipeActuelle = function() {
        return this._equipeActuelle;
    };
    
    /**
     * Définit l'équipe actuellement sélectionnée
     * @param {string} equipeId - Identifiant de l'équipe
     * @returns {boolean} true si le changement a été effectué
     */
    this.setEquipeActuelle = function(equipeId) {
        if (!this._equipes[equipeId]) {
            console.error(`Équipe non trouvée : ${equipeId}`);
            return false;
        }
        
        this._equipeActuelle = equipeId;
        StorageService.setSelectedTeam(equipeId);
        return true;
    };
    
    /**
     * Récupère la liste des équipes disponibles
     * @returns {Object.<string, string>} Mapping clé-nom des équipes
     */
    this.getEquipesDisponibles = function() {
        const result = {};
        
        for (const [id, equipe] of Object.entries(this._equipes)) {
            // Extrait le nom de l'équipe à partir de l'identifiant
            const nomEquipe = id.replace("equipe_", "").replace(".js", "");
            result[id] = `Équipe ${nomEquipe.charAt(0).toUpperCase() + nomEquipe.slice(1)}`;
        }
        
        return result;
    };
    
    /**
     * Récupère les participants d'une équipe spécifique
     * @param {string} [equipeId] - Identifiant de l'équipe (utilise l'équipe actuelle si non spécifié)
     * @returns {Participant[]} Liste des participants
     */
    this.getParticipants = function(equipeId) {
        const idEquipe = equipeId || this._equipeActuelle;
        const equipe = this._equipes[idEquipe];
        
        if (!equipe) {
            console.error(`Équipe non trouvée : ${idEquipe}`);
            return [];
        }
        
        return equipe.participants;
    };
    
    /**
     * Récupère tous les allergènes uniques d'une équipe
     * @param {string} [equipeId] - Identifiant de l'équipe (utilise l'équipe actuelle si non spécifié)
     * @returns {Set<string>} Ensemble des allergènes uniques
     */
    this.getAllergenes = function(equipeId) {
        const participants = this.getParticipants(equipeId || this._equipeActuelle);
        const allergenes = new Set();
        
        participants.forEach(participant => {
            participant.allergenes.forEach(allergene => {
                allergenes.add(allergene);
            });
        });
        
        return allergenes;
    };
}