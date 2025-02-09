// countdown.js

/**
 * Gère l'affichage et la mise à jour du compte à rebours
 */
class CountdownTimer {

    constructor() {
        // Création de l'élément HTML
        this.element = document.createElement('div');
        this.element.className = 'countdown';
        this.element.innerHTML = `
            <div class="countdown-container">
                <div class="countdown-value"></div>
            </div>
        `;

        // Insertion après le nomResponsable
        const nomResponsable = document.getElementById('nomResponsable');
        nomResponsable.parentNode.insertAdjacentElement('afterend', this.element);

        // Démarrage du compte à rebours
        this.start();
    }

    /**
     * Calcule le temps restant jusqu'au prochain vendredi à hourOfTime
     * @returns {Object} Temps restant décomposé
     */
    calculateTimeLeft() {
        const now = new Date();
        const friday = new Date(now);
        const hourOfTime = 10; // Heure du pti dej

        // Si on est vendredi après hourOfTime, on retourne zéro pour tout
        if (now.getDay() === 5 && now.getHours() >= hourOfTime) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        
        // Calcul du prochain vendredi
        friday.setDate(friday.getDate() + (5 - friday.getDay() + 7) % 7);
        friday.setHours(hourOfTime, 0, 0, 0);

        // Si on est vendredi après hourOfTime, on passe au vendredi suivant
        if (now.getDay() === 5 && now.getHours() >= hourOfTime) {
            friday.setDate(friday.getDate() + 7);
        }

        const difference = friday - now;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }

    /**
     * Formate le temps restant en texte lisible
     * @param {Object} time Objet contenant les jours, heures, minutes, secondes
     * @returns {string} Texte formaté
     */
    formatTimeLeft(time) {
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
    }

    /**
     * Met à jour l'affichage du compte à rebours
     */
    update() {
        const timeLeft = this.calculateTimeLeft();
        const formattedTime = this.formatTimeLeft(timeLeft);
        
        const countdownValue = this.element.querySelector('.countdown-value');
        countdownValue.textContent = `[${formattedTime}]`;
    }

    /**
     * Démarre le compte à rebours
     */
    start() {
        // Première mise à jour immédiate
        this.update();

        // Mise à jour toutes les secondes
        this.interval = setInterval(() => this.update(), 1000);
    }

    /**
     * Arrête le compte à rebours
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}