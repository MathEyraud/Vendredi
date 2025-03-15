/**
 * @fileoverview Panneau de contrôle pour le mode test
 * Permet de simuler différentes dates pour les tests
 */

/**
 * @class TestPanel
 * Interface utilisateur pour contrôler le mode test de date
 */
class TestPanel {
    /**
     * Crée une instance du panneau de test
     * @constructor
     */
    constructor() {
        /**
         * Élément DOM du panneau de test
         * @type {HTMLElement|null}
         * @private
         */
        this._panelElement = null;
        
        /**
         * Indique si le panneau est actuellement affiché
         * @type {boolean}
         * @private
         */
        this._isVisible = false;
        
        /**
         * Code secret pour activer le panneau de test
         * @type {string}
         * @private
         */
        this._secretCode = '2301';
        
        /**
         * Séquence de touches actuellement saisie
         * @type {string}
         * @private
         */
        this._currentSequence = '';
        
        // Initialise le panneau
        this._initialize();
    }
    
    /**
     * Initialise le panneau de test
     * @private
     */
    _initialize() {
        // Initialise DateService
        DateService.init();
        
        // Crée le panneau mais ne l'affiche pas encore
        this._createPanel();
        
        // Ajoute l'écouteur pour le code secret
        this._setupSecretCodeListener();
        
        // Vérifie si le mode test était déjà activé
        if (DateService.isTestModeEnabled()) {
            this.showPanel();
            this._updateTestModeStatus();
        }
    }
    
    /**
     * Crée le panneau de test mais ne l'affiche pas
     * @private
     */
    _createPanel() {
        // Crée l'élément du panneau
        this._panelElement = document.createElement('div');
        this._panelElement.className = 'test-panel';
        this._panelElement.style.display = 'none';
        
        // Styles CSS inline pour le panneau
        this._panelElement.style.position = 'fixed';
        this._panelElement.style.bottom = '10px';
        this._panelElement.style.right = '10px';
        this._panelElement.style.backgroundColor = 'rgba(255, 128, 0, 0.9)';
        this._panelElement.style.padding = '15px';
        this._panelElement.style.borderRadius = '8px';
        this._panelElement.style.color = 'white';
        this._panelElement.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        this._panelElement.style.zIndex = '1000';
        this._panelElement.style.maxWidth = '320px';
        
        // Contenu HTML
        this._panelElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: white;">Mode Test</h3>
                <button id="closeTestPanel" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px;">×</button>
            </div>
            
            <div id="testModeStatus" style="margin-bottom: 15px; padding: 5px; background-color: rgba(0, 0, 0, 0.2); border-radius: 4px;">
                Mode test: désactivé
            </div>
            
            <div style="margin-bottom: 10px;">
                <label for="testDate" style="display: block; margin-bottom: 5px;">Date de test:</label>
                <input type="date" id="testDate" style="width: 100%; padding: 5px; margin-bottom: 10px;" />
                <button id="setTestDate" style="padding: 5px 10px; background-color: #2BBBD4; border: none; color: white; border-radius: 4px; cursor: pointer; margin-right: 5px;">Définir</button>
                <button id="disableTestMode" style="padding: 5px 10px; background-color: #E63250; border: none; color: white; border-radius: 4px; cursor: pointer;">Désactiver</button>
            </div>
            
            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 5px;">Ajuster la date:</label>
                <div style="display: flex; gap: 5px;">
                    <button id="minusWeek" style="flex: 1; padding: 5px; background-color: #0E2C49; border: none; color: white; border-radius: 4px; cursor: pointer;">-1 sem</button>
                    <button id="minusDay" style="flex: 1; padding: 5px; background-color: #0E2C49; border: none; color: white; border-radius: 4px; cursor: pointer;">-1 jour</button>
                    <button id="plusDay" style="flex: 1; padding: 5px; background-color: #0E2C49; border: none; color: white; border-radius: 4px; cursor: pointer;">+1 jour</button>
                    <button id="plusWeek" style="flex: 1; padding: 5px; background-color: #0E2C49; border: none; color: white; border-radius: 4px; cursor: pointer;">+1 sem</button>
                </div>
            </div>
            
            <div style="margin-top: 15px;">
                <label style="display: block; margin-bottom: 5px;">Dates spéciales:</label>
                <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                    <button id="setToFriday" style="margin-bottom: 5px; padding: 5px; background-color: #164194; border: none; color: white; border-radius: 4px; cursor: pointer;">Vendredi</button>
                    <button id="setToYesterday" style="margin-bottom: 5px; padding: 5px; background-color: #164194; border: none; color: white; border-radius: 4px; cursor: pointer;">Hier</button>
                    <button id="setToToday" style="margin-bottom: 5px; padding: 5px; background-color: #164194; border: none; color: white; border-radius: 4px; cursor: pointer;">Aujourd'hui</button>
                    <button id="setToTomorrow" style="margin-bottom: 5px; padding: 5px; background-color: #164194; border: none; color: white; border-radius: 4px; cursor: pointer;">Demain</button>
                </div>
            </div>
            
            <div style="margin-top: 15px; font-size: 0.8em; color: rgba(255, 255, 255, 0.7);">
                Ce mode est réservé aux tests et n'affecte pas les données réelles.
            </div>
        `;
        
        // Ajoute le panneau au body
        document.body.appendChild(this._panelElement);
        
        // Configure les écouteurs d'événements
        this._setupEventListeners();
    }
    
    /**
     * Configure les écouteurs d'événements pour le panneau
     * @private
     */
    _setupEventListeners() {
        // Bouton fermer
        document.getElementById('closeTestPanel').addEventListener('click', () => {
            this.hidePanel();
        });
        
        // Bouton définir date
        document.getElementById('setTestDate').addEventListener('click', () => {
            const dateInput = document.getElementById('testDate');
            if (dateInput && dateInput.value) {
                DateService.enableTestMode(dateInput.value);
                this._updateTestModeStatus();
                this._refreshApplication();
            }
        });
        
        // Bouton désactiver
        document.getElementById('disableTestMode').addEventListener('click', () => {
            DateService.disableTestMode();
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        // Boutons d'ajustement
        document.getElementById('minusWeek').addEventListener('click', () => {
            DateService.advanceTestDateByDays(-7);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('minusDay').addEventListener('click', () => {
            DateService.advanceTestDateByDays(-1);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('plusDay').addEventListener('click', () => {
            DateService.advanceTestDateByDays(1);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('plusWeek').addEventListener('click', () => {
            DateService.advanceTestDateByDays(7);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        // Nouveaux boutons de dates spéciales
        document.getElementById('setToFriday').addEventListener('click', () => {
            // Déterminer la date du vendredi (actuel ou prochain)
            const currentDate = new Date();
            const currentDay = currentDate.getDay(); // 0 pour dimanche, 5 pour vendredi
            const daysDiff = (currentDay <= 5) ? (5 - currentDay) : (5 - currentDay + 7);
            const friday = new Date(currentDate);
            friday.setDate(currentDate.getDate() + daysDiff);
            
            DateService.enableTestMode(friday);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('setToYesterday').addEventListener('click', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            DateService.enableTestMode(yesterday);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('setToToday').addEventListener('click', () => {
            DateService.enableTestMode(new Date());
            this._updateTestModeStatus();
            this._refreshApplication();
        });
        
        document.getElementById('setToTomorrow').addEventListener('click', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            DateService.enableTestMode(tomorrow);
            this._updateTestModeStatus();
            this._refreshApplication();
        });
    }
    
    /**
     * Configure l'écouteur pour détecter le code secret
     * @private
     */
    _setupSecretCodeListener() {
        document.addEventListener('keydown', (event) => {
            // Ajoute la touche à la séquence
            this._currentSequence += event.key.toLowerCase();
            
            // Vérifie si la séquence contient le code
            if (this._currentSequence.includes(this._secretCode)) {
                this.togglePanel();
                this._currentSequence = '';
            }
            
            // Limite la taille de la séquence
            if (this._currentSequence.length > 20) {
                this._currentSequence = this._currentSequence.slice(-20);
            }
        });
    }
    
    /**
     * Met à jour l'affichage du statut du mode test
     * @private
     */
    _updateTestModeStatus() {
        const statusElement = document.getElementById('testModeStatus');
        const dateInput = document.getElementById('testDate');
        
        if (DateService.isTestModeEnabled()) {
            const currentDate = DateService.getCurrentDate();
            statusElement.innerHTML = `
                <strong>Mode test: activé</strong><br>
                Date simulée: ${DateService.formatDate(currentDate)}
            `;
            statusElement.style.backgroundColor = 'rgba(0, 158, 125, 0.3)';
            
            // Met à jour le champ de date
            if (dateInput) {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                dateInput.value = `${year}-${month}-${day}`;
            }
        } else {
            statusElement.innerHTML = `
                <strong>Mode test: désactivé</strong><br>
                Utilisation de la date réelle
            `;
            statusElement.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
            
            // Réinitialise le champ de date à la date du jour
            if (dateInput) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                dateInput.value = `${year}-${month}-${day}`;
            }
        }
    }
    
    /**
     * Affiche le panneau de test
     */
    showPanel() {
        if (this._panelElement) {
            this._panelElement.style.display = 'block';
            this._isVisible = true;
            this._updateTestModeStatus();
        }
    }
    
    /**
     * Cache le panneau de test
     */
    hidePanel() {
        if (this._panelElement) {
            this._panelElement.style.display = 'none';
            this._isVisible = false;
        }
    }
    
    /**
     * Bascule l'affichage du panneau de test
     */
    togglePanel() {
        if (this._isVisible) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    }
    
    /**
     * Rafraîchit l'application pour prendre en compte les changements de date
     * @private
     */
    _refreshApplication() {
        // Utilise la méthode d'actualisation exposée par AppController
        if (window.appController && typeof window.appController.updateDisplay === 'function') {
            window.appController.updateDisplay(true); // Force le recalcul complet
            console.log("Application actualisée avec la nouvelle date");
        } else {
            console.log("Actualisation automatique non disponible. Rechargez la page pour voir les changements.");
        }
    }
}