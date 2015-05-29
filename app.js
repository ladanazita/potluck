// brings in the module to our code
var express = require('express'),
    http = require('http'),
    // initialize express application
    // path is a core module built into express
    path = require('path'),
    // morgan is a module that allows us to logs our HTTP requests
    // i.e. post, get, delete requests
    morgan = require('morgan'),
    // body parser gives us post request inside of our request.body.<attribute>
    // gives us POST params in request.body
    bodyParser = require('body-parser'),
    Dish = require('./dish.js'),

    // simulate PUT & DELETE
    methodOverride = require('method-override');
    var app = express();
    // create HTTP server
    var server = http.createServer(app);


    // stylesheet
    app.use(express.static(path.join(__dirname, 'public')));


    // we need to use app now to refer back to our express app and have it do those
    // cool things for us
    // two underscores before dirname
    // we are telling it to look for the directoy views
    // set is configuring app
    app.set('views', path.join(__dirname, 'views'));
    // we want to set it to use jade, a more syntactic HTML that is defaulted with
    // express, its compressed HTML
    app.set('view engine', 'jade');

    // use is using the middleware
    // we are calling our middleware, using it in our app, we want to hide this
    // in production so noone sees what requests we are asking for
    app.use(morgan('dev'));
    // helps make our post request more readable
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // lests us override post request and simulate puts and delete request
    // we are using this method later on in our forms to override post request
    app.use(methodOverride('_method'));

    // Establish the routes for our app
    app.get('/', function(request, response){
      // our model name is Blog, we want all the posts return, the params are
      // the specifics we want returned
      Dish.find(function(error, dishes){
        if(error){
          // this sends back the error message, fine in dev environment so don't
          // normally include this
          response.send(error);
        }
        response.render('dishes/index', {
          description: 'Dishes',
          // the key can be whatever you want, this sends back all our blogs
          dishes: dishes
        });
      });
    });

// NEW
app.get('/dishes/new', function(request, response){
  response.render('dishes/new', {
    description: "Create a dish"
  });
});

// CREATE
app.post('/dishes', function(request, response){
  // the Blog is calling on our model
  var dish = new Dish();
  // the body parser middleware allows us to call on the body.title
  dish.description = request.body.description;
  dish.student = request.body.student;
  // we don't need to return anything, but we want to check for an error
  dish.save(function(error){
    if(error){
      response.send(error);
    }
    response.redirect('/');
  });
});

// SHOW
app.get('/dishes/:id', function(request, response){
  Dish.findOne({_id: request.params.id}, function(error, dish){
    if(error){
      response.send(error);
    }
    response.render('dishes/show', {
      description: dish.description,
      dish: dish
    });
  });
});

// EDIT
app.get('/dishes/:id/edit', function(request, response){
  Dish.findOne({_id: request.params.id}, function(error, dish){
    if(error){
      response.send(error);
    }
    response.render('dishes/edit', {
      title: 'Edit this dish',
      dish: dish
    });
  });
});

// UPDATE
app.put('/dishes/:id', function(request, response){
  Dish.update({_id: request.params.id}, {
    // to call on the bodyParser
    dish: request.body.description,
    student: request.body.student
  }, function(error, dish){
    if(error){
      response.send(error);
    }
    response.redirect('/');
  });
});

// DESTROY
app.delete('/dishes/:id', function(request, response){
  Dish.findByIdAndRemove(request.params.id, function(error){
    if(error){
      response.send(error);
    }
    response.redirect('/');
  });
});

// defining our host
var port = process.env.PORT || 3000;
server.listen(port, function(){
  console.log('App is listening on port' + port);
});
