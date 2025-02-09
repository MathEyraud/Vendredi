class RotationManager {
    constructor(startDate) {
        this.startDate = new Date(startDate);
        this.startDate.setHours(0, 0, 0, 0);
    }

    /**
     * Trouve le prochain vendredi à partir d'une date donnée
     * @param {Date} date - Date de référence
     * @returns {Date} - Prochain vendredi
     */
    getNextFriday(date) {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const dayOfWeek = targetDate.getDay();
        const daysUntilFriday = dayOfWeek <= 5 ? 
            5 - dayOfWeek : 
            5 - dayOfWeek + 7;
        
        targetDate.setDate(targetDate.getDate() + daysUntilFriday);
        return targetDate;
    }

    /**
     * Calcule l'index de la personne responsable pour une date donnée
     * @param {Date} currentDate - Date pour laquelle on veut connaître le responsable
     * @param {number} teamSize - Taille de l'équipe
     * @returns {number} - Index dans l'équipe
     */
    getCurrentResponsibleIndex(currentDate, teamSize) {
        const targetFriday = this.getNextFriday(currentDate);
        const startFriday = this.getNextFriday(this.startDate);
        
        // Calculer le nombre de semaines entre la date de départ et la date cible
        const weeksDiff = Math.floor(
            (targetFriday - startFriday) / (7 * 24 * 60 * 60 * 1000)
        );
        
        // Utiliser le modulo pour obtenir l'index dans l'équipe
        return ((weeksDiff % teamSize) + teamSize) % teamSize;
    }

    /**
     * Génère le planning des prochaines rotations
     * @param {Array} team - Liste des membres de l'équipe
     * @param {Date} currentDate - Date de référence
     * @returns {Array} - Planning des rotations
     */
    generateSchedule(team, currentDate) {
        const schedule = [];
        const currentIndex = this.getCurrentResponsibleIndex(currentDate, team.length);
        const startFriday = this.getNextFriday(currentDate);

        // Générer le planning pour tous les membres de l'équipe
        for (let i = 0; i < team.length; i++) {
            const targetDate = new Date(startFriday);
            targetDate.setDate(targetDate.getDate() + (i * 7));
            
            const memberIndex = (currentIndex + i) % team.length;
            const daysUntil = Math.ceil(
                (targetDate - currentDate) / (1000 * 60 * 60 * 24)
            );

            schedule.push({
                date: targetDate,
                member: team[memberIndex],
                daysUntil: daysUntil
            });
        }

        return schedule;
    }

    /**
     * Vérifie si une date donnée est un vendredi
     * @param {Date} date - Date à vérifier
     * @returns {boolean}
     */
    isFriday(date) {
        return date.getDay() === 5;
    }
}

// Exportation de la classe
export default RotationManager;
