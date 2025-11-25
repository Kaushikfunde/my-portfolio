⚡ Kaushik Funde - Portfolio
"Bridging the gap between silicon and software."
A modern, responsive, and interactive personal portfolio website built with React and Tailwind CSS. This site showcases my work as an Electronics Engineering student and Independent IoT Engineer, highlighting my projects, skills, and professional journey.
<!-- You can add a screenshot of your website here later by dragging it into the GitHub editor -->
🚀 Features
Responsive Design: Fully optimized for Mobile, Tablet, and Desktop.
Smooth Animations: Custom scroll-reveal effects and interactive hover states.
Working Contact Form: Integrated with Web3Forms for receiving emails directly.
Dynamic Navigation: Smooth scrolling to sections (About, Projects, Experience, etc.).
Dark Mode Aesthetic: Sleek, professional dark-themed UI.
Copy-to-Clipboard: "Smart Copy" feature for email addresses.
🛠️ Tech Stack
Frontend Library: React.js
Styling: Tailwind CSS
Icons: Lucide React
Form Handling: Web3Forms
Build Tool: Vite (Recommended) or Create React App
📂 Project Structure
├── src
│   ├── App.jsx       # Main application logic and all components
│   ├── index.css     # Tailwind imports and global styles
│   └── main.jsx      # Entry point
├── public
│   └── image01.jpg   # Profile picture
├── package.json      # Dependencies
└── README.md         # Documentation


🏁 Getting Started
Follow these instructions to get a copy of the project running on your local machine.
Prerequisites
Node.js (v14 or higher)
npm or yarn
Installation
Clone the repository:
git clone [https://github.com/YOUR-USERNAME/my-portfolio.git](https://github.com/YOUR-USERNAME/my-portfolio.git)
cd my-portfolio


Install dependencies:
npm install


Start the development server:
npm run dev
# or if using Create React App:
npm start


Open your browser and navigate to http://localhost:5173 (or the port shown in your terminal).
🔑 Configuration (Contact Form)
The contact form is powered by Web3Forms. To make it work with your own email:
Go to Web3Forms and create a generic Access Key.
Open src/App.jsx.
Search for the Contact component.
Replace the placeholder key with your actual key:
formData.append("access_key", "YOUR-ACCESS-KEY-HERE");


🌍 Deployment
You can deploy this project easily using Vercel or Netlify.
Deploy on Vercel:
Push your code to GitHub.
Go to Vercel and sign up.
Import your GitHub repository.
Click Deploy.
🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
📬 Contact
Kaushik Funde
LinkedIn: @KaushikFunde
GitHub: @Kaushikfunde
Email: kaushik.funde@example.com
Built with ❤️ and ☕ by Kaushik.
