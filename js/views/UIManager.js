/**
 * @fileoverview Gestionnaire d'interface utilisateur
 * Gère l'affichage des données dans l'interface
 */

/**
 * Gère les éléments d'interface utilisateur
 * @constructor
 */
function UIManager() {
    /**
     * Élément affichant le nom du responsable actuel
     * @type {HTMLElement|null}
     * @private
     */
    this._nomResponsableElement = document.getElementById("nomResponsable");
    
    /**
     * Élément contenant la liste des allergènes
     * @type {HTMLElement|null}
     * @private
     */
    this._allergenesContainer = document.getElementById("allergenes");
    
    /**
     * Élément tbody du tableau des prochains passages
     * @type {HTMLElement|null}
     * @private
     */
    this._tableBody = document.getElementById("listeProchainesDates");
    
    /**
     * Élément affichant l'équipe sélectionnée
     * @type {HTMLElement|null}
     * @private
     */
    this._selectedTeamElement = document.getElementById("selectedTeam");
    
    /**
     * Vérifie que tous les éléments DOM nécessaires sont présents
     * @private
     * @throws {Error} Si un élément est manquant
     */
    this._checkElements = function() {
        if (!this._nomResponsableElement) {
            throw new Error("Element 'nomResponsable' non trouvé dans le DOM");
        }
        
        if (!this._allergenesContainer) {
            throw new Error("Element 'allergenes' non trouvé dans le DOM");
        }
        
        if (!this._tableBody) {
            throw new Error("Element 'listeProchainesDates' non trouvé dans le DOM");
        }
        
        if (!this._selectedTeamElement) {
            throw new Error("Element 'selectedTeam' non trouvé dans le DOM");
        }
    };
    
    // Vérifie que tous les éléments nécessaires sont présents
    this._checkElements();
    
    /**
     * Met à jour l'affichage du nom de l'équipe sélectionnée
     * @param {string} nomEquipe - Nom de l'équipe à afficher
     */
    this.updateSelectedTeam = function(nomEquipe) {
        this._selectedTeamElement.textContent = nomEquipe;
    };
    
    /**
     * Met à jour l'affichage du nom du responsable actuel
     * @param {string} nom - Nom du responsable
     */
    this.updateResponsableName = function(nom) {
        this._nomResponsableElement.textContent = nom || "Personne cette semaine";
    };
    
    /**
     * Met à jour l'affichage des allergènes
     * @param {Set<string>} allergenes - Ensemble des allergènes à afficher
     */
    this.updateAllergenes = function(allergenes) {
        const allergenesArray = [...allergenes];
        
        if (allergenesArray.length > 0) {
            this._allergenesContainer.innerHTML = `
                <h3>⚠️ Allergènes dans l'équipe :</h3>
                <p>${allergenesArray.join(" - ")}</p>
            `;
        } else {
            this._allergenesContainer.innerHTML = `
                <h3>✅ Aucun allergène déclaré dans cette équipe</h3>
            `;
        }
    };
    
    /**
     * Met à jour le tableau des prochains passages
     * @param {Array<ResponsableInfo>} responsables - Liste des prochains responsables
     */
    this.updateScheduleTable = function(responsables) {
        // Réinitialise le contenu du tableau
        this._tableBody.innerHTML = "";
        
        // Pour chaque responsable, crée une ligne dans le tableau
        responsables.forEach(({date, personne, joursRestants, estAujourdhui}) => {
            // Construction de la ligne avec :
            // - Classe spéciale si c'est le responsable du jour
            // - Date formatée
            // - Nom du responsable
            // - Jours restants (avec texte spécial si c'est aujourd'hui)
            const row = document.createElement("tr");
            
            if (estAujourdhui) {
                row.classList.add("today");
            }
            
            // Cellule de la date
            const dateCell = document.createElement("td");
            dateCell.textContent = DateUtils.formaterDate(date);
            row.appendChild(dateCell);
            
            // Cellule du nom
            const nomCell = document.createElement("td");
            nomCell.textContent = personne.nom;
            row.appendChild(nomCell);
            
            // Cellule des jours restants - avec texte spécial si c'est aujourd'hui
            const joursCell = document.createElement("td");
            joursCell.textContent = joursRestants === 0 
                ? "Aujourd'hui" 
                : `${joursRestants} jour${joursRestants > 1 ? 's' : ''}`;
            row.appendChild(joursCell);
            
            // Ajoute la ligne au tableau
            this._tableBody.appendChild(row);
        });
    };
}