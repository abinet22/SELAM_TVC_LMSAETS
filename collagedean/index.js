const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const ejs = require("ejs");
const path = require('path');
const cors = require("cors");
const db = require('./models');
const app = express();

// Passport authentication Config
require('./config/passport')(passport);

var corsOptions = {
    origin: "http://localhost:8081"
  };
  
app.use(cors(corsOptions));
// connect to mysql

// connection
//   .connect((err) =>{
//       if (!err)
//       {
//         console.log('MYSQL Connected') 
//       }
//       else{
//         console.log('MYSQL Not Connected')
//       }
//   });
db.sequelize.sync().then(() => {
 
});

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash messsages
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/',express.static(path.join(__dirname,'./public')));
// Routes
var router = express.Router();
app.use('/', require('./routes/index.js'));
//router.use(() =>{});
//router.use('/', require('./routes/index.js'));
app.use('/training', require('./routes/training.js'));
app.use('/dept', require('./routes/dept.js'));
app.use('/course', require('./routes/course.js'));
app.use('/programs', require('./routes/programs.js'));
app.use('/company', require('./routes/company.js'));
app.use('/trainee', require('./routes/trainee.js'));
//app.use('/trainee', require('./routes/trainee.js'));





//app.use('/dean', router);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`);
});
