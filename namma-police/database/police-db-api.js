define(
	[
		'exports',
		'../configs/db-configs/config-cassandra',
		'../configs/db-configs/config-redis',
		'../configs/db-configs/config-mongodb'
	],function(exports, configCassandra, configRedis, configMongo){
		var db;
		var ObjectID = require('mongodb').ObjectID;

		var cassandraClient = configCassandra.cassandraClient(),
			redisClient = configRedis.redisClient(),
			mongoDBClient = configMongo.mongoClientDB(),
			dataTypes = configCassandra.dataTypes(),
			that = this,
			debug = require('debug')('nammapolice:account-db');
		
		exports.updatePoliceLocation = function(reqObj, callback){
			mongoDBClient.collection("policeData").ensureIndex( { "location" : "2dsphere" }, function(){
				mongoDBClient.collection("policeData").update({
					policeId: reqObj.policeId
				},{
					$set: {
						location: {
							type: "Point",
							address: reqObj.address,
							coordinates: reqObj.coordinates
						}	
					}
				}, function(err, results){
					var resultData = {};
					if(err){
						resultData = {
							error: err,
							message: 'Execute failed in updatePoliceLocation'
						};
						callback(resultData);
					}else{
						resultData = {
							status: 'Location Updated',
							docs: results
						};
						callback(null, resultData);
					}
				});
			});	
		}
	}
);