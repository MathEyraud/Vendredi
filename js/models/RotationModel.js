/**
 * @fileoverview Modèle de gestion de la rotation des participants
 * Gère la logique de calcul des tours et des dates de passage
 */

/**
 * @typedef {Object} ResponsableInfo
 * @property {Date} date - Date de passage du responsable
 * @property {Object} personne - Données du responsable
 * @property {number} joursRestants - Nombre de jours restants avant le passage
 * @property {boolean} estAujourdhui - Indique si c'est le jour du passage
 * @property {boolean} estCetteSemaine - Indique si c'est la semaine en cours
 */

/**
 * Gère la logique de rotation des responsables
 * @constructor
 * @param {Date} dateDepart - Date de départ pour le calcul de la rotation
 */
function RotationModel(dateDepart) {
    /**
     * Date de référence pour le début de la rotation
     * @type {Date}
     * @private
     */
    this._dateDepart = new Date(dateDepart);
    this._dateDepart.setHours(0, 0, 0, 0);
    
    /**
     * Calcule l'index du responsable actuel dans la liste des participants
     * @param {Array} participants - Liste des participants
     * @param {Date} [dateReference=new Date()] - Date de référence pour le calcul
     * @returns {number} Index du responsable dans la liste des participants
     */
    this.getIndexResponsableActuel = function(participants, dateReference = new Date()) {
        const semainesEcoulees = DateUtils.calculerSemainesEcoulees(
            this._dateDepart, 
            dateReference
        );
        
        return semainesEcoulees % participants.length;
    };
    
    /**
     * Obtient les informations sur le responsable actuel
     * @param {Array} participants - Liste des participants
     * @param {Date} [dateReference=new Date()] - Date de référence pour le calcul
     * @returns {ResponsableInfo|null} Informations sur le responsable actuel ou null
     */
    this.getResponsableActuel = function(participants, dateReference = new Date()) {
        if (!participants || participants.length === 0) {
            return null;
        }
        
        const indexResponsable = this.getIndexResponsableActuel(participants, dateReference);
        const personne = participants[indexResponsable];
        const vendrediActuel = DateUtils.prochainVendredi(dateReference);
        const joursRestants = DateUtils.calculerJoursRestants(dateReference, vendrediActuel);
        const estCetteSemaine = DateUtils.estVendrediActuel(vendrediActuel);
        const estAujourdhui = estCetteSemaine && DateUtils.estJourPetitDej();
        
        return {
            date: vendrediActuel,
            personne: personne,
            joursRestants: joursRestants,
            estAujourdhui: estAujourdhui,
            estCetteSemaine: estCetteSemaine
        };
    };
    
    /**
     * Génère la liste des prochains responsables
     * @param {Array} participants - Liste des participants
     * @param {number} [nbSemaines=participants.length] - Nombre de semaines à générer
     * @param {Date} [dateReference=new Date()] - Date de référence pour le calcul
     * @returns {Array<ResponsableInfo>} Liste des prochains responsables
     */
    this.getProchainsTours = function(participants, nbSemaines = participants.length, dateReference = new Date()) {
        if (!participants || participants.length === 0) {
            return [];
        }
        
        const indexResponsable = this.getIndexResponsableActuel(participants, dateReference);
        const vendrediActuel = DateUtils.prochainVendredi(dateReference);
        const result = [];
        
        for (let i = 0; i < nbSemaines; i++) {
            const prochaineDate = new Date(vendrediActuel);
            prochaineDate.setDate(prochaineDate.getDate() + (i * 7));
            
            const indexPersonne = (indexResponsable + i) % participants.length;
            const personne = participants[indexPersonne];
            const joursRestants = DateUtils.calculerJoursRestants(dateReference, prochaineDate);
            const estCetteSemaine = DateUtils.estVendrediActuel(prochaineDate);
            const estAujourdhui = estCetteSemaine && DateUtils.estJourPetitDej();
            
            result.push({
                date: prochaineDate,
                personne: personne,
                joursRestants: joursRestants,
                estAujourdhui: estAujourdhui,
                estCetteSemaine: estCetteSemaine
            });
        }
        
        return result;
    };
    
    /**
     * Trouve le responsable de la semaine en cours
     * @param {Array} participants - Liste des participants
     * @param {Date} [dateReference=new Date()] - Date de référence pour le calcul
     * @returns {ResponsableInfo|null} Informations sur le responsable de la semaine
     */
    this.getResponsableSemaine = function(participants, dateReference = new Date()) {
        if (!participants || participants.length === 0) {
            return null;
        }
        
        const tours = this.getProchainsTours(participants, participants.length, dateReference);
        return tours.find(r => r.estCetteSemaine) || null;
    };
}