const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, 'formData.json');

// Route pour sauvegarder les données
app.post('/save-data', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Les champs email et mot de passe sont requis.');
  }

  // Lire les données existantes
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
      return res.status(500).send('Erreur lors de la lecture des données.');
    }

    let formData = [];

    // Si le fichier n'est pas vide, analyser le contenu et s'assurer que c'est un tableau
    if (data) {
      try {
        formData = JSON.parse(data);
        if (!Array.isArray(formData)) {
          formData = []; // Si ce n'est pas un tableau, réinitialiser
        }
      } catch (parseError) {
        formData = []; // En cas d'erreur de parsing, réinitialiser
      }
    }

    // Ajouter les nouvelles données
    formData.push({ email, password });

    // Réécrire le fichier avec les nouvelles données
    fs.writeFile(filePath, JSON.stringify(formData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur lors de la sauvegarde des données.');
      }

      res.send('Données sauvegardées avec succès.');
    });
  });
});

// Route pour récupérer les données sauvegardées
app.get('/save-data', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error(err);
      return res.status(500).send('Erreur lors de la récupération des données.');
    }

    // Si le fichier est vide, renvoyer un tableau vide
    if (!data) {
      return res.json([]);
    }

    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
