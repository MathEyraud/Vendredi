/**
 * @fileoverview Utilitaires de manipulation des dates
 * Fournit des fonctions pour la gestion des dates et jours de la semaine
 */

/**
 * @namespace DateUtils
 * Fonctions utilitaires pour la manipulation des dates
 */
const DateUtils = {
    /**
     * Trouve le prochain jour spécifique à partir d'une date
     * @param {Date} date - Date de référence
     * @param {number} jourCible - Jour de la semaine cible (0 = dimanche, 6 = samedi)
     * @returns {Date} Date du prochain jour spécifié
     */
    prochainJour(date, jourCible) {
        const result = new Date(date);
        const jourActuel = result.getDay();
        
        // Si on est déjà le jour cible, on retourne la date actuelle
        if (jourActuel === jourCible) {
            return result;
        }
        
        // Calcul du nombre de jours jusqu'au prochain jour cible
        const diff = (jourCible - jourActuel + 7) % 7;
        result.setDate(result.getDate() + diff);
        return result;
    },
    
    /**
     * Trouve le prochain vendredi à partir d'une date
     * Si la date est un vendredi, retourne cette même date
     * @param {Date} date - Date de référence
     * @returns {Date} Date du prochain vendredi
     */
    prochainVendredi(date) {
        const result = new Date(date);
        const jour = result.getDay();
        
        // Si on est déjà vendredi, on retourne la date telle quelle
        // Sinon, on calcule la date du prochain vendredi
        const diff = jour === 5 ? 0 : (5 - jour + 7) % 7;
        result.setDate(result.getDate() + diff);
        return result;
    },
    
    /**
     * Vérifie si une date correspond au jour cible de la semaine en cours
     * @param {Date} date - Date à vérifier
     * @param {number} jourCible - Jour de la semaine cible (0-6)
     * @returns {boolean} true si la date correspond au jour cible de cette semaine
     */
    estJourCourant(date, jourCible) {
        const aujourdHui = new Date();
        const jourCetteSemaine = this.prochainJour(aujourdHui, jourCible);
        
        return date.getDate() === jourCetteSemaine.getDate() &&
               date.getMonth() === jourCetteSemaine.getMonth() &&
               date.getFullYear() === jourCetteSemaine.getFullYear();
    },
    
    /**
     * Vérifie si une date correspond au vendredi de la semaine en cours
     * @param {Date} date - Date à vérifier
     * @returns {boolean} true si la date correspond au vendredi de cette semaine
     */
    estVendrediActuel(date) {
        return this.estJourCourant(date, APP_CONFIG.JOUR_PETIT_DEJ);
    },
    
    /**
     * Vérifie si aujourd'hui est le jour du petit déjeuner (vendredi)
     * @returns {boolean} true si c'est le jour du petit déjeuner
     */
    estJourPetitDej() {
        return new Date().getDay() === APP_CONFIG.JOUR_PETIT_DEJ;
    },
    
    /**
     * Calcule le nombre de semaines écoulées entre deux dates
     * @param {Date} dateDebut - Date de début
     * @param {Date} dateFin - Date de fin
     * @returns {number} Nombre de semaines écoulées (minimum 0)
     */
    calculerSemainesEcoulees(dateDebut, dateFin) {
        const vendrediCible = this.prochainVendredi(dateFin);
        
        // Calcul de la différence en millisecondes puis conversion en semaines
        const diffMs = vendrediCible.getTime() - dateDebut.getTime();
        return Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)));
    },
    
    /**
     * Calcule la différence en jours entre deux dates
     * @param {Date} dateDebut - Date de début
     * @param {Date} dateFin - Date de fin
     * @returns {number} Nombre de jours entre les deux dates
     */
    calculerJoursRestants(dateDebut, dateFin) {
        const diffMs = dateFin.getTime() - dateDebut.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    },
    
    /**
     * Formate une date au format local (jour/mois/année)
     * @param {Date} date - Date à formater
     * @returns {string} Date formatée
     */
    formaterDate(date) {
        return date.toLocaleDateString();
    }
};