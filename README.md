🥐 Friday Breakfast Manager
A lightweight web application to manage weekly Friday breakfast rotations within different teams. Simple, elegant, and requires no server - just drop the files in a shared folder!

🌟 Features
- Weekly Rotation System
=> Automatic rotation every Friday
=> Countdown timer to next breakfast
=> Visual calendar of upcoming assignments

- Multi-team Support
=> Easy team switching via dropdown
=> Independent rotation cycles per team
=> Customizable team members and allergens

- Modern UI/UX
=> Clean, responsive design
=> Dark mode support
=> Allergen tracking and warnings
=> Real-time countdown display

🛠️ Technical Details
- Pure Frontend Stack
=> HTML5
=> CSS3 (Custom Properties, Flexbox)
=> Vanilla JavaScript (ES6+)
=> No external dependencies

- Architecture
=> Modular JavaScript architecture
=> BEM methodology for CSS
=> LocalStorage for preferences
=> Fully commented codebase

📁 Project Structure
/
├── Vendredi.html          # Main entry point
├── styles/                # CSS modules
│   ├── variables.css      # CSS custom properties
│   ├── base.css          # Base styles
│   ├── components.css     # Reusable components
│   ├── table.css         # Table styles
│   └── countdown.css      # Countdown styles
├── js/                    # JavaScript modules
│   ├── config.js         # Global configuration
│   ├── countdown.js      # Countdown logic
│   ├── darkMode.js       # Dark mode handling
│   ├── equipeManager.js  # Team management
│   ├── main.js          # Entry point
│   ├── rotationManager.js # Rotation system
│   ├── uiManager.js     # UI updates
│   └── utils.js         # Utilities
└── data/
    └── equipes/          # Team configurations
        ├── equipe_marketing.js
        ├── equipe_oifp.js
        └── equipe_pirate.js

🚀 Getting Started
1. Clone the repository:
clone https://github.com/MathEyraud/Vendredi.git

2. Open Vendredi.html in your web browser
- No server required!
- Works directly from a shared folder

3. Select your team from the dropdown to see the rotation schedule

⚙️ Configuration
To add or modify teams, edit the corresponding team file in /data/equipes/:
javascriptCopyconst equipeExample = {
    participants: [
        { nom: "John", allergenes: ["gluten"] },
        { nom: "Jane", allergenes: [] },
        // Add more team members...
    ]
};

🎨 Customization
- Edit variables.css to customize colors, fonts, and spacing
- Modify components.css for custom UI components
- Adjust countdown settings in countdown.js

💡 Contributing
Feel free to submit issues and enhancement requests!
1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
- Inspired by the need to organize team breakfasts fairly
- Built with ❤️ for croissant lovers everywhere

🔄 Version History
- 1.0.0 (February 2025)
=> Initial release
=> Basic rotation system
=> Three team support
=> Dark mode
