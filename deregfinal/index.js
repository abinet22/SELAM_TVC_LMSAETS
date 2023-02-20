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
  res.locals.success_msg_extra = req.flash('success_msg_extra');
  next();
});

app.use(express.static(path.join(__dirname,'./public')));
// Routes
app.use('/registrardataencoder', require('./routes/index.js'));
app.use('/registrardataencoder/programs', require('./routes/programs.js'));
app.use('/registrardataencoder/company', require('./routes/company.js'));
app.use('/registrardataencoder/trainee', require('./routes/trainee.js'));
app.use('/registrardataencoder/applicant',require('./routes/applicant.js'));
app.use('/registrardataencoder/registration',require('./routes/registration.js'));
app.use('/registrardataencoder/staff',require('./routes/staff.js'));
app.use('/registrardataencoder/sendtojbs',require('./routes/sendtojbs.js'));
app.use('/registrardataencoder/classmanage',require('./routes/classmanage.js'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
