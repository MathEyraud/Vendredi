# Vendredi - Breakfast Rotation Manager

A lightweight web application to manage weekly breakfast rotations within different teams. Simple, elegant, and requires no server - just drop the files in a shared folder!

## 🥐 Features

- **Dashboard Overview**
  - Current week's responsible person at a glance
  - Countdown to next Friday breakfast
  - List of upcoming rotations with dates
  - Team switching via dropdown menu

- **Advanced Rotation System**
  - Automatic weekly rotation based on team members
  - Smart date calculation based on Fridays
  - Visual calendar of upcoming assignments
  - Date badges for each team member

- **Team Management**
  - Modular team files for easy maintenance
  - Team members with positions and initials
  - Allergen tracking and warnings
  - Visual identification of current and next person

- **Birthday Management**
  - Track team member birthdays (optional)
  - Display upcoming birthdays in chronological order
  - Special highlight for today's birthdays
  - Countdown to upcoming celebrations

- **User Experience**
  - Dark mode support with automatic system detection
  - Responsive design for all devices
  - Visual allergen warnings
  - Rotation history view

- **Technical Features**
  - LocalStorage for lightweight persistence
  - No server required
  - Modular architecture for easy maintenance

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/MathEyraud/Vendredi.git
```

2. Open `Vendredi.html` in your web browser
   - No server required!
   - Works directly from a shared folder

3. Select your team from the dropdown to see the rotation schedule

## 📂 Project Structure

```
/Vendredi/
├── Vendredi.html                      # Point d'entrée HTML principal
├── README.md                       # Documentation du projet
├── styles/                         # Dossier des styles CSS
│   ├── variables.css               # Variables CSS globales (couleurs, espacements, etc.)
│   ├── base.css                    # Styles de base (reset, structure générale)
│   ├── components.css              # Styles des composants d'interface
│   ├── responsive.css              # Adaptations responsive pour différentes tailles d'écran
│   ├── layout.css                  # Structure de mise en page
│   ├── alerts.css                  # Styles pour les alertes et notifications
│   ├── tables.css                  # Styles pour les tableaux
│   ├── current-person.css          # Styles pour la section du responsable courant
│   ├── person-lists.css            # Styles pour les listes de personnes
│   ├── team-members.css            # Styles pour les membres d'équipe
│   ├── buttons-badges.css          # Styles pour les boutons et badges
│   ├── forms.css                   # Styles pour les éléments de formulaire
│   ├── dark-mode.css               # Adaptations pour le mode sombre
│   ├── theme-switcher.css          # Styles pour le sélecteur de thème
│   └── utilities.css               # Classes utilitaires
└── js/                             # Dossier JavaScript
    ├── config.js                   # Configuration et données des équipes
    ├── main.js                     # Point d'entrée JavaScript
    ├── data/                       # Données de l'application
    │   └── teams/                  # Fichiers des équipes
    │       ├── team_dev.js         # Équipe développement
    │       ├── team_marketing.js   # Équipe marketing
    │       ├── team_design.js      # Équipe design
    │       ├── team_finance.js     # Équipe finance
    │       ├── team_oifp.js        # Équipe OIFP (nouveau)
    │       └── team_exemple.js     # Équipe exemple (nouveau)
    ├── utils/                      # Utilitaires
    │   └── DateUtils.js            # Fonctions de manipulation des dates
    ├── services/                   # Services
    │   └── StorageService.js       # Gestion du stockage localStorage
    ├── models/                     # Modèles (gestion des données)
    │   ├── TeamModel.js            # Modèle des équipes
    │   ├── RotationModel.js        # Modèle de rotation des responsables
    │   └── RankingModel.js         # Modèle de classement (en développement)
    ├── ui/                         # Interface utilisateur
    │   ├── UIManager.js            # Gestionnaire d'interface
    │   └── ThemeManager.js         # Gestionnaire du thème clair/sombre
    └── controllers/                # Contrôleurs
        └── AppController.js        # Contrôleur principal de l'application
```

## 🔄 Adding a New Team

To add a new team, follow these steps:

1. **Create a team file** in the `js/data/teams/` directory following the format `team_[id].js`

2. **Define team data** using this template:

```javascript
/**
 * @fileoverview Team data for [name] team
 */

/**
 * [Name] team configuration
 * @type {Object}
 */
const TEAM_[UPPERCASE_ID] = {
    id: "[id]",                 // Unique identifier (e.g., "hr")
    name: "Team [Name]",        // Display name (e.g., "HR Team") 
    members: [
        { 
            id: 1, 
            name: "First Last", 
            position: "Position", 
            initials: "FL",
            allergenes: ["Allergen1", "Allergen2"],  // List of allergens (empty if none)
            birthdate: "MM-DD"  // Optional birthday (MM-DD format)
        },
        { 
            id: 2, 
            name: "Another Person", 
            position: "Position", 
            initials: "AP",
            allergenes: [],  // No allergens for this person
            birthdate: "MM-DD"  // Optional birthday (MM-DD format)
        },
        // Add all team members here
    ],
    currentIndex: 0,            // Initial member index (0 = first member)
    startDate: new Date('YYYY-MM-DD') // Date of first Friday
};
```

3. **Reference the file** in `Vendredi.html`:

```html
<script src="./js/data/teams/team_[id].js"></script>
```

4. **Update configuration** in `config.js`:

```javascript
// In the loadTeams() function
if (typeof TEAM_[UPPERCASE_ID] !== 'undefined') teams.[id] = TEAM_[UPPERCASE_ID];
```

## 🎨 Customization

- **Dark Mode**: Toggle using the switch in the footer
- **Allergens**: Add allergens to team members in team files
- **Birthdays**: Add birthdates (optional) to celebrate team members
- **Colors**: Edit variables in `styles/variables.css`
- **Layout**: Adjust styling in component CSS files

## 🔒 Privacy & Requirements

- Works entirely locally - no data is sent to any server
- Uses localStorage for minimal data persistence
- Compatible with all modern browsers
- No external dependencies except Font Awesome for icons

## 📱 Compatibility

- Desktop (Chrome, Firefox, Safari, Edge)
- Tablet and mobile (responsive design)
- Works offline

## 📝 License

This project is distributed under the MIT License. See the LICENSE file for more details.