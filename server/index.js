require('dotenv').config();
const express = require("express"); 
const session = require("express-session");
const checkForSession = require("./middlewears/checkForSession")
const swagController = require('./controllers/swagController')
const authController = require('./controllers/authController')
const cartController = require('./controllers/cartController')
const searchController = require('./controllers/searchController')
const { SERVER_PORT, SESSION_SECRET } = process.env;

const app = express();

// MIDDLEWEAR
app.use(express.json()); //express.json so we can read JSON from the request body
app.use( session({  //session so we can create sessions. Remember that session needs a configuration object as the first argument
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,

})
);
app.use(checkForSession); // NOTE: When we use our own simple middleware, we don't invoke the function inside of app.use. Pre-built middlewares like express.json are invoked because that is the way the author of the middleware designed it.
app.use(express.static(`${__dirname}/../build`));
// ENDPOINTS
//AUTH
app.post('/api/login', authController.login);
app.post('/api/register', authController.register);
app.post('/api/signout', authController.signout);
app.get('/api/getUser', authController.getUser);
//SWAG
app.get("/api/swag", swagController.read);
//CART
app.post('/api/cart/checkout', cartController.checkout);
app.post('/api/cart/:id', cartController.add);
app.delete('/api/cart/:id', cartController.delete);
//SEARCH
app.get('/api/search', searchController.search)
//http://localhost:3001/api/search?category=hats <------this is how you write a query

app.listen(SERVER_PORT, () => console.log(`Server listening on port ${SERVER_PORT}`));
