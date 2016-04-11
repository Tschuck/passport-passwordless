# Passport-Passwordless

This project was build, to handle [Passwordless](https://github.com/florianheinemann/passwordless) as a build in authentication method using the common authentication library [Passport](https://github.com/jaredhanson/passport).
By plugging into Passport, [Passwordless](https://github.com/florianheinemann/passwordless) can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.

For now, only the redis store and the email delivery was tested. Feel free to add configuration samples for data stores and code samples for new delivery types. 

## Installation

  $ npm install passport-passwordless

## Usage

```javascript
  passport.use(new PasswordlessStrategy({ 
    //... configuration ... 
  }, function (req, user, done) {

    //.. validate the logged in user and build your final user object

    return done(null, user);
  };
```

## Minimal configuration sample

```javascript
  {
    allowTokenReuse : true,
    tokenLifeTime   : 1000 * 60 * 10,

    store : {
      path   : __dirname + '/node_modules/passwordless-redis',
      config : [
        6379,
        '127.0.0.1',
        {

        }
      ]
    },
    delivery : {
      type : 'emailjs',
      allowGet : true,
      path : __dirname + '/node_modules/emailjs',
      config : {
        server : {
          user     : 'test.user@domain.com', 
          password : 'yourPwd', 
          host     : 'yourSmtp', 
          ssl      : true
        },
        msg : {
          text    : 'Hello!\nAccess your account here: http://<%= hostname %>?token=<%= tokenToSend %>&uid=',
          html    : '<html><p>Hello</p><br><p>Access your account here: http://<%= hostname %>?token=<%= tokenToSend %>&uid=<%= uidToSend %></p>'
          subject : 'Token for <%= hostname %>'
        }
      }
    }
  }
```

## Configuration with description
The path parameter for the store and delivery configuration is needed to exclude obsolete library dependencies of this package. So the delivery / store package can be required from the parent lib.

```javascript
  {
    //If this property will be set to true, each authentication request generates a new passwordless instance to handle multiple and dynamic configurations
    //If it's set to false, the passwordless instance will be created by instantiating the strategy
    dynamicConfig : false,

    //all passwordless internal parameters, that are used to parse the request query object
    userField     : 'user',
    tokenField    : 'tokenField',
    uidField      : 'uidField',
    deliveryField : 'delivery',
    originField   : null,

    //token relevant parameters
    allowTokenReuse : true,
    tokenLifeTime   : 1000 * 60 * 10,

    //specify maximal token length
    maxTokenLength : 16,

    //If you want to create your own token type use this function, to use your own algorithm. 
    //tokenAlgorithm : function() {
    //  Function shall return the token in sync mode (default: Base58 token)
    //},

    //includes the store configuration
    //setup a path to the node_module that should be used
    //setup a configuration array that will be applied to the store constructor
    //internally it looks like the following code :
    //  var store = require(this.options.store);
    //  store.call(this.options.store.config);
    store : {
      path   : __dirname + '/node_modules/passwordless-redis',
      config : [
        6379,
        '127.0.0.1',
        {

        }
      ]
    },

    //Specify the delivery configurations
    //following object contains an example with emailjs
    //
    //Notice : currently only a delivery for emailjs is written
    //  If you want to use another delivery, feel free to implement it or apply a function like the following as the delivery
    //  function(options) {
    //    var email = require(options.path); 
    //    var smtp  = email.server.connect(options.config.server);
    //
    //    return function(tokenToSend, uidToSend, recipient, callback, req) {
    //      ... do delivery stuff..
    //      callback(err);
    //    };
    //  }
    delivery : {
      type : 'emailjs',
      allowGet : true,

      path : __dirname + '/node_modules/emailjs',
      config : {
        server : {
          user     : 'test.user@domain.com', 
          password : 'yourPwd', 
          host     : 'yourSmtp', 
          ssl      : true
        },

        //all message parameters are compiled as an underscore template (http://underscorejs.org/#template)
        //the following parameters are available:
        // {
        //   hostName    : 'localhost:3000',
        //   tokenToSend : tokenToSend,
        //   uidToSend   : uidToSend,
        //   recipient   : recipient,
        //   req         : req 
        // }
        msg : {
          text    : 'Hello!\nAccess your account here: http://<%= hostname %>?token=<%= tokenToSend %>&uid=',
          //a html property was added by my self, to be able add html body automatically to the configuration
          html    : '<html><p>Hello</p><br><p>Access your account here: http://<%= hostname %>?token=<%= tokenToSend %>&uid=<%= uidToSend %></p>'
          subject : 'Token for <%= hostname %>'
        }
      }
    },

    //is used to check if an user is authorized to request a token
    //call the callback with an error and an user object (user object needs an parameter called "id" to specify it's email adress, sms, ...)
    //the default access functions contains the following function
    access : function(user, callback) {
      callback(null, user);
    }
  }
```

# License
The MIT License (MIT)
Copyright © 2016 <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.