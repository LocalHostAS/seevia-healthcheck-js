var http = require('http');

/*
 * Class for listening to healtch check requests over http.
 * Performs supplied health check on each request.
 */

// Create new health check
var HttpHealthCheck = function(check){
	this.check = check || function(){return true};
};

// Start listening for http health checks on given port
HttpHealthCheck.prototype.listen = function(port,cb) {
	var self = this;
	
	// Initialize http server
	var server = http.createServer(function (req, res) {
	  	
		// Ignore invalid requests
		if (req.url !== '/')
		{
			res.writeHead(404, {"Content-Type": "text/plain"});
  	  	  	res.end("Not Found\n");
		  	return;
		}
		
		// Perform check and return status accordingly
		try {
			self.check(function(err){
				if (err) {
					res.writeHead(500, {"Content-Type": "text/plain"});
		    	  	res.end("FAIL\n");
				}
				else {
		  	  	  	res.writeHead(200, {"Content-Type": "text/plain"});
		  	  	  	res.end("OK\n");
				}
			});
		} catch (ex) {
			res.writeHead(500, {"Content-Type": "text/plain"});
    	  	res.end("FAIL\n");
		} 
	});
	
	server.listen(port,cb);
};

module.exports = HttpHealthCheck;