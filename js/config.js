/**
 * @fileoverview Fichier de configuration centrale de l'application
 * Contient les constantes globales et paramètres configurables
 */

/**
 * Configuration globale de l'application
 * @namespace APP_CONFIG
 */
const APP_CONFIG = {
    /**
     * Date de référence pour le début de la rotation (premier vendredi connu)
     * @type {Date}
     */
    DATE_DEPART: new Date(2025, 1, 7), // 7 février 2025 (février = 1)
    
    /**
     * Jour de la semaine pour le petit déjeuner (5 = vendredi)
     * @type {number}
     */
    JOUR_PETIT_DEJ: 5,
    
    /**
     * Heure à laquelle le petit déjeuner est servi (pour le compte à rebours)
     * @type {number}
     */
    HEURE_PETIT_DEJ: 10,
    
    /**
     * Identifiants des équipes disponibles
     * @type {Object.<string, string>}
     */
    EQUIPES: {
        OIFP: "equipe_oifp.js",
        MARKETING: "equipe_marketing.js",
        PIRATE: "equipe_pirate.js"
    },
    
    /**
     * Équipe par défaut à afficher au chargement
     * @type {string}
     */
    EQUIPE_PAR_DEFAUT: "equipe_oifp.js",
    
    /**
     * Clé utilisée pour stocker la préférence de thème dans localStorage
     * @type {string}
     */
    STORAGE_KEY_DARK_MODE: "darkMode",
    
    /**
     * Clé utilisée pour stocker l'équipe actuellement sélectionnée
     * @type {string}
     */
    STORAGE_KEY_EQUIPE: "equipeSelectionnee"
};