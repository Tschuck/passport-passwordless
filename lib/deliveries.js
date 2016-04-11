var _      = require('underscore');
var helper = require(__dirname + '/lib.js');

//include all delivery types
module.exports = {
  //delivery for email js
  emailjs : function(options) {
    //load the email library from the parent path
    var email = require(options.path); 
    var smtp  = email.server.connect(options.config.server);

    return function(tokenToSend, uidToSend, recipient, callback, req) {
      var msg     = options.config.msg;
      var dataObj = {
        hostName    : helper.getBaseUrl(req.headers.referer),
        tokenToSend : tokenToSend,
        uidToSend   : uidToSend,
        recipient   : recipient,
        req         : req 
      };

      try {
        var email = {
          text    : _.template(msg.text)(dataObj),
          from    : msg.from ? _.template(msg.to)(dataObj) : options.config.server.user, 
          to      : msg.to ? _.template(msg.to)(dataObj) : uidToSend,
          subject : _.template(msg.subject)(dataObj)
        };

        if (msg.html) {
          email.attachment = [
            { 
              data : _.template(msg.html)(dataObj), 
              alternative:true 
            }
          ];
        }

        smtp.send(email, function(err, message) { 
          callback(err);
        });
      } catch(err) {
        callback('Error while sending mail : ' + err);
      }
    }
  }
};