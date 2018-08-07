var express = require('express');
var app = express();
var exec = require('child_process').exec;
var snmp = require('snmp-native');
var util = require('util');

var cmdCeph_osd_df_tree = 'ceph osd df tree --format json-pretty';
var cmdCeph_status = 'ceph status --format json-pretty';

var community = 'public';
var host = 'localhost';

function getCephinfo (cmdStr,callback) {
  exec(cmdStr,function(err,stdout,stderr){
    if(err){
      console.log('Execute ceph cmd err:' + stderr + ', cmd:' + cmdStr);
    }
    else{
      console.log('Execute ceph cmd success:' + cmdStr);
      callback(stdout);
    }
  });  
}

function getHost (cmdStr, callback) {
  exec(cmdStr,function(err,stdout,stderr){
    if(err){
      console.log('Get host list err:' + stderr + ', cmd:' + cmdStr);
    }
    else{
      console.log('Get host list success:' + cmdStr);
      callback(stdout);
    }
  });  
}

function getSnmpinfo (host, community, callback) {
  var session = new snmp.Session({ 
    host: host, 
    community: community });
  var oid = [1,3,6,1,4,1,51052,1,1];

  session.get({ oid: oid}, function(err, varbinds) {
    if(err) {
      console.log('Get SNMP info error:' + err);
    }
    else {
        //varbinds.forEach(function(vb) {
        console.log('Get SNMP info success,HOST:' + host + ',OID:' + oid);      
        //res.send(vb.oid + ' = ' + vb.value + ' (' + vb.type + ')');
        var snmpStr = snmpStr + vb.oid + ' = ' + vb.value + ' (' + vb.type + ')'
        callback(snmpStr);
    }
    session.close();
  });
}

app.get('/ceph_osd_df_tree', function (req, res) {
  getCephinfo(cmdCeph_osd_df_tree,function(ceph_osd_df_tree){
    res.send(ceph_osd_df_tree);
  });
});

app.get('/ceph_status', function (req, res) {
  getCephinfo(cmdCeph_status,function(ceph_status){
    res.send(ceph_status);
  });
});

app.get('/snmp', function (req, res) {
  getHost(cmdCeph_status,function(host) {
    var sources = JSON.parse(host);
    var hostLists = sources.quorum_names;
    hostLists.forEach(function (hostList) {
      console.log("host:" + hostList);
      getSnmpinfo(hostList, community, function(snmpInfo) {
      if(err) {
        console.log('Get SNMP info error,host:' + hostList);
      }
      else {
        console.log('snmpinfo:' + snmpInfo);
        snmpInfo += snmpInfo;
        //res.send(snmpInfo);
      }
      });
      //res.send(snmpInfo);
    });
    

  });
});

var server = app.listen(30000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});