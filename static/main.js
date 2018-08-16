var vip = "";
var view = "";
var vipInput = document.getElementById("vip");
var viewNameInput = document.getElementById("view-name");
var checkBtn = document.getElementById("check");

vipInput.addEventListener("keypress", function (event) {
    if (event.which === 13) {
        vip = vipInput.textContent;
    }
});

viewNameInput.addEventListener("keypress", function (event) {
    if (evnet.which === 13) {
        view = viewNameInput.textContent;
    }
});

checkBtn.addEventListener("click", function () {


});

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync("/ceph_status", function (response) {
    var json = JSON.parse(response);
    var info = "status:" + json.health.status + "\n";
    var mons = json.monmap.mons;
    mons.forEach(function (mon) {
        info += mon.addr + "\n";
    });
    info += "num osds: " + json.osdmap.osdmap.num_osds +
        " num up: " + json.osdmap.osdmap.num_up_osds +
        " num in: " + json.osdmap.osdmap.num_in_osds + "\n";
    document.getElementById("ceph-status").textContent = info;
})