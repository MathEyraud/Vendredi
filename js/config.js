/**
 * @fileoverview Configuration centrale de l'application
 * Contient les paramètres globaux et chargement des équipes
 */

/**
 * Configuration globale de l'application
 * @namespace APP_CONFIG
 */
const APP_CONFIG = {
    /**
     * Jour de la semaine pour les croissants (5 = vendredi)
     * @type {number}
     */
    JOUR_CROISSANTS: 5,
    
    /**
     * Clé utilisée pour stocker les données dans localStorage
     * @type {string}
     */
    STORAGE_KEY: 'VendrediData',
    
    /**
     * Équipe par défaut à afficher au chargement
     * @type {string}
     */
    EQUIPE_PAR_DEFAUT: 'dev',
    
    /**
     * Nombre de membres à afficher dans la liste des prochains tours
     * @type {number}
     */
    NOMBRE_PROCHAINS_TOURS: 4,
    
    /**
     * Nombre d'entrées à afficher dans l'historique
     * @type {number}
     */
    NOMBRE_HISTORIQUE: 5,
    
    /**
     * Liste des identifiants d'équipes disponibles
     * @type {Array}
     */
    TEAM_IDS: ['dev', 'marketing', 'design', 'finance']
};

/**
 * Charge toutes les équipes disponibles dans un objet
 * @returns {Object} Objet contenant toutes les équipes
 */
function loadTeams() {
    const teams = {};
    
    try {
        // Vérifier et ajouter chaque équipe si elle existe dans le scope global
        if (typeof TEAM_DEV !== 'undefined') teams.dev = TEAM_DEV;
        if (typeof TEAM_MARKETING !== 'undefined') teams.marketing = TEAM_MARKETING;
        if (typeof TEAM_DESIGN !== 'undefined') teams.design = TEAM_DESIGN;
        if (typeof TEAM_FINANCE !== 'undefined') teams.finance = TEAM_FINANCE;
        
        // Vérifier si des équipes ont été chargées
        if (Object.keys(teams).length === 0) {
            console.error("Aucune équipe n'a pu être chargée. Vérifiez que les fichiers d'équipe sont correctement inclus dans index.html");
        }
    } catch (e) {
        console.error("Erreur lors du chargement des équipes:", e);
    }
    
    return teams;
}

/**
 * Données des services et de leurs membres
 * @type {Object}
 */
const SERVICES_DATA = loadTeams();