GigConnect

GigConnect ist eine moderne Freelance-Plattform, die Freelancer und Auftraggeber verbindet. Projekte können veröffentlicht, Bewerbungen verwaltet und Zahlungen sicher über Stripe abgewickelt werden. Die Anwendung ist mit dem MERN-Stack (MongoDB, Express, React, Node.js) entwickelt.

Funktionen

Projekte veröffentlichen: Auftraggeber können neue Jobs erstellen.

Freelancer-Bewerbungen: Freelancer können sich auf Projekte bewerben.

Sichere Zahlungen: Integration von Stripe für sichere Zahlungen.

Benutzerverwaltung: Registrierung, Login und Profilverwaltung für Freelancer und Auftraggeber.

Responsive Design: Optimiert für Desktop und mobile Geräte.

Tech-Stack

Frontend: React.js, Vite, Tailwind CSS

Backend: Node.js, Express.js

Datenbank: MongoDB (Atlas)

Zahlungsintegration: Stripe

Installation & Setup (lokal)

Backend klonen und installieren:

git clone https://github.com/badred010/GigC-back.git
cd GigC-back
npm install


Frontend klonen und installieren:

git clone https://github.com/badred010/GigC-front.git
cd GigC-front
npm install


Environment Variables anlegen:

Backend (.env):

MONGO_URI=<your_mongodb_atlas_url>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
FRONTEND_URL=http://localhost:5173


Frontend (.env for Vite):

VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>


Backend starten:

npm run start   # oder node server.js


Frontend starten:

npm run dev

Deployment

Frontend: Vercel (https://gig-connect-gilt.vercel.app)

Backend: Render (https://gigconnect-46oj.onrender.com)

Stellen Sie sicher, dass die Environment Variables für Produktion korrekt gesetzt sind.

Projektstruktur
backend/   # Node.js + Express API
frontend/  # React.js + Vite Frontend

Screenshots

(Hier können Sie Screenshots Ihrer App einfügen, z. B. Dashboard, Projekte, Checkout)
