/**
 * @fileoverview Gestionnaire du thème de l'application
 * Gère le basculement entre les thèmes clair et sombre
 */

/**
 * @class ThemeManager
 * Gère le thème de l'application (clair/sombre)
 */
class ThemeManager {
    /**
     * Crée une instance du gestionnaire de thème
     * @constructor
     */
    constructor() {
        /**
         * Clé utilisée pour stocker la préférence de thème dans localStorage
         * @type {string}
         * @private
         */
        this._storageKey = 'darkMode';
        
        /**
         * État actuel du mode sombre
         * @type {boolean}
         * @private
         */
        this._isDarkMode = false;
        
        /**
         * Élément DOM du bouton de bascule du thème
         * @type {HTMLElement|null}
         * @private
         */
        this._themeToggle = null;
        
        // Initialise le gestionnaire de thème
        this._initialize();
    }
    
    /**
     * Initialise le gestionnaire de thème
     * @private
     */
    _initialize() {
        // Charge la préférence de thème depuis le localStorage
        this._loadThemePreference();
        
        // Crée et ajoute l'interrupteur de thème à l'interface
        this._createThemeToggle();
        
        // Applique le thème initial
        this._applyTheme();
        
        // Vérifie si le système d'exploitation utilise un thème sombre
        this._checkSystemPreference();
    }
    
    /**
     * Charge la préférence de thème depuis localStorage
     * @private
     */
    _loadThemePreference() {
        try {
            const savedPreference = localStorage.getItem(this._storageKey);
            if (savedPreference !== null) {
                this._isDarkMode = savedPreference === 'true';
                console.log(`Préférence de thème chargée: ${this._isDarkMode ? 'sombre' : 'clair'}`);
            }
        } catch (e) {
            console.error('Erreur lors du chargement de la préférence de thème:', e);
        }
    }
    
    /**
     * Sauvegarde la préférence de thème dans localStorage
     * @private
     */
    _saveThemePreference() {
        try {
            localStorage.setItem(this._storageKey, this._isDarkMode.toString());
        } catch (e) {
            console.error('Erreur lors de la sauvegarde de la préférence de thème:', e);
        }
    }
    
    /**
     * Crée et ajoute l'interrupteur de thème à l'interface
     * @private
     */
    _createThemeToggle() {
        // Crée l'élément wrapper pour l'interrupteur
        const wrapper = document.createElement('div');
        wrapper.className = 'theme-switch-wrapper';
        
        // Crée l'interrupteur
        const switchLabel = document.createElement('label');
        switchLabel.className = 'theme-switch';
        
        // Crée l'input checkbox
        const switchInput = document.createElement('input');
        switchInput.type = 'checkbox';
        switchInput.id = 'themeSwitch';
        switchInput.checked = this._isDarkMode;
        
        // Crée l'élément slider
        const slider = document.createElement('span');
        slider.className = 'slider';
        
        // Crée le label de texte
        const textLabel = document.createElement('span');
        textLabel.className = 'theme-switch-label';
        textLabel.textContent = this._isDarkMode ? 'Mode sombre' : 'Mode clair';
        
        // Assemblage de l'interrupteur
        switchLabel.appendChild(switchInput);
        switchLabel.appendChild(slider);
        wrapper.appendChild(switchLabel);
        wrapper.appendChild(textLabel);
        
        // Ajoute l'interrupteur au footer
        const footer = document.querySelector('footer .container');
        if (footer) {
            footer.appendChild(wrapper);
            
            // Stocke une référence à l'interrupteur et au label
            this._themeToggle = switchInput;
            this._themeLabel = textLabel;
            
            // Ajoute l'écouteur d'événement pour le changement de thème
            this._themeToggle.addEventListener('change', () => this._handleThemeToggle());
        } else {
            console.error("Élément footer .container non trouvé dans le DOM");
        }
    }
    
    /**
     * Gère le basculement du thème
     * @private
     */
    _handleThemeToggle() {
        if (!this._themeToggle) return;
        
        // Met à jour l'état du mode sombre
        this._isDarkMode = this._themeToggle.checked;
        
        // Met à jour le label
        if (this._themeLabel) {
            this._themeLabel.textContent = this._isDarkMode ? 'Mode sombre' : 'Mode clair';
        }
        
        // Applique le thème
        this._applyTheme();
        
        // Sauvegarde la préférence
        this._saveThemePreference();
        
        console.log(`Thème basculé vers: ${this._isDarkMode ? 'sombre' : 'clair'}`);
    }
    
    /**
     * Applique le thème en fonction de l'état actuel
     * @private
     */
    _applyTheme() {
        if (this._isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    /**
     * Vérifie la préférence de thème du système d'exploitation
     * @private
     */
    _checkSystemPreference() {
        // Vérifie si le navigateur supporte la détection du thème système
        if (window.matchMedia) {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Si aucune préférence n'a été sauvegardée, utilise la préférence système
            const savedPreference = localStorage.getItem(this._storageKey);
            if (savedPreference === null && prefersDarkScheme.matches) {
                this._isDarkMode = true;
                if (this._themeToggle) this._themeToggle.checked = true;
                if (this._themeLabel) this._themeLabel.textContent = 'Mode sombre';
                this._applyTheme();
                this._saveThemePreference();
            }
            
            // Ajoute un écouteur pour détecter les changements de préférence système
            prefersDarkScheme.addEventListener('change', (e) => {
                // Ne change le thème automatiquement que si aucune préférence n'a été définie manuellement
                if (localStorage.getItem(this._storageKey) === null) {
                    this._isDarkMode = e.matches;
                    if (this._themeToggle) this._themeToggle.checked = this._isDarkMode;
                    if (this._themeLabel) this._themeLabel.textContent = this._isDarkMode ? 'Mode sombre' : 'Mode clair';
                    this._applyTheme();
                }
            });
        }
    }
    
    /**
     * Active manuellement le mode sombre
     */
    enableDarkMode() {
        if (!this._isDarkMode) {
            this._isDarkMode = true;
            if (this._themeToggle) this._themeToggle.checked = true;
            if (this._themeLabel) this._themeLabel.textContent = 'Mode sombre';
            this._applyTheme();
            this._saveThemePreference();
        }
    }
    
    /**
     * Désactive manuellement le mode sombre
     */
    disableDarkMode() {
        if (this._isDarkMode) {
            this._isDarkMode = false;
            if (this._themeToggle) this._themeToggle.checked = false;
            if (this._themeLabel) this._themeLabel.textContent = 'Mode clair';
            this._applyTheme();
            this._saveThemePreference();
        }
    }
    
    /**
     * Bascule manuellement le mode sombre
     */
    toggleDarkMode() {
        this._isDarkMode = !this._isDarkMode;
        if (this._themeToggle) this._themeToggle.checked = this._isDarkMode;
        if (this._themeLabel) this._themeLabel.textContent = this._isDarkMode ? 'Mode sombre' : 'Mode clair';
        this._applyTheme();
        this._saveThemePreference();
    }
    
    /**
     * Vérifie si le mode sombre est actuellement activé
     * @returns {boolean} true si le mode sombre est activé
     */
    isDarkModeEnabled() {
        return this._isDarkMode;
    }
}