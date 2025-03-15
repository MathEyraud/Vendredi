/**
 * @fileoverview Service de gestion des dates pour l'application
 * Permet de simuler des dates spécifiques pour les tests
 */

/**
 * @namespace DateService
 * Service qui centralise l'accès à la date du jour
 * et permet de la simuler pour les tests
 */
const DateService = {
    /**
     * Date simulée pour les tests (null si utilisation de la date réelle)
     * @type {Date|null}
     * @private
     */
    _mockedDate: null,
    
    /**
     * Indique si le mode test est activé
     * @type {boolean}
     * @private
     */
    _testModeEnabled: false,
    
    /**
     * Clé localStorage pour sauvegarder l'état du mode test
     * @type {string}
     * @private
     */
    _storageKey: 'VendrediTestMode',
    
    /**
     * Initialise le service de date
     * Vérifie si un mode test était précédemment activé
     */
    init() {
        try {
            const savedTestMode = localStorage.getItem(this._storageKey);
            if (savedTestMode) {
                const testData = JSON.parse(savedTestMode);
                if (testData.enabled) {
                    this._testModeEnabled = true;
                    this._mockedDate = testData.date ? new Date(testData.date) : null;
                    console.log("Mode test restauré:", this.formatDate(this.getCurrentDate()));
                }
            }
        } catch (e) {
            console.error("Erreur lors de l'initialisation du DateService:", e);
            this.disableTestMode();
        }
    },
    
    /**
     * Obtient la date courante (réelle ou simulée)
     * @returns {Date} Date actuelle ou simulée
     */
    getCurrentDate() {
        if (this._testModeEnabled && this._mockedDate) {
            return new Date(this._mockedDate);
        }
        return new Date();
    },
    
    /**
     * Active le mode test avec une date spécifique
     * @param {Date|string} date - Date à simuler
     * @returns {boolean} true si l'activation a réussi
     */
    enableTestMode(date) {
        try {
            const testDate = date instanceof Date ? date : new Date(date);
            
            // Vérifie que la date est valide
            if (isNaN(testDate.getTime())) {
                console.error("Date de test invalide");
                return false;
            }
            
            this._testModeEnabled = true;
            this._mockedDate = testDate;
            
            // Sauvegarde l'état du mode test
            this._saveTestModeState();
            
            console.log("Mode test activé avec la date:", this.formatDate(testDate));
            return true;
        } catch (e) {
            console.error("Erreur lors de l'activation du mode test:", e);
            return false;
        }
    },
    
    /**
     * Désactive le mode test et revient à la date réelle
     * @returns {boolean} true si la désactivation a réussi
     */
    disableTestMode() {
        try {
            this._testModeEnabled = false;
            this._mockedDate = null;
            
            // Supprime l'état du mode test
            localStorage.removeItem(this._storageKey);
            
            console.log("Mode test désactivé, utilisation de la date réelle");
            return true;
        } catch (e) {
            console.error("Erreur lors de la désactivation du mode test:", e);
            return false;
        }
    },
    
    /**
     * Vérifie si le mode test est activé
     * @returns {boolean} true si le mode test est activé
     */
    isTestModeEnabled() {
        return this._testModeEnabled;
    },
    
    /**
     * Avance la date simulée d'un nombre spécifique de jours
     * @param {number} days - Nombre de jours à ajouter (peut être négatif)
     * @returns {boolean} true si l'opération a réussi
     */
    advanceTestDateByDays(days) {
        if (!this._testModeEnabled || !this._mockedDate) {
            console.error("Le mode test n'est pas activé");
            return false;
        }
        
        try {
            const newDate = new Date(this._mockedDate);
            newDate.setDate(newDate.getDate() + days);
            this._mockedDate = newDate;
            
            // Sauvegarde l'état mis à jour
            this._saveTestModeState();
            
            console.log("Date de test avancée à:", this.formatDate(newDate));
            return true;
        } catch (e) {
            console.error("Erreur lors de l'avancement de la date de test:", e);
            return false;
        }
    },
    
    /**
     * Sauvegarde l'état du mode test dans localStorage
     * @private
     */
    _saveTestModeState() {
        try {
            const testState = {
                enabled: this._testModeEnabled,
                date: this._mockedDate ? this._mockedDate.toISOString() : null
            };
            localStorage.setItem(this._storageKey, JSON.stringify(testState));
        } catch (e) {
            console.error("Erreur lors de la sauvegarde de l'état du mode test:", e);
        }
    },
    
    /**
     * Formate une date en format français lisible
     * @param {Date} date - Date à formater
     * @returns {string} Date formatée
     */
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        });
    },
    
    /**
     * Vérifie si une date est aujourd'hui
     * @param {Date} date - Date à vérifier
     * @returns {boolean} true si la date est aujourd'hui
     */
    isToday(date) {
        const today = this.getCurrentDate();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    },

    /**
     * Vérifie si un mois et un jour correspondent à aujourd'hui
     * @param {number} month - Mois (0-11)
     * @param {number} day - Jour
     * @returns {boolean} true si la date correspond à aujourd'hui
     */
    isMonthDayToday(month, day) {
        const today = this.getCurrentDate();
        return today.getMonth() === month && today.getDate() === day;
    }
};