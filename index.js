const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Path to your views folder

// Route to fetch and render cocktail data
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const cocktailData = response.data.drinks[0];

    const cocktail = {
      name: cocktailData.strDrink,
      image: cocktailData.strDrinkThumb,
      ingredients: Object.keys(cocktailData)
        .filter(key => key.startsWith('strIngredient') && cocktailData[key])
        .map(key => cocktailData[key])
        .join(', '),
      instructions: cocktailData.strInstructions,
      alcoholic: cocktailData.strAlcoholic
    };

    res.render('index', { cocktail });
  } catch (error) {
    console.error('Error fetching cocktail data:', error);
    res.status(500).send('Error fetching cocktail data');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});