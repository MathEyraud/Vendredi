/**
 * @fileoverview Service de gestion du stockage localStorage
 * Fournit une API unifiée pour la persistance des données
 */

/**
 * @namespace StorageService
 * Service pour gérer le stockage local des données
 */
const StorageService = {
    /**
     * Vérifie si le localStorage est disponible
     * @returns {boolean} true si localStorage est disponible
     */
    isAvailable() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('LocalStorage n\'est pas disponible:', e);
            return false;
        }
    },
    
    /**
     * Réinitialise les données avec les valeurs actuelles des fichiers d'équipe
     * @returns {boolean} true si la réinitialisation a réussi
     */
    resetStorage() {
        console.log("Réinitialisation du localStorage avec les données fraîches des fichiers d'équipe");
        
        // Suppression des données existantes
        if (this.isAvailable()) {
            localStorage.removeItem(APP_CONFIG.STORAGE_KEY);
            console.log("Données localStorage supprimées");
        }
        
        // Sauvegarde des données fraîches
        return this.saveData(loadTeams());
    },
    
    /**
     * Récupère les données du localStorage
     * @param {boolean} [forceReset=false] - Force la réinitialisation du stockage
     * @returns {Object} Données stockées ou données par défaut
     */
    getData(forceReset = false) {
        // Si forceReset est à true, réinitialiser le stockage
        if (forceReset) {
            this.resetStorage();
        }
        
        if (!this.isAvailable()) {
            console.warn("LocalStorage n'est pas disponible, utilisation des données par défaut");
            return SERVICES_DATA || {};
        }
        
        try {
            const data = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
            if (!data) {
                console.log("Aucune donnée trouvée dans localStorage, initialisation avec les données par défaut");
                this.saveData(SERVICES_DATA);
                return SERVICES_DATA || {};
            }
            
            const parsedData = JSON.parse(data);
            
            // Vérifier que les données sont valides
            if (!parsedData || typeof parsedData !== 'object' || Object.keys(parsedData).length === 0) {
                console.warn("Données invalides dans localStorage, utilisation des données par défaut");
                this.saveData(SERVICES_DATA);
                return SERVICES_DATA || {};
            }
            
            return parsedData;
        } catch (e) {
            console.error('Erreur lors de la récupération des données:', e);
            return SERVICES_DATA || {};
        }
    },
    
    /**
     * Sauvegarde les données dans localStorage
     * @param {Object} data - Données à sauvegarder
     * @returns {boolean} true si la sauvegarde a réussi
     */
    saveData(data) {
        if (!this.isAvailable()) {
            return false;
        }
        
        try {
            localStorage.setItem(APP_CONFIG.STORAGE_KEY, JSON.stringify(data));
            console.log("Données sauvegardées dans localStorage");
            return true;
        } catch (e) {
            console.error('Erreur lors de la sauvegarde des données:', e);
            return false;
        }
    },
    
    /**
     * Initialise les données de stockage si nécessaire
     * @param {boolean} [forceReset=false] - Force la réinitialisation du stockage
     */
    initStorage(forceReset = false) {
        if (!this.isAvailable()) {
            return;
        }
        
        // Si forceReset est activé ou les données n'existent pas, initialiser avec les données par défaut
        if (forceReset || !localStorage.getItem(APP_CONFIG.STORAGE_KEY)) {
            // Vérifier la structure des données
            const freshData = loadTeams();
            
            // Vérifier un membre au hasard pour voir si la propriété allergenes existe
            const teams = Object.values(freshData);
            if (teams.length > 0 && teams[0].members && teams[0].members.length > 0) {
                const firstMember = teams[0].members[0];
                console.log("Vérification d'un membre:", firstMember);
                
                if (!firstMember.allergenes) {
                    console.error("ATTENTION: La propriété 'allergenes' est manquante dans les fichiers d'équipe!");
                }
            }
            
            // Initialise avec les données par défaut
            this.saveData(freshData);
        }
    },
    
    /**
     * Récupère l'identifiant du service actuellement sélectionné
     * @returns {string} Identifiant du service
     */
    getSelectedService() {
        if (!this.isAvailable()) {
            return APP_CONFIG.EQUIPE_PAR_DEFAUT;
        }
        
        try {
            return localStorage.getItem('selectedService') || APP_CONFIG.EQUIPE_PAR_DEFAUT;
        } catch (e) {
            return APP_CONFIG.EQUIPE_PAR_DEFAUT;
        }
    },
    
    /**
     * Sauvegarde l'identifiant du service sélectionné
     * @param {string} serviceId - Identifiant du service
     * @returns {boolean} true si la sauvegarde a réussi
     */
    setSelectedService(serviceId) {
        if (!this.isAvailable()) {
            return false;
        }
        
        try {
            localStorage.setItem('selectedService', serviceId);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    /**
     * Met à jour l'index actuel pour un service spécifique
     * @param {string} serviceId - Identifiant du service
     * @param {number} index - Nouvel index
     * @returns {boolean} true si la mise à jour a réussi
     */
    updateServiceIndex(serviceId, index) {
        const data = this.getData();
        if (!data[serviceId]) {
            return false;
        }
        
        data[serviceId].currentIndex = index;
        return this.saveData(data);
    }
};