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
     * @param {Date} [baseDate=DateService.getCurrentDate()] - Date de référence
     * @param {number} targetDay - Jour de la semaine cible (0=dimanche, 6=samedi)
     * @returns {Date} Date du prochain jour spécifique
     */
    getNextDay(baseDate = DateService.getCurrentDate(), targetDay) {
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
     * @param {Date} [baseDate=DateService.getCurrentDate()] - Date de référence
     * @returns {Date} Date du prochain vendredi
     */
    getNextFriday(baseDate = DateService.getCurrentDate()) {
        return this.getNextDay(baseDate, APP_CONFIG.JOUR_CROISSANTS);
    },
    
    /**
     * Obtient la date du vendredi de la semaine en cours
     * @param {Date} [baseDate=DateService.getCurrentDate()] - Date de référence
     * @returns {Date} Date du vendredi de cette semaine
     */
    getCurrentFriday(baseDate = DateService.getCurrentDate()) {
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
        return this.getDaysBetween(DateService.getCurrentDate(), targetDate);
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
        const today = DateService.getCurrentDate();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    },

    /**
     * Calcule les jours restants jusqu'à la prochaine occurrence d'un anniversaire
     * @param {string} birthdate - Date d'anniversaire au format "MM-DD"
     * @returns {number} Nombre de jours jusqu'au prochain anniversaire
     */
    getNextBirthdayDays(birthdate) {
        if (!birthdate) return null;
        
        const today = DateService.getCurrentDate();
        const currentYear = today.getFullYear();
        
        // Extraction du mois et du jour
        const [month, day] = birthdate.split('-').map(num => parseInt(num, 10));
        
        // Date de l'anniversaire cette année
        let birthdayThisYear = new Date(currentYear, month - 1, day);
        
        // Si l'anniversaire est déjà passé cette année, on calcule pour l'année prochaine
        if (birthdayThisYear < today) {
            birthdayThisYear = new Date(currentYear + 1, month - 1, day);
        }
        
        // Si c'est aujourd'hui, on retourne 0
        if (this.isDateToday(month - 1, day)) {
            return 0;
        }
        
        return this.getDaysBetween(today, birthdayThisYear);
    },

    /**
     * Vérifie si une date (mois, jour) correspond à aujourd'hui
     * @param {number} month - Mois (0-11)
     * @param {number} day - Jour du mois
     * @returns {boolean} true si la date correspond à aujourd'hui
     */
    isDateToday(month, day) {
        const today = DateService.getCurrentDate();
        return today.getMonth() === month && today.getDate() === day;
    },

    /**
     * Formate une date d'anniversaire pour l'affichage
     * @param {string} birthdate - Date d'anniversaire au format "MM-DD"
     * @returns {string} Date formatée (ex: "15 avril")
     */
    formatBirthdate(birthdate) {
        if (!birthdate) return '';
        
        const [month, day] = birthdate.split('-').map(num => parseInt(num, 10));
        
        // Création d'une date temporaire pour le formatage
        const tempDate = new Date(2000, month - 1, day);
        
        return tempDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long'
        });
    },

    /**
     * Calcule les jours restants jusqu'à la prochaine occurrence d'une fête de prénom
     * @param {string} nameDay - Date de la fête du prénom au format "MM-DD"
     * @returns {number} Nombre de jours jusqu'à la prochaine fête
     */
    getNextNameDayDays(nameDay) {
        if (!nameDay) return null;
        
        const today = DateService.getCurrentDate();
        const currentYear = today.getFullYear();
        
        // Extraction du mois et du jour
        const [month, day] = nameDay.split('-').map(num => parseInt(num, 10));
        
        // Date de la fête cette année
        let nameDayThisYear = new Date(currentYear, month - 1, day);
        
        // Si la fête est déjà passée cette année, on calcule pour l'année prochaine
        if (nameDayThisYear < today) {
            nameDayThisYear = new Date(currentYear + 1, month - 1, day);
        }
        
        // Si c'est aujourd'hui, on retourne 0
        if (this.isDateToday(month - 1, day)) {
            return 0;
        }
        
        return this.getDaysBetween(today, nameDayThisYear);
    },

    /**
     * Formate une date de fête de prénom pour l'affichage
     * @param {string} nameDay - Date de la fête au format "MM-DD"
     * @returns {string} Date formatée (ex: "15 avril")
     */
    formatNameDay(nameDay) {
        if (!nameDay) return '';
        
        const [month, day] = nameDay.split('-').map(num => parseInt(num, 10));
        
        // Création d'une date temporaire pour le formatage
        const tempDate = new Date(2000, month - 1, day);
        
        return tempDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long'
        });
    },

    /**
     * Vérifie si deux dates correspondent au même jour
     * @param {Date} date1 - Première date
     * @param {Date} date2 - Deuxième date
     * @returns {boolean} true si les dates sont le même jour
     */
    isDateSame(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }
};