var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcryptjs');
var request = require('request');
var qs = require('querystring');
var Twit = require('twit');
var _ = require('lodash');
var Twitter = require('twitter-node-client').Twitter;
var schedule = require('node-schedule');

// Routes - Controllers
var routes = require('./routes/index');
var users = require('./routes/users');

// Models
var User = require('./models/user');
var Task = require('./models/task_model');
var TweetScheduled = require('./models/tweet_scheduled_model');
var TrackBy = require('./models/trackBy_model');
var Tweet = require('./models/tweet');
var Hashtag = require('./models/hashtag');

// config
var config = require('./config');

var app = express();

// Socket
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Connects to the MongoDB Server in the test database
mongoose.connect("mongodb://localhost:27017/test");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('node_modules'));
app.use(express.static(path.join(__dirname, 'public')));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ console.log('connection')});
server.listen(4000);

// var tasks = require('./routes/tasks')(app);

app.use('/', routes);
app.use('/users', users);
// app.use('/tasks', tasks);

/* POST /auth/login */
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: { email: 'Incorrect email' } });
    }

    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: { password: 'Incorrect password' } });
      }

      user = user.toObject();
      delete user.password;

      var token = createJWT(user);
      console.log(token, user);
      res.send({ token: token, user: user });
    });
  });
});

/* POST /auth/signup */
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }

    var user = new User({
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;

        user.save(function() {
          var token = createJWT(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});

// Scheduled Tweets
/**
 * Create
 */
app.post('/api/scheduled-tweet', isAuthenticated, function (req, res) {
  var newScheduledTweet = new TweetScheduled(req.body);

  newScheduledTweet.save(function (err, tweet) {
    if (err) {
        res.json({
            info: 'error during tweet create',
            error: err
        });
    };
    res.json({
        info: 'Scheduled tweet created successfully',
        data: tweet
    });
  })
});

/**
* Read
*/
app.get('/api/scheduled-tweet', isAuthenticated, function (req, res) {
  TweetScheduled.find(function (err, tweets) {
      if (err) {
          res.json({
              info: 'error during find tweets',
              error: err
          });
      };
      res.json({
          info: 'tweets found successfully',
          data: tweets
      });
  });
});

// Task API
/**
 * Create
 */
app.post('/api/task', isAuthenticated, function (req, res) {
  console.log('User: ', req.user);
  var newTask = new Task(req.body);
  newTask.save(function (err, task) {
      if (err) {
          res.json({
              info: 'error during task create',
              error: err
          });
      } else {
        var user = req.user;
        user.tasks.push(task.id);
        user.save(function(err, user) {
          if(err) {
            res.json({
              info: 'error during task create',
              error: err
            });
          } else {
            res.json({
              info: 'Task created successfully',
              data: task
            });
          }
        })
      }
  });
});

/**
* Read
*/
app.get('/api/task', isAuthenticated, function (req, res) {
  User.findById(req.user._id)
    .populate('tasks')
    .exec(function(err, user) {
      res.json({
          info: 'tasks found successfully',
          data: user.tasks
      });
    })
  // Task.find(function (err, tasks) {
  //     if (err) {
  //         res.json({
  //             info: 'error during find task',
  //             error: err
  //         });
  //     };
  //     res.json({
  //         info: 'tasks found successfully',
  //         data: tasks
  //     });
  // });
});

app.get('/api/task/:id', isAuthenticated, function (req, res) {
  Task.findById(req.params.id, function (err, task) {
      if (err) {
          res.json({
              info: 'error during find task',
              error: err
          });
      };
      if (task) {
          res.json({
              info: 'task found successfully',
              data: task
          });
      } else {
          res.json({
              info: 'task not found'
          });
      }
  });
});

/**
* Update
*/
app.put('/api/task/:id', isAuthenticated, function (req, res) {
  Task.findById(req.params.id, function (err, task) {
      if (err) {
          res.json({
              info: 'error during find task',
              error: err
          });
      };
      if (task) {
          _.merge(task, req.body);
          task.save(function (err) {
              if (err) {
                  res.json({
                      info: 'error during task update',
                      error: err
                  });
              };
              res.json({
                  info: 'task updated successfully'
              });
          });
      } else {
          res.json({
              info: 'task not found'
          });
      }
  });
});

/**
* Delete
*/
app.delete('/api/task/:id', isAuthenticated, function (req, res) {
  Task.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
          res.json({
              info: 'error during remove task',
              error: err
          });
      } else {
        // User.findById(req.user._id, function(err, user) {
          User.findOneAndUpdate({_id: req.user._id}, { $pull: { tasks: req.params.id } }, {new: true}, function(err, user) {
            console.log('DELETE? ', user);
            if(err) {
              res.status(400).json({
                info: 'error during remove task',
                error: err
              })
            } else {
              res.json({
                info: 'task removed successfully'
              });
            }
          });
        // });
      }
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Twitter
 |--------------------------------------------------------------------------
 */
app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);

      // Step 2. Send OAuth token back to open the authorization screen.
      res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);

      var profileOauth = {
        consumer_key: config.TWITTER_KEY,
        consumer_secret: config.TWITTER_SECRET,
        oauth_token: accessToken.oauth_token
      };

      // Step 4. Retrieve profile information about the current user.
      request.get({
        url: profileUrl + accessToken.screen_name,
        oauth: profileOauth,
        json: true
      }, function(err, response, profile) {

        // Step 5a. Link user accounts.
        if (req.header('Authorization')) {

          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.tokenSecret);

          User.findById(payload.sub, '+password', function(err, localUser) {
            if (!localUser) {
              return res.status(400).send({ message: 'User not found.' });
            }

      //       // Merge two accounts.
            if (existingUser) {

              existingUser.email = localUser.email;
              existingUser.password = localUser.password;

              localUser.remove();

              existingUser.save(function() {
                var token = createToken(existingUser);
                return res.send({ token: token, user: existingUser });
              });

            } else {
              // Link current email account with the Instagram profile information.
              localUser.twitter = body.user.id;
              localUser.username = body.user.username;
              localUser.fullName = body.user.full_name;
              localUser.picture = body.user.profile_picture;
              localUser.accessToken = profileOauth.oauth_token;

              localUser.save(function() {
                var token = createToken(localUser);
                res.send({ token: token, user: localUser });
              });

            }
          });
        } else {
          // Step 5b. Create a new user account or return an existing one.
          User.findOne({ twitter: profile.id }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: createJWT(existingUser), user: existingUser });
            }

            var user = new User();
            user.twitter = profile.id;
            user.displayName = profile.name;
            user.picture = profile.profile_image_url.replace('_normal', '');
            user.accessToken = profileOauth.oauth_token;
            user.save(function() {
              res.send({ token: createJWT(user), user: user });
            });
          });
        }
      });
    });
  }
});

/**
 * Destroy a tweet with a given id
 */
app.post('/api/statuses/destroy', isAuthenticated, function(req, res) {
  var tweet_id = req.body.tweet_id;
  console.log('i will delete: ', tweet_id);
  
  T.post('statuses/destroy/:id', { id: tweet_id }, function (error, data, response) {
    if (!error && response.statusCode == 200) {
      res.send(data);
    }
    else{
      res.status(error.statusCode).send(error);
    }
  });
});

app.get('/api/user_timeline', isAuthenticated, function(req, res){
  var userTimelineUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

  var T = new Twit({
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    access_token: "150651191-T2VWIid1GLMlKA75bmTil7oVqv3shUQ3ZHSEQBAK",
    access_token_secret: "yE8yp0EkTqC7Ml2xUVYDcmh9M1Z0XpjdFxyZdjZpzrjvl"
  });

  T.get('statuses/user_timeline', function(error, data, response) {
    console.log(data);
    if (!error && response.statusCode == 200) {
      res.send(data);
    }
    else{
      res.send(error);
    }
  });
});

/* Search Twitter API */
app.post('/api/search', isAuthenticated, function(req, res){
  var userTimelineUrl = 'https://api.twitter.com/1.1/search/tweets.json';

  var T = new Twit({
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    access_token: "150651191-T2VWIid1GLMlKA75bmTil7oVqv3shUQ3ZHSEQBAK",
    access_token_secret: "yE8yp0EkTqC7Ml2xUVYDcmh9M1Z0XpjdFxyZdjZpzrjvl"
  });

  T.get('search/tweets', { 
      max_id: req.body.max_id,
      q: req.body.q, 
      result_type: req.body.result_type, 
      count: req.body.count, 
      include_entities: req.body.include_entities,
      since_id: req.body.since_id
    }, function(error, data, response) {
    console.log(data);
    if (!error && response.statusCode == 200) {
      res.send(data);
    }
    else{
      res.send(error);
    }
  });
});

app.get('/api/home_timeline', isAuthenticated, function(req, res) {
  var homeTimelineUrl = 'https://api.twitter.com/1.1/statuses/home_timeline.json';

  var T = new Twit({
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    access_token: "150651191-T2VWIid1GLMlKA75bmTil7oVqv3shUQ3ZHSEQBAK",
    access_token_secret: "yE8yp0EkTqC7Ml2xUVYDcmh9M1Z0XpjdFxyZdjZpzrjvl"
  });

  T.get('statuses/home_timeline', function(error, data, response) {
    console.log(data);
    if (!error && response.statusCode == 200) {
      res.send(data);
    }
    else{
      res.send(error);
    }
  });
});

app.post('/api/users/show', isAuthenticated, function(req, res) {
  var T = new Twit({
    consumer_key: config.TWITTER_KEY,
    consumer_secret: config.TWITTER_SECRET,
    access_token: "150651191-T2VWIid1GLMlKA75bmTil7oVqv3shUQ3ZHSEQBAK",
    access_token_secret: "yE8yp0EkTqC7Ml2xUVYDcmh9M1Z0XpjdFxyZdjZpzrjvl"
  });

  var screen_name = req.body.screen_name;
  var user_id = req.body.user_id;

  var params = { 
    user_id: user_id,
    screen_name: screen_name
  }

  if(!user_id) {
    delete params.user_id;
  }
  if(!screen_name) {
    delete params.screen_name;
  }

  T.get('users/show', params, function(error, data, response) {
    console.log(response);
    if (!error && response.statusCode == 200) {
      res.send(data);
    }
    else{
      res.send(error);
    }
  });
});

app.post('/auth/instagram', function(req, res) {
  var accessTokenUrl = 'https://api.instagram.com/oauth/access_token/';

  var params = {
    client_id: req.body.clientId,
    redirect_uri: req.body.redirectUri,
    client_secret: config.clientSecret,
    code: req.body.code,
    grant_type: 'authorization_code'
  };
  
  console.log('im sending params...', params);

  // Step 1\. Exchange authorization code for access token.
  request.post({ url: accessTokenUrl, form: params, json: true }, function(error, response, body) {
      console.log('step 1', error, response, body);

    // Step 2a. Link user accounts.
    if (req.headers.authorization) {

      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {

        var token = req.headers.authorization.split(' ')[1];
        var payload = jwt.decode(token, config.tokenSecret);

        User.findById(payload.sub, '+password', function(err, localUser) {
          if (!localUser) {
            return res.status(400).send({ message: 'User not found.' });
          }

    //       // Merge two accounts.
          if (existingUser) {

            existingUser.email = localUser.email;
            existingUser.password = localUser.password;

            localUser.remove();

            existingUser.save(function() {
              var token = createToken(existingUser);
              return res.send({ token: token, user: existingUser });
            });

          } else {
            // Link current email account with the Instagram profile information.
            localUser.instagramId = body.user.id;
            localUser.username = body.user.username;
            localUser.fullName = body.user.full_name;
            localUser.picture = body.user.profile_picture;
            localUser.accessToken = body.access_token;

            localUser.save(function() {
              var token = createToken(localUser);
              res.send({ token: token, user: localUser });
            });

          }
        });
      });
    } else {
    //   // Step 2b. Create a new user account or return an existing one.
      User.findOne({ instagramId: body.user.id }, function(err, existingUser) {
        if (existingUser) {
          var token = createToken(existingUser);
          return res.send({ token: token, user: existingUser });
        }

        var user = new User({
          instagramId: body.user.id,
          username: body.user.username,
          fullName: body.user.full_name,
          picture: body.user.profile_picture,
          accessToken: body.access_token
        });

        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    }
  });
});

/**
 * Read all tweets index
 */
app.get('/api/tweets', isAuthenticated, function(req, res) {
  Tweet.getTweets(0, 0, function(tweets, total, pages) {
    res.send({
      data: tweets,
      total: total,
      pages: pages
    })
  })
});

/**
 * Read paginated tweets
 */
app.post('/api/tweets', isAuthenticated, function(req, res) {
  var page = req.body.page;
  var skip = req.body.skip;

  Tweet.getTweets(page, skip, function(tweets, total) {
    res.send({data: tweets, total: total});
  })
});

/**
 * Create a new tweet
 */

app.post('/api/tweet', isAuthenticated, function(req, res) {
  var status = req.body.status;

  T.post('statuses/update', { status: status }, function(err, data, response) {
    if(!err) {
      res.send({data: data});
    } else {
      res.status(400).json({
        info: 'Error during creating tweet',
        error: err
      });
    }
  });
});

/**
 * Read all trackBy
 */
app.get('/api/trackBy', isAuthenticated, function(req, res) {
  TrackBy.find(function (err, tracks) {
    if (err) {
        res.json({
            info: 'error during find tracks',
            error: err
        });
    } else {
      res.json({
        info: 'Tracks found successfully',
        data: tracks
      });
    }
  });
});

/**
 * Delete trackBy
 * 
 */
app.delete('/api/trackBy/:id', isAuthenticated, function(req, res) {
  TrackBy.findByIdAndRemove(req.params.id, function (err, track) {
    if(err) {
      res.status(400).json({
        info: 'Error during track deletion',
        error: err
      });
    }
    if(track) {
      res.json({
        info: 'task removed successfully'
      });
    } else {
      res.status(404).json({
          info: 'Cannot find track'
      });
    }
  });
});

/**
 * Create trackBy
 */
app.post('/api/trackBy', isAuthenticated, function(req, res) {
  var newTrackBy = new TrackBy(req.body);
  newTrackBy.save(function (error, trackBy) {
    if (error) {
      if(error.code == 11000) {
          return res.status(400).json({ info: 'Keyword already exists. '});
      }
      else {
          return res.status(400).send( error );
      }
    } else {
      res.json({
        info: 'Keyword created successfully',
        data: trackBy
      });
    }
  });  
});

/* Twitter Streaming API */
var T = new Twit({
  consumer_key: config.TWITTER_KEY,
  consumer_secret: config.TWITTER_SECRET,
  access_token: "150651191-T2VWIid1GLMlKA75bmTil7oVqv3shUQ3ZHSEQBAK",
  access_token_secret: "yE8yp0EkTqC7Ml2xUVYDcmh9M1Z0XpjdFxyZdjZpzrjvl"
});

var stream = null;
var streamStatus = false;

app.get('/api/stream-status', isAuthenticated, function(req, res) {
  res.send({status: streamStatus});
});

app.post('/api/stream', isAuthenticated, function(req, res) {
  var status = req.body.status;
  console.log(status);
  if(status) {
    stream.start();
    streamStatus = true;
    res.send({info: 'Status changed', status: status });
  } else {
    stream.stop();
    streamStatus = false;
    res.send({info: 'Status changed', status: status });
  }
});

var tracks = getTracks().then(function(response) {
  // console.log(response);
  console.log(response);
  stream = T.stream('statuses/filter', { track: response });
  initEvents(stream);
}, function(error){
  console.log(error);
});

function getTracks() {
  return new Promise(function(fulfill, reject) {
    TrackBy.find(function(err, tracks) {
      var results = [];
      if(!err) {
        tracks.forEach(function(element) {
          results.push(element.keyword);
        });
        fulfill(results);
      } else {
        reject(err);
      }
    });
  });
}

seedDB();

function initEvents(stream) {
  streamStatus = true;
  stream.on('tweet', function(tweet) {
    // console.log('I found a tweet', tweet.entities);
    // console.log('entities: ', tweet.entities);
    // console.log('user: ', tweet.user);
    var _id = null;
    var hasHashtag = false;
    if(tweet.user !== undefined) {
      var storeTweet = {
        twitter_id: tweet.id_str,
        active: false,
        author: tweet.user.name,
        avatar: tweet.user.profile_image_url,
        body: tweet.text,
        date: tweet.created_at,
        screenname: tweet.user.screen_name
      };

      // hasthags
      if(tweet.entities !== undefined) {
        if(tweet.entities.hashtags.length > 0) {
          hasHashtag = true;
          var tags = [];
          var hashtags = tweet.entities.hashtags;
          hashtags.forEach(function(element) {
            tags.push(element.text);
          });
        }
      }
      storeTweet.hashtags = tags;

      var newTweet = new Tweet(storeTweet);

      newTweet.save(function(err, storedTweet) {
        // console.log('saving tweet...', storedTweet);
        if(!err) {
          var _id = storedTweet._id;
          // console.log(storedTweet._id);

          if(hasHashtag) {
            var hashtags = tweet.entities.hashtags;
            hashtags.forEach(function(element) {
              Hashtag
                .findOne({ "text": element.text })
                .exec(function(err, foundHashtag) {
                  if(!foundHashtag) {
                    var h = new Hashtag({
                      text: element.text
                    })
                    h.tweets.push(storedTweet._id);
      
                    h.save(function(err, result) {
                      if(!err) {
                        // console.log(result);
                      }
                    })
                  } else {
                    // console.log('####');
                    foundHashtag.tweets.push(storedTweet._id);
                    // console.log('iparxei idi: ', foundHashtag);
                    // console.log('####');
                    // foundHashtag.tweets.push(storedTweet._id);
                    foundHashtag.save(function(err, r) {
                      if(!err) {
                        // console.log(r);
                      }
                    });
                  }
                });
            });
          }
          // Socket will emit the new tweet..
          io.emit('tweet', tweet);
        }
      });
    }
  });
  
  stream.on('connect', function (request) {
    console.log('connect...')
  })
  
  stream.on('disconnect', function (request) {
    console.log('disconnect...');
  })

  stream.on('error', function (request) {
    console.log('error...', error);
  })
}

/* Instagram API Endpoints */
app.get('/api/feed', isAuthenticated, function(req, res) {
  console.log('API Endpoint 1');
  var feedUrl = 'https://api.instagram.com/v1/users/self/media/recent';
  var params = { access_token: req.user.accessToken };

  request.get({ url: feedUrl, qs: params, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body.data);
    }
  });
});

app.get('/api/media/:id', isAuthenticated, function(req, res, next) {
  var mediaUrl = 'https://api.instagram.com/v1/media/' + req.params.id;
  var params = { access_token: req.user.accessToken };

  request.get({ url: mediaUrl, qs: params, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body.data);
    }
  });
});

// app.get('/api/self', isAuthenticated, function(req, res){
//   var selfUrl = 'https://api.instagram.com/v1/users/self';
//   var params = { access_token: req.user.accessToken };

//   request.get({ url: selfUrl, qs: params, json: true }, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.send(body.data);
//     }
//   });
// });

app.get('/api/followed-by', isAuthenticated, function(req, res){
  var followedByUrl = 'https://api.instagram.com/v1/users/self/media/liked';
  var params = { access_token: req.user.accessToken };

  request.get({ url: followedByUrl, qs: params, json: true }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body.data);
    }
  });
});

app.post('/api/like', isAuthenticated, function(req, res, next) {
  var mediaId = req.body.mediaId;
  var accessToken = { access_token: req.user.accessToken };
  var likeUrl = 'https://api.instagram.com/v1/media/' + mediaId + '/likes';

  request.post({ url: likeUrl, form: accessToken, json: true }, function(error, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({
        code: response.statusCode,
        message: body.meta.error_message
      });
    }
    res.status(200).end();
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.tokenSecret);
}

function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };

  return jwt.encode(payload, config.tokenSecret);
}

function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();

  if (now > payload.exp) {
    console.log(now, payload.exp);
    return res.status(401).send({ message: 'Token has expired.' });
  }

  User.findById(payload.sub, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  })
}

// Cron Jobs - Scheduler
var j = schedule.scheduleJob('*/1 * * * *', function(){
  var durationInMinutes = 5;
  console.log('Today is recognized by Rebecca Black!');
  var startDate = new Date();
  var endDate = new Date(startDate - (durationInMinutes * 60 * 1000));
  console.log(startDate);
  console.log(endDate);
  var tweets = TweetScheduled.find({
    completed: false,
    datetime: {
      $gte: endDate,
      $lt: startDate
    }
  });

  tweets.select('_id text datetime').exec(function(err, tweets) {
    console.log(tweets);
    tweets.forEach(function(tweet) {
      updateStatus(tweet);
    })
  });
});

function updateStatus(tweet) {
  console.log('I will post: ', tweet);
  T.post('statuses/update', { status: tweet.text }, function(err, data, response) {
    console.log(data);
    TweetScheduled.findById(tweet._id, function (err, tweet) {
      if (err) {
          console.log('error during find tweet');
      };
      if (tweet) {
          tweet.completed = true;
          tweet.save(function (err, res) {
              if (err) {
                  console.log(err);
              };
              console.log(res);
          });
      } else {
          console.log('tweet not found!');
      }
    });
  });
}

/**
 * Seed db with admin
 */
function seedDB() {
  User.find({role: 'admin'}, function(err, admin) {
    console.log('isAdmin?', admin);
    if(admin.length == 0) {
      var user = new User({
        email: 'admin@admin.com',
        password: 'admin',
        role: 'admin'
      });
  
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          user.password = hash;
  
          user.save(function() {
            var token = createJWT(user);
            // res.send({ token: token, user: user });
          });
        });
      });
    }
  });
}

module.exports = app;
