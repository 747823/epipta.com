"use strict";


var HOSTNAME = "evanpipta.com";
var HTTP_PORT = process.env.PORT || 80;
var HTTPS_PORT = 443;
var http = require( "http" );
var https = require( "https" );
var Express = require( "express" );
var Jade = require( "jade" );
var Sass = require( "node-sass" );
var RenderSass = require( "express-render-sass" );
var Package = require( "./package.json" );
var Fs = require( "fs" );

var sslEnabled = true;

var ssl = {
  cert: sslEnabled ? Fs.readFileSync("/etc/letsencrypt/live/evanpipta.com/fullchain.pem") : 0,
  key: sslEnabled ? Fs.readFileSync("/etc/letsencrypt/live/evanpipta.com/privkey.pem") : 0
};


( function() {


  // Start server
  var app = Express();
  var server = https.createServer(ssl, app);
  var insecureServer = http.createServer(app);


  // Redirect http to https and also force a single hostname
  if ( sslEnabled ) {
    app.use(function( req, res, next ) {
      if ( !req.secure || req.get("host") !== HOSTNAME ) {
        res.redirect( 301, "https://" + HOSTNAME + req.url );
        return;
      }
      next();
    } );
  }


  // SASS renderer
  app.use( RenderSass( __dirname + "/public" ) );


  // Redirect anything ending in no slash or index.html to the directory root with trailing slash
  app.use( function( req, res, next ) {

    // Remove params 
    // Pretty sure I'm not using these, so we can just toss em
    var path = req.url.split( "?" )[ 0 ];

    // Redirect any ending index.html
    if ( path.match( /index\.html$/ ) ) {
      res.redirect( 302, path.replace( "index.html", "" ) );
      return;
    }

    // Redirect to trailing slash (besides site root)
    var lastPart = path.split( "/" ).slice( -1 )[ 0 ];
    if ( lastPart && lastPart.indexOf( "." ) < 0 && lastPart.slice( -1 ) !== "/" ) {
      res.redirect( 302, path + "/" );
      return;
    }

    next();

  } );

  // Route to index.jade for the respective path
  app.use( function( req, res, next ) {

    // console.log( req.url );
    // If the url ends in a slash, try to render a jade file here
    if ( req.url.match( /\/$/ ) ) {
      var jadeFilePath = __dirname + "/public" + req.url + "index.jade";
      console.log("Attempting to access " + jadeFilePath );
      try {
        // This will throw an error to catch if the jade file doesn't exist
        Fs.accessSync( jadeFilePath );
        // If it didn't error, send the rendered file
        res.status( 200 ).send( Jade.renderFile( jadeFilePath, {
          pretty: "  "
        } ) );
        return;
      }
      catch ( err ) {
        console.log( err );
      }

    }
    next();
  } );


  // Serve static files from public directory
  app.use( Express.static( __dirname + "/public", {
    index: false,
    maxAge: 1,
    setHeaders: function( res, path, stat ) {
      // res.set("Content-Type", "text/html");
    }
  } ) );


  // Handle anything else as 404
  app.use( function( req, res, next ) {
    res.status( 404 ).send( Jade.renderFile( __dirname + "/public/404.jade", {
      pretty: "  "
    } ) );
  } );


  // Start https server
  if ( sslEnabled ) server.listen(HTTPS_PORT);
  insecureServer.listen(HTTP_PORT);


} )();
