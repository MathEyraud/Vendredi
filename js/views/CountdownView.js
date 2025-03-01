/**
 * @fileoverview Vue du compte à rebours
 * Gère l'affichage et la mise à jour du compte à rebours jusqu'au prochain petit déjeuner
 */

/**
 * Gère l'affichage du compte à rebours
 * @constructor
 */
function CountdownView() {
    /**
     * Élément DOM du compte à rebours
     * @type {HTMLElement}
     * @private
     */
    this._element = document.createElement('div');
    this._element.className = 'countdown';
    this._element.innerHTML = `
        <div class="countdown-container">
            <div class="countdown-value"></div>
        </div>
    `;
    
    /**
     * Intervalle de mise à jour
     * @type {number|null}
     * @private
     */
    this._interval = null;
    
    /**
     * Injecte l'élément du compte à rebours dans le DOM
     * @private
     */
    this._injectCountdown = function() {
        const nomResponsable = document.getElementById('nomResponsable');
        if (nomResponsable && nomResponsable.parentNode) {
            nomResponsable.parentNode.insertAdjacentElement('afterend', this._element);
        } else {
            console.error("Element 'nomResponsable' non trouvé, impossible d'injecter le compte à rebours");
        }
    };
    
    /**
     * Calcule le temps restant jusqu'au prochain petit déjeuner
     * @returns {Object} Temps restant décomposé en jours, heures, minutes, secondes
     * @private
     */
    this._calculateTimeLeft = function() {
        const now = new Date();
        const targetDay = APP_CONFIG.JOUR_PETIT_DEJ; // Jour cible (0 = dimanche, 5 = vendredi)
        const targetHour = APP_CONFIG.HEURE_PETIT_DEJ; // Heure cible
        
        // Si on est le jour cible après l'heure cible, on retourne zéro pour tout
        if (now.getDay() === targetDay && now.getHours() >= targetHour) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        
        // Calcul du prochain jour cible
        const targetDate = DateUtils.prochainJour(now, targetDay);
        targetDate.setHours(targetHour, 0, 0, 0);
        
        // Si on est le jour cible après l'heure cible, on passe à la semaine suivante
        if (now.getDay() === targetDay && now.getHours() >= targetHour) {
            targetDate.setDate(targetDate.getDate() + 7);
        }
        
        const difference = targetDate - now;
        
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    };
    
    /**
     * Formate le temps restant en texte lisible
     * @param {Object} time - Objet contenant les jours, heures, minutes, secondes
     * @returns {string} Texte formaté
     * @private
     */
    this._formatTimeLeft = function(time) {
        // Si tout est à zéro, on affiche un message spécial
        if (time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
            return "C'est aujourd'hui !";
        }
        
        if (time.days > 0) {
            return `${time.days}j ${time.hours}h ${time.minutes}m`;
        } else if (time.hours > 0) {
            return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
        } else {
            return `${time.minutes}m ${time.seconds}s`;
        }
    };
    
    // Injecte l'élément dans le DOM
    this._injectCountdown();
    
    /**
     * Met à jour l'affichage du compte à rebours
     */
    this.update = function() {
        const timeLeft = this._calculateTimeLeft();
        const formattedTime = this._formatTimeLeft(timeLeft);
        
        const countdownValue = this._element.querySelector('.countdown-value');
        if (countdownValue) {
            countdownValue.textContent = `[${formattedTime}]`;
        }
    };
    
    /**
     * Démarre le compte à rebours
     */
    this.start = function() {
        // Première mise à jour immédiate
        this.update();
        
        // Arrête l'intervalle s'il existe déjà
        this.stop();
        
        // Mise à jour toutes les secondes
        this._interval = setInterval(() => this.update(), 1000);
    };
    
    /**
     * Arrête le compte à rebours
     */
    this.stop = function() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    };
    
    // Démarre le compte à rebours
    this.start();
}