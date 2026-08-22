const express = require('express');
const session = require('express-session');
const Controller = require('./controllers/controller');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: 'rahasia_super_aman',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    maxAge: 600000 
  }
}));

const isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login?error=Silakan login terlebih dahulu');
  }
  next();
};

const isGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};

app.get('/register', isGuest, Controller.getRegister);
app.post('/register', isGuest, Controller.postRegister);
app.get('/login', isGuest, Controller.getLogin);
app.post('/login', isGuest, Controller.postLogin);

app.get('/logout', Controller.getLogout)

app.get('/', Controller.lp);
app.get('/products/add', Controller.getAdd);
app.post('/products/add', Controller.postAdd);

// app.get('/:userId', isLoggedIn, Controller.home);
app.get('/:userId/products', Controller.products);
app.get('/:userId/products/:productId', Controller.productById);

app.get('/:userId/products/:productId/buyProduct', Controller.getBuy);

app.get('/:userId/categories', Controller.categories);
app.get('/:userId/categories/:categoriesId', Controller.categoryById);

app.get('/users', Controller.users);

app.get('/products/:productId/edit', Controller.getEdit);
app.post('/products/:productId/edit', Controller.postEdit);

app.get('/products/delete/:productId', Controller.getDelete);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});