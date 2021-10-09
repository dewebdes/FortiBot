"use strict";
const port = process.env.PORT || 8086;
const fs = require('fs');
var mysql = require('mysql');
const { CallTracker } = require('assert');
const { clearInterval } = require('timers');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: 'coinex'
});

var sqlint;
var sqlarr = new Array();
var sqindx = 0;
function checkqueries() {
	clearInterval(sqlint);
	if (sqlarr.length > sqindx) {
		con.query(sqlarr[sqindx], function (err, result) {
			if (err) {
				console.log("Eroor Q : " + sqlarr[sqindx]);
				throw err;
			}
			sqindx++;
			sqlint = setInterval(checkqueries, 100);
		});
	} else {
		sqlint = setInterval(checkqueries, 100);
	}
}

var sleepcont = 1;
function sleepme() {
	console.log('sleep...' + sleepcont);
	sleepcont++;
	int300 = setInterval(gotfeed3, 60000 * 5);
}

var int300;
var lastfeed3 = new Array();
var lastres = "";
function gotfeed3() {
	clearInterval(int300);

	var propertiesObject = {};
	var durl = "https://www.coinex.com/res/quotes/assets?sort_type=change_rate_desc&offset=0&limit=400";
	var request = require('request');
	request({ url: durl, qs: propertiesObject }, function (err, response, body) {
		if (err) { console.log("**ERROR: " + err); return; }
		var bdy = body.trim();
		if (bdy != lastres) {
			lastres = bdy;
			var res = '';
			try {
				res = JSON.parse(bdy);
			} catch (ex) {
				sleepme();
				return;
            }

			for (var i = 0; i <= res.data.data.length - 1; i++) {

				var cname = res.data.data[i].asset;
				var cprice = parseFloat(res.data.data[i].price_usd);
				var minprc = cprice;
				var maxprc = cprice;
				for (var j = 0; j <= res.data.data[i].klines.length - 1; j++) {
					var kprc = parseFloat(res.data.data[i].klines[j][1]);
					if (kprc > maxprc) {
						maxprc = kprc;
					}
					if (kprc < minprc) {
						minprc = kprc;
					}
				}

				//var diffperc = parseFloat(100 - ((cprice * 100) / maxprc));
				var diffperc = parseFloat(100 - ((minprc * 100) / cprice));

				var fnd = false;
				var sql = "";
				for (var j = 0; j <= lastfeed3.length - 1; j++) {
					if (lastfeed3[j].name == cname) {
						fnd = true;
						lastfeed3[j].price = cprice;
						lastfeed3[j].minp = minprc;
						lastfeed3[j].maxp = maxprc;
						lastfeed3[j].perc = diffperc;
						sql = 'update coins_ex set price="' + cprice + '",minp="' + minprc + '",maxp="' + maxprc + '",perc="' + diffperc + '" where name="' + cname + '";';
						break;
					}
				}

				if (fnd == false) {
					var nobj = { id: 0, name: cname, price: cprice, minp: minprc, maxp: maxprc, perc: diffperc };
					lastfeed3[lastfeed3.length] = nobj;
					sql = 'insert into coins_ex (name,price,minp,maxp,perc) values("' + nobj.name + '","' + nobj.price + '","' + nobj.minp + '","' + nobj.maxp + '","' + nobj.perc + '");';
				}
				sqlarr[sqlarr.length] = sql;

			}

			for (let s of io.of('/').sockets) {
				let socketx = s[1];
				socketx.emit('getfeed', lastfeed3);
			}
		}
		int300 = setInterval(gotfeed3, 7000);

	});
}

con.connect(function (err) {
	if (err) throw err;
	console.log("***********mysql Connected!");

	var sql = "select * from coins_ex;";

	con.query(sql, function (err, result) {
		if (err) throw err;
		if (result.length > 0) {
			lastfeed3 = result;
		} else {
		}
		sqlint = setInterval(checkqueries, 100);
		gotfeed3();
		
	});

});

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

io.on('connection', (socket) => {
	socket.on('getfeed', msg => {
		socket.emit('getfeed', lastfeed3);
	});
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

function replaceallstr(ts, tv, rv) {
	while (ts.indexOf(tv) > -1) {
		ts = ts.replace(tv, rv);
	}
	return ts;
}
function gettimetick() {
	var date = new Date();
	var ticks = date.getTime();
	return ticks;
}
function isnullval(tval) {
	var retval = false;
	try {
		if ((tval == "") || (tval == undefined) || (tval == null) || (tval == NaN) || (jQuery.trim(tval) == "")) { retval = true; }
	} catch (ex) {
		retval = false;
	}
	return retval;
}

