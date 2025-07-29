const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: 'https://frontend-dot-artsy2bypunith-429730.wl.r.appspot.com', // Or your Angular app's origin
  //origin: 'http://localhost:4200',
  credentials: true,
}));

// Environment variables
const AUTH_URL = process.env.AUTH_URL;
const SEARCH_URL = process.env.SEARCH_URL;
const CLIENT_ID = process.env.ARTSY_CLIENT_ID;
const CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET;

// Function to get the authentication token
async function getAuthToken() {
  try {
    const payload = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    };

    // Make a POST request to the Artsy API
    const response = await axios.post(AUTH_URL, payload);

    // Extract and return the token from the response
    return response.data.token;
  } catch (error) {
    console.error("Error fetching token:", error.response?.data || error.message);
    throw error; // Rethrow the error for further handling if needed
  }
}

// Define a route to display the token on a webpage
app.get('/', async (req, res) => {
  try {
    const token = await getAuthToken();
    res.send("Your Artsy Authentication Token: " + token);
  } catch (error) {
    res.status(500).send("${error.message}");
  }
});

app.get('/api/search_artist', async (req, res) => {
  const artistName = req.query.name.toLowerCase(); // Get 'q' parameter from query string

  if (!artistName) {
    return res.status(400).json({ error: "Missing 'name' parameter." });
  }

  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: "Failed to authenticate with Artsy." });
  }

  const headers = {
    "X-Xapp-Token": token, // Include token in headers
  };

  const params = {
    q: artistName, // Search query
    size: 10, // Limit results to 10
    type: "artist", // Search for artists only
  };

  try {
    const response = await axios.get(SEARCH_URL, { headers, params });

    if (response.status !== 200) {
      return res.status(500).json({ error: "Failed to search for artists." });
    }

    const data = response.data;
    const artists = [];

    // Parse and format artist data from the API response
    for (const item of data._embedded?.results || []) {
      const artistLink = item._links?.self?.href || "";
      const artistId = artistLink.split("/").pop();
      const title = item.title || "Unknown Artist";
      let thumbnail = item._links?.thumbnail?.href || "";

      if (thumbnail.includes("missing_image.png")) {
        thumbnail = null; 
      }

      artists.push({ id: artistId, name: title, thumbnail });
    }

    return res.json(artists); 
  } catch (error) {
    console.error("Error searching for artists:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to search for artists." });
  }
});

// Route to get artist details by ID
app.get('/api/artist/:artist_id', async (req, res) => {
  const artistId = req.params.artist_id; // Get artist ID from route parameters

  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: "Failed to authenticate with Artsy." });
  }

  const headers = {
    "X-Xapp-Token": token, // Include token in headers
  };

  const artistUrl = `https://api.artsy.net/api/artists/${artistId}`;

  try {
    const response = await axios.get(artistUrl, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ error: "Failed to get artist details." });
    }

    const data = response.data;

    // Format artist details
    const artist = {
      id: data.id,
      name: data.name || "Unknown Artist",
      nationality: data.nationality || "Unknown",
      biography: data.biography || "",
      birthday: data.birthday || "Unknown",
      deathday: data.deathday || "Unknown",
      thumbnail: data._links?.thumbnail?.href || null
    };

    return res.json(artist); // Return formatted artist details as JSON
  } catch (error) {
    console.error("Error fetching artist details:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch artist details." });
  }
});

// API route to fetch similar artists
app.get('/api/similar_artists/:artist_id', async (req, res) => {
  const artistId = req.params.artist_id; // Get artist ID from route parameters

  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: "Failed to authenticate with Artsy." });
  }

  const headers = {
    "X-Xapp-Token": token, // Include token in headers
  };

  const url = `https://api.artsy.net/api/artists?similar_to_artist_id=${artistId}`;

  try {
    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ error: "Failed to fetch similar artists." });
    }

    const data = response.data;
    const similarArtists = [];

    // Parse and format artist data from the API response
    for (const artist of data._embedded?.artists || []) {
      similarArtists.push({
        id: artist.id,
        name: artist.name || "Unknown Artist",
        thumbnail: artist._links?.thumbnail?.href || null, // Handle missing thumbnails
      });
    }

    return res.json(similarArtists); // Return formatted artist data as JSON
  } catch (error) {
    console.error("Error fetching similar artists:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch similar artists." });
  }
});

// API route to fetch artworks of a specific artist
app.get('/api/artworks/:artist_id', async (req, res) => {
  const artistId = req.params.artist_id; // Get artist ID from route parameters

  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: "Failed to authenticate with Artsy." });
  }

  const headers = {
    "X-Xapp-Token": token, // Include token in headers
  };

  const url = `https://api.artsy.net/api/artworks?artist_id=${artistId}&size=10`;

  try {
    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ error: "Failed to fetch artworks." });
    }

    const data = response.data;
    const artworks = [];

    // Parse and format artwork data from the API response
    for (const artwork of data._embedded?.artworks || []) {
      artworks.push({
        id: artwork.id,
        title: artwork.title || "Unknown Artwork",
        date: artwork.date || "Unknown Date",
        thumbnail: artwork._links?.thumbnail?.href || null, // Handle missing thumbnails
      });
    }

    return res.json(artworks); // Return formatted artwork data as JSON
  } catch (error) {
    console.error("Error fetching artworks:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch artworks." });
  }
});

app.get('/api/categories/:artwork_id', async (req, res) => {
  const artworkId = req.params.artwork_id; // Get artwork ID from route parameters

  const token = await getAuthToken();
  if (!token) {
    return res.status(500).json({ error: "Failed to authenticate with Artsy." });
  }

  const headers = {
    "X-Xapp-Token": token, // Include token in headers
  };

  const url = `https://api.artsy.net/api/genes?artwork_id=${artworkId}`;

  try {
    const response = await axios.get(url, { headers });

    if (response.status !== 200) {
      return res.status(500).json({ error: "Failed to fetch categories." });
    }

    const data = response.data;
    const categories = [];

    // Parse and format category data from the API response
    for (const category of data._embedded?.genes || []) {
      categories.push({
        name: category.name || "Unknown Category",
        thumbnail: category._links?.thumbnail?.href || null, // Handle missing thumbnails
      });
    }

    return res.json(categories); // Return formatted category data as JSON
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch categories." });
  }
});

const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const favoriteRoutes = require('./routes/favorite.routes');
app.use('/api/users', favoriteRoutes);


app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});


mongoose.connect(process.env.DB_URL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});