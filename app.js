/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    startStopDaemon = require('start-stop-daemon');

var app = express();

var server;

/*
 * configure express middleware
 */
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
});

var options = {
    daemonFile: "busbutler.dmn",
    outFile: "busbutler.out",
    errFile: "busbutler.err",
    onCrash: function(e){
        console.info("server crashed! Closing httpserver and restarting expressjs now ...", e);
        server.close();
        this.crashRestart();
    }
};

startStopDaemon(options, function() {
    server = http.createServer(app);
    server.listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
}); 
