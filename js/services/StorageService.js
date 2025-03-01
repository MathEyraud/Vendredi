/**
 * @fileoverview Service de gestion du stockage local
 * Fournit une API unifiée pour la persistance des données de l'application
 */

/**
 * @namespace StorageService
 * Service de gestion du stockage local
 */
const StorageService = {
    /**
     * Vérifie si le localStorage est disponible
     * @returns {boolean} true si le localStorage est disponible
     */
    isAvailable() {
        try {
            const test = "__test__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn("localStorage n'est pas disponible:", e);
            return false;
        }
    },
    
    /**
     * Récupère une valeur depuis le localStorage
     * @param {string} key - Clé de la valeur à récupérer
     * @param {*} [defaultValue=null] - Valeur par défaut si la clé n'existe pas
     * @returns {*} Valeur récupérée ou valeur par défaut
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable()) return defaultValue;
        
        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;
            
            // Tente de parser la valeur comme JSON
            try {
                return JSON.parse(item);
            } catch (e) {
                // Si ce n'est pas du JSON, retourne la chaîne telle quelle
                return item;
            }
        } catch (e) {
            console.error(`Erreur lors de la récupération de ${key}:`, e);
            return defaultValue;
        }
    },
    
    /**
     * Enregistre une valeur dans le localStorage
     * @param {string} key - Clé sous laquelle stocker la valeur
     * @param {*} value - Valeur à stocker (sera convertie en JSON si nécessaire)
     * @returns {boolean} true si le stockage a réussi
     */
    set(key, value) {
        if (!this.isAvailable()) return false;
        
        try {
            // Convertit les objets et tableaux en JSON
            const valueToStore = typeof value === 'object' 
                ? JSON.stringify(value) 
                : String(value);
                
            localStorage.setItem(key, valueToStore);
            return true;
        } catch (e) {
            console.error(`Erreur lors de l'enregistrement de ${key}:`, e);
            return false;
        }
    },
    
    /**
     * Supprime une valeur du localStorage
     * @param {string} key - Clé de la valeur à supprimer
     * @returns {boolean} true si la suppression a réussi
     */
    remove(key) {
        if (!this.isAvailable()) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`Erreur lors de la suppression de ${key}:`, e);
            return false;
        }
    },
    
    /**
     * Récupère l'état du mode sombre
     * @returns {boolean} true si le mode sombre est activé
     */
    getDarkModeState() {
        return this.get(APP_CONFIG.STORAGE_KEY_DARK_MODE, false);
    },
    
    /**
     * Enregistre l'état du mode sombre
     * @param {boolean} isDarkMode - État du mode sombre
     * @returns {boolean} true si l'enregistrement a réussi
     */
    setDarkModeState(isDarkMode) {
        return this.set(APP_CONFIG.STORAGE_KEY_DARK_MODE, isDarkMode);
    },
    
    /**
     * Récupère l'identifiant de l'équipe sélectionnée
     * @returns {string} Identifiant de l'équipe sélectionnée ou équipe par défaut
     */
    getSelectedTeam() {
        return this.get(APP_CONFIG.STORAGE_KEY_EQUIPE, APP_CONFIG.EQUIPE_PAR_DEFAUT);
    },
    
    /**
     * Enregistre l'identifiant de l'équipe sélectionnée
     * @param {string} teamId - Identifiant de l'équipe sélectionnée
     * @returns {boolean} true si l'enregistrement a réussi
     */
    setSelectedTeam(teamId) {
        return this.set(APP_CONFIG.STORAGE_KEY_EQUIPE, teamId);
    }
};