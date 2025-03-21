/**
 * @fileoverview Gestionnaire d'interface utilisateur
 * Gère l'affichage et les interactions avec l'interface
 */

/**
 * @class UIManager
 * Gère l'interface utilisateur
 */
class UIManager {
    /**
     * Crée une instance du gestionnaire d'interface
     * @constructor
     */
    constructor() {
        // Élements du DOM
        this.serviceSelectorElement = document.getElementById('serviceSelector');        // Dropdown de sélection d'équipe dans le header
        this.currentPersonElement = document.getElementById('currentPerson');            // Nom du responsable actuel des croissants
        this.currentDateElement = document.getElementById('currentDate');                // Date du prochain vendredi
        this.countdownElement = document.getElementById('countdown');                    // Décompte des jours jusqu'au prochain vendredi
        this.nextPersonsListElement = document.getElementById('nextPersonsList');        // Liste des prochaines personnes en rotation
        this.teamListElement = document.getElementById('teamList');                      // Grille des membres de l'équipe
        this.historyTableBodyElement = document.getElementById('historyTableBody');      // Tableau d'historique des rotations passées
        this.allergenesContainerElement = document.getElementById('allergenesContainer'); // Conteneur pour les alertes d'allergènes
        this.birthdaysListElement = document.getElementById('birthdaysList');            // Liste des prochains anniversaires
        this.noBirthdaysElement = document.getElementById('noBirthdays');                // Message affiché quand aucun anniversaire n'est défini
        this.teamMemberCountElement = document.getElementById('teamMemberCount');        // Badge affichant le nombre de membres dans l'équipe
        
        // Nouveaux éléments pour les fêtes des prénoms
        this.nameDaysListElement = document.getElementById('nameDaysList');
        this.noNameDaysElement = document.getElementById('noNameDays');
        
        // Vérifie que tous les éléments nécessaires sont présents
        this._checkElements();
    }
    
    /**
     * Vérifie que les éléments DOM nécessaires sont présents
     * @private
     */
    _checkElements() {
        const elements = [
            { element: this.serviceSelectorElement, name: 'serviceSelector' },
            { element: this.currentPersonElement, name: 'currentPerson' },
            { element: this.currentDateElement, name: 'currentDate' },
            { element: this.countdownElement, name: 'countdown' },
            { element: this.nextPersonsListElement, name: 'nextPersonsList' },
            { element: this.teamListElement, name: 'teamList' },
            { element: this.historyTableBodyElement, name: 'historyTableBody' }
        ];
        
        for (const { element, name } of elements) {
            if (!element) {
                console.error(`Élément '${name}' non trouvé dans le DOM`);
            }
        }
        
        // Vérification séparée pour l'élément des allergènes
        if (!this.allergenesContainerElement) {
            console.error("Élément 'allergenesContainer' non trouvé dans le DOM");
        }
    }
    
    /**
     * Configure les écouteurs d'événements
     * @param {Function} serviceChangeCallback - Fonction à appeler lors du changement de service
     */
    setupEventListeners(serviceChangeCallback) {
        // Écouteur pour le changement de service
        if (this.serviceSelectorElement) {
            this.serviceSelectorElement.addEventListener('change', (event) => {
                const serviceId = event.target.value;
                serviceChangeCallback(serviceId);
            });
        }
    }
    
    /**
     * Remplit le sélecteur de services
     * @param {Object} services - Services disponibles
     * @param {string} currentServiceId - ID du service actuellement sélectionné
     */
    populateServiceSelector(services, currentServiceId) {
        if (!this.serviceSelectorElement) return;
        
        // Vide le sélecteur
        this.serviceSelectorElement.innerHTML = '';
        
        // Ajoute une option pour chaque service
        for (const [id, service] of Object.entries(services)) {
            if (service && service.name) {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = service.name;
                option.selected = id === currentServiceId;
                this.serviceSelectorElement.appendChild(option);
            }
        }
    }
    
    /**
     * Met à jour l'affichage du responsable actuel
     * @param {RotationInfo} rotation - Informations sur le responsable actuel
     */
    updateCurrentRotation(rotation) {
        if (!rotation || !rotation.member) return;
        
        // Met à jour le nom du responsable
        if (this.currentPersonElement) {
            this.currentPersonElement.textContent = rotation.member.name || "Non défini";
        }
        
        // Met à jour la date
        if (this.currentDateElement) {
            this.currentDateElement.textContent = `Vendredi ${DateUtils.formatDate(rotation.date)}`;
        }
        
        // Met à jour le compte à rebours
        if (this.countdownElement) {
            // Réinitialiser les classes
            this.countdownElement.classList.remove('today');
            
            if (rotation.isToday) {
                this.countdownElement.innerHTML = `<i class="fas fa-clock"></i><span>C'est aujourd'hui !</span>`;
                this.countdownElement.classList.add('today');
            } else if (rotation.daysRemaining === 1) {
                this.countdownElement.innerHTML = `<i class="fas fa-clock"></i><span>C'est demain !</span>`;
            } else {
                this.countdownElement.innerHTML = `<i class="fas fa-clock"></i><span>Dans ${rotation.daysRemaining} jours</span>`;
            }
        }
    }
    
    /**
     * Met à jour l'affichage des prochains responsables
     * @param {Array<RotationInfo>} rotations - Liste des prochains responsables
     */
    updateNextRotations(rotations) {
        if (!this.nextPersonsListElement) return;
        
        // Vide la liste
        this.nextPersonsListElement.innerHTML = '';
        
        // Vérifie que rotations est un tableau
        if (!Array.isArray(rotations) || rotations.length === 0) {
            // Afficher un message si aucune rotation future n'est disponible
            this.nextPersonsListElement.innerHTML = `
                <li class="person-item empty-list">
                    <div class="empty-message">Aucune rotation future disponible</div>
                </li>
            `;
            return;
        }
        
        // Ajoute une entrée pour chaque prochain responsable
        for (const rotation of rotations) {
            if (!rotation || !rotation.member) continue;
            
            const li = document.createElement('li');
            li.className = 'person-item';
            
            // Formatage du texte pour le décompte des jours
            let countdownText;
            if (rotation.daysRemaining === 1) {
                countdownText = "Demain !";
            } else {
                countdownText = `Dans ${rotation.daysRemaining} jours`;
            }
            
            li.innerHTML = `
                <div class="person-avatar">${rotation.member.initials || '??'}</div>
                <div class="person-info">
                    <div class="person-name">${rotation.member.name || 'Non défini'}</div>
                    <div class="person-date">Vendredi ${DateUtils.formatDate(rotation.date)}</div>
                </div>
                <div class="person-countdown">${countdownText}</div>
            `;
            
            this.nextPersonsListElement.appendChild(li);
        }
        
        // Si la liste est très longue, ajouter un style pour la rendre scrollable
        if (rotations.length > 5) {
            this.nextPersonsListElement.classList.add('scrollable-list');
        } else {
            this.nextPersonsListElement.classList.remove('scrollable-list');
        }
    }    

    /**
     * Met à jour l'affichage des membres de l'équipe
     * @param {Array} members - Liste des membres
     * @param {Object} currentMember - Membre actuellement responsable
     */
    updateTeamMembers(members, currentMember) {
        if (!this.teamListElement) return;
        
        // Vide la liste
        this.teamListElement.innerHTML = '';
        
        // Vérifie que members est un tableau
        if (!Array.isArray(members)) return;

        // Met à jour le compteur de membres
        if (this.teamMemberCountElement) {
            this.teamMemberCountElement.textContent = members.length;
        }
        
        // Index du membre actuel
        const currentIndex = members.findIndex(m => m && currentMember && m.id === currentMember.id);
        
        // Ajoute une carte pour chaque membre
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (!member) continue;
            
            const div = document.createElement('div');
            div.className = 'team-member';
            
            // Détermine si le membre est le responsable actuel ou le prochain
            const isCurrentMember = i === currentIndex;
            const isNextMember = i === (currentIndex + 1) % members.length;
            
            // Badges à afficher
            let statusBadge = '';
            if (isCurrentMember) {
                statusBadge = '<div class="member-badge current">Cette semaine</div>';
            } else if (isNextMember) {
                statusBadge = '<div class="member-badge">Prochain</div>';
            }
            
            div.innerHTML = `
                <div class="member-avatar">${member.initials || '??'}</div>
                <div class="member-name">${member.name || 'Non défini'}</div>
                <div class="member-position">${member.position || ''}</div>
                ${statusBadge}
            `;
            
            this.teamListElement.appendChild(div);
        }
    }    
    
    /**
     * Met à jour l'affichage de l'historique
     * @param {Array<RotationInfo>} pastRotations - Liste des tours précédents
     * @param {string} serviceName - Nom du service
     */
    updateHistory(pastRotations, serviceName) {
        
        // Si le tableau d'historique n'existe pas, on ne peut rien faire
        if (!this.historyTableBodyElement) return;
        
        // Vide le tableau
        this.historyTableBodyElement.innerHTML = '';
        
        // Vérifie que pastRotations est un tableau
        if (!Array.isArray(pastRotations)) return;
        
        // Utiliser un nom de service par défaut si non défini
        const safeServiceName = serviceName || "Service non spécifié";
        
        // Ajoute une ligne pour chaque tour précédent
        for (const rotation of pastRotations) {
            // Vérifier que rotation et ses propriétés sont valides
            if (!rotation || !rotation.date || !rotation.member) continue;
            
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td data-label="Date">${DateUtils.formatDate(rotation.date)}</td>
                <td data-label="Personne">${rotation.member.name || "Inconnu"}</td>
                <td data-label="Service">${safeServiceName}</td>
                <td data-label="Statut">Terminé</td>
            `;
            
            this.historyTableBodyElement.appendChild(tr);
        }
    }
    
    /**
     * Met à jour l'affichage des allergènes
     * @param {Array} allergenes - Liste des allergènes
     * @param {Array} membersWithAllergenes - Liste des membres ayant des allergènes
     */
    updateAllergenes(allergenes, membersWithAllergenes) {
        // Si le conteneur d'allergènes n'existe pas, on termine
        if (!this.allergenesContainerElement) {
            console.error("Le conteneur d'allergènes n'existe pas dans le DOM");
            return;
        }
        
        // Vérification si aucun allergène n'est présent
        if (!allergenes || !Array.isArray(allergenes) || allergenes.length === 0) {
            // Afficher un message indiquant qu'aucun allergène n'est présent
            this.allergenesContainerElement.innerHTML = `
                <div class="allergene-success">
                    <i class="fas fa-info-circle"></i>
                    Bonne nouvelle ! Aucun membre de cette équipe n'a d'allergènes déclarés.
                </div>
            `;
            return;
        }
        
        console.log("Mise à jour des allergènes:", allergenes);
        
        try {
            // Construction du HTML
            let html = `
                <div class="allergenes-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    Allergènes à prendre en compte
                </div>
                <div class="allergenes-list">
            `;
            
            // Ajoute chaque allergène
            for (const allergene of allergenes) {
                html += `<div class="allergene-badge">${allergene}</div>`;
            }
            
            html += `
                </div>
                <div class="allergene-warning">
                    <i class="fas fa-info-circle"></i>
                    Attention : merci de prendre en compte ces allergènes lors de l'achat des viennoiseries.
                </div>
            `;
            
            // Affecte le HTML au conteneur
            this.allergenesContainerElement.innerHTML = html;
        } catch (error) {
            console.error("Erreur lors de la mise à jour des allergènes:", error);
        }
    }
    
    /**
     * Teste l'affichage des allergènes avec des données statiques
     * Utile pour déboguer les problèmes d'affichage
     */
    testAllergenes() {
        console.log("Test d'affichage des allergènes...");
        
        // Vérifie que le conteneur existe
        if (!this.allergenesContainerElement) {
            console.error("Conteneur des allergènes introuvable dans le DOM");
            return;
        }
        
        // Données de test statiques
        const testAllergenes = ["Gluten", "Lactose", "Noix"];
        
        // Affiche directement dans le conteneur
        this.allergenesContainerElement.innerHTML = `
            <div class="allergenes-title">
                <i class="fas fa-exclamation-triangle"></i>
                Allergènes de test à prendre en compte
            </div>
            <div class="allergenes-list">
                ${testAllergenes.map(a => `<div class="allergene-badge">${a}</div>`).join('')}
            </div>
            <div class="allergene-warning">
                <i class="fas fa-info-circle"></i>
                Attention : ceci est un test d'affichage des allergènes.
            </div>
        `;
        
        console.log("Test d'affichage des allergènes terminé.");
    }

    /**
     * Met à jour l'affichage des anniversaires
     * @param {Array} birthdays - Liste des prochains anniversaires
     */
    updateBirthdays(birthdays) {
        if (!this.birthdaysListElement || !this.noBirthdaysElement) {
            console.error("Éléments pour les anniversaires non trouvés dans le DOM");
            return;
        }
        
        // Vide la liste
        this.birthdaysListElement.innerHTML = '';
        
        // Affiche un message si aucun anniversaire n'est défini
        if (!birthdays || birthdays.length === 0) {
            this.birthdaysListElement.style.display = 'none';
            this.noBirthdaysElement.style.display = 'block';
            return;
        }
        
        // Sinon, affiche la liste des anniversaires
        this.birthdaysListElement.style.display = 'block';
        this.noBirthdaysElement.style.display = 'none';
        
        // Ajoute une entrée pour chaque anniversaire
        for (const birthday of birthdays) {
            const li = document.createElement('li');
            li.className = 'person-item';
            
            // Détermine le texte du décompte
            let countdownText;
            if (birthday.daysRemaining === 0) {
                countdownText = "C'est aujourd'hui !";
                li.classList.add('birthday-today'); // Ajoute une classe spéciale pour aujourd'hui
            } else if (birthday.daysRemaining === 1) {
                countdownText = "C'est demain !";
            } else {
                countdownText = `Dans ${birthday.daysRemaining} jours`;
            }
            
            li.innerHTML = `
                <div class="person-avatar">${birthday.member.initials || '??'}</div>
                <div class="person-info">
                    <div class="person-name">${birthday.member.name || 'Non défini'}</div>
                    <div class="person-date">${birthday.formattedDate}</div>
                </div>
                <div class="person-countdown">${countdownText}</div>
            `;
            
            this.birthdaysListElement.appendChild(li);
        }
        
        // Si la liste est très longue, ajouter une classe pour la rendre scrollable
        if (birthdays.length > 5) {
            this.birthdaysListElement.classList.add('scrollable-list');
        } else {
            this.birthdaysListElement.classList.remove('scrollable-list');
        }
    }

    /**
     * Met à jour l'affichage des fêtes des prénoms
     * @param {Array} nameDays - Liste des prochaines fêtes des prénoms
     */
    updateNameDays(nameDays) {
        if (!this.nameDaysListElement || !this.noNameDaysElement) {
            console.error("Éléments pour les fêtes des prénoms non trouvés dans le DOM");
            return;
        }
        
        // Vide la liste
        this.nameDaysListElement.innerHTML = '';
        
        // Affiche un message si aucune fête n'est définie
        if (!nameDays || nameDays.length === 0) {
            this.nameDaysListElement.style.display = 'none';
            this.noNameDaysElement.style.display = 'block';
            return;
        }
        
        // Sinon, affiche la liste des fêtes
        this.nameDaysListElement.style.display = 'block';
        this.noNameDaysElement.style.display = 'none';
        
        // Ajoute une entrée pour chaque fête
        for (const nameDay of nameDays) {
            const li = document.createElement('li');
            li.className = 'person-item';
            
            // Détermine le texte du décompte
            let countdownText;
            if (nameDay.daysRemaining === 0) {
                countdownText = "C'est aujourd'hui !";
                li.classList.add('nameday-today'); // Ajoute une classe spéciale pour aujourd'hui
            } else if (nameDay.daysRemaining === 1) {
                countdownText = "C'est demain !";
            } else {
                countdownText = `Dans ${nameDay.daysRemaining} jours`;
            }
            
            li.innerHTML = `
                <div class="person-avatar">${nameDay.member.initials || '??'}</div>
                <div class="person-info">
                    <div class="person-name">${nameDay.member.name || 'Non défini'}</div>
                    <div class="person-date">${nameDay.formattedDate}</div>
                </div>
                <div class="person-countdown">${countdownText}</div>
            `;
            
            this.nameDaysListElement.appendChild(li);
        }
        
        // Si la liste est très longue, ajouter une classe pour la rendre scrollable
        if (nameDays.length > 5) {
            this.nameDaysListElement.classList.add('scrollable-list');
        } else {
            this.nameDaysListElement.classList.remove('scrollable-list');
        }
    }
}