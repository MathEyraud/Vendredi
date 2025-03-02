/**
 * @fileoverview Utilitaires de manipulation des dates
 * Fournit des fonctions pour la gestion des dates et la rotation
 */

/**
 * @namespace DateUtils
 * Fonctions utilitaires pour la manipulation des dates
 */
const DateUtils = {
    /**
     * Obtient la date du prochain jour spécifique
     * @param {Date} [baseDate=new Date()] - Date de référence
     * @param {number} targetDay - Jour de la semaine cible (0=dimanche, 6=samedi)
     * @returns {Date} Date du prochain jour spécifique
     */
    getNextDay(baseDate = new Date(), targetDay) {
        const date = new Date(baseDate);
        const currentDay = date.getDay();
        
        // Si on est déjà le jour cible, on passe à la semaine suivante
        if (currentDay === targetDay) {
            date.setDate(date.getDate() + 7);
            return date;
        }
        
        // Calcule le nombre de jours jusqu'au prochain jour cible
        const daysToAdd = (targetDay - currentDay + 7) % 7;
        date.setDate(date.getDate() + daysToAdd);
        return date;
    },
    
    /**
     * Obtient la date du prochain vendredi
     * @param {Date} [baseDate=new Date()] - Date de référence
     * @returns {Date} Date du prochain vendredi
     */
    getNextFriday(baseDate = new Date()) {
        return this.getNextDay(baseDate, APP_CONFIG.JOUR_CROISSANTS);
    },
    
    /**
     * Obtient la date du vendredi de la semaine en cours
     * @param {Date} [baseDate=new Date()] - Date de référence
     * @returns {Date} Date du vendredi de cette semaine
     */
    getCurrentFriday(baseDate = new Date()) {
        const date = new Date(baseDate);
        const currentDay = date.getDay();
        
        // Si on est après vendredi, on passe à la semaine suivante
        if (currentDay > APP_CONFIG.JOUR_CROISSANTS) {
            return this.getNextFriday(date);
        }
        
        // Si on est avant ou le jour même du vendredi, on calcule la date du vendredi
        const daysToAdd = (APP_CONFIG.JOUR_CROISSANTS - currentDay);
        date.setDate(date.getDate() + daysToAdd);
        return date;
    },
    
    /**
     * Calcule le nombre de jours entre deux dates
     * @param {Date} startDate - Date de départ
     * @param {Date} endDate - Date d'arrivée
     * @returns {number} Nombre de jours entre les deux dates
     */
    getDaysBetween(startDate, endDate) {
        // Conversion en dates sans heures/minutes pour une comparaison juste
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
        
        // Calcul de la différence en millisecondes puis conversion en jours
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    /**
     * Calcule le nombre de jours restants jusqu'à une date
     * @param {Date} targetDate - Date cible
     * @returns {number} Nombre de jours restants
     */
    getDaysUntil(targetDate) {
        return this.getDaysBetween(new Date(), targetDate);
    },
    
    /**
     * Calcule le nombre de semaines entre deux dates
     * @param {Date} startDate - Date de départ
     * @param {Date} endDate - Date d'arrivée
     * @returns {number} Nombre de semaines écoulées
     */
    getWeeksBetween(startDate, endDate) {
        return Math.floor(this.getDaysBetween(startDate, endDate) / 7);
    },
    
    /**
     * Obtient la date d'un vendredi spécifique en ajoutant des semaines
     * @param {Date} baseDate - Date de référence
     * @param {number} weeksToAdd - Nombre de semaines à ajouter
     * @returns {Date} Date du vendredi après le nombre de semaines spécifié
     */
    getFridayDate(baseDate, weeksToAdd) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + (weeksToAdd * 7));
        return date;
    },
    
    /**
     * Formate une date en format français
     * @param {Date} date - Date à formater
     * @returns {string} Date formatée en français
     */
    formatDate(date) {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },
    
    /**
     * Vérifie si une date est aujourd'hui
     * @param {Date} date - Date à vérifier
     * @returns {boolean} true si la date est aujourd'hui
     */
    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
};