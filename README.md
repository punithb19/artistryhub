## ArtistryHub – Artist Search Web App

This full-stack web application enables users to search for artists using the Artsy API, view artist details, explore artworks and their categories, manage personal favorites, and securely register and log in. It features a responsive and interactive interface built using Angular, Node.js, MongoDB, and is deployed on Google Cloud.

---

### Features

- Search for artists using the Artsy API
- View detailed artist information including biography and nationality
- Browse artist artworks and explore their categories
- Manage favorite artists (add/remove) for authenticated users
- Register, log in, log out, and delete accounts securely
- Display user avatars using Gravatar
- Maintain auth state across reloads and tabs
- Fully responsive design with Bootstrap 5

---

### Technologies Used

**Frontend:**
- Angular 17
- Bootstrap 5
- TypeScript
- RxJS
- HTTP Client with interceptors and routing
- Responsive UI components using Angular and Bootstrap

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- JWT for authentication
- Bcrypt for secure password hashing
- Gravatar integration using SHA-256

---

### Installation Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/punithb19/artistryhub.git
   cd artistryhub
   ```

2. Install dependencies:
   ```bash
   # Frontend
   cd artsy-angular-project
   npm install

   # Backend
   cd ../artsy-backend
   npm install
   ```

3. Run locally:
   ```bash
   # In frontend (with proxy configuration)
   ng serve

   # In backend
   node index.js
   ```

---

### Live Demo

- Frontend: [Your deployed frontend URL]
- Backend API example: [Your deployed backend endpoint, e.g., `/api/search?q=Picasso`]

> Replace these with actual deployment links.

---

### Project Structure

```
/artsy-angular-project     - Angular frontend
/artsy-backend             - Node.js backend API
/artsy-backend-android     - (Optional) Android backend
```

---

### Sample Artists for Testing

- Pablo Picasso – complete profile and 1 artwork
- Vincent van Gogh – no biography, 10 artworks
- Yayoi Kusama – no artworks
- Claude Monet – 10 artworks, complete info
- Raphael – 10 artworks, some missing categories

---

### Notes

- The frontend does not directly call the Artsy API; all requests are routed through the backend
- Use of Bootstrap 5 is required for responsiveness
- All AJAX calls are performed using Angular's HttpClient
- Auth state is shared across tabs using cookies and verified on refresh
- Application uses Google Cloud and MongoDB Atlas for hosting and storage
