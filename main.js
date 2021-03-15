// info 
var info = document.getElementById("info");

// 地图创建 和 基本属性 设置
var map = new BMap.Map("container");
var point = new BMap.Point(116.404, 39.915);
// 创建点坐标  
map.centerAndZoom(point, 1);
map.enableScrollWheelZoom();
map.disableDoubleClickZoom();

var select;

// 辅助函数
var range = function () {
    var bs = map.getBounds();
    var bssw = bs.getSouthWest();
    var bsne = bs.getNorthEast();
    return {'x1': bssw.lng, 'y1': bssw.lat, 'x2': bsne.lng, 'y2': bsne.lat};
}
var showPolyline =  function () {
    map.clearOverlays();
    // 按度划分格网 10°
    XY = range();
    var y1 = XY.y1 < -80 ? -90 : XY.y1;
    var y2 = XY.y2 > 80 ? 90: XY.y2;
    for (var i = XY.x1; i < XY.x2; i = i + 10) {
        var ii = Math.ceil(i / 10) * 10;
        var polyline = new BMap.Polyline([
            new BMap.Point(ii, y1),
            new BMap.Point(ii, y2)
        ], {
            strokeColor: "black",
            strokeWeight: 1,
            strokeOpacity: 0.5
        });
        map.addOverlay(polyline);
    }
    for (var i = XY.y1; i < XY.y2; i = i + 10) {
        var ii = Math.ceil(i / 10) * 10;
        if (XY.x1 < -180) {
            var polyline = new BMap.Polyline([
                new BMap.Point(XY.x1, ii),
                new BMap.Point(-180, ii)
            ], {
                strokeColor: "black",
                strokeWeight: 1,
                strokeOpacity: 0.5
            });
            map.addOverlay(polyline);
        }
        if (XY.x2 > 180) {
            var polyline = new BMap.Polyline([
                new BMap.Point(180, ii),
                new BMap.Point(XY.x2 - 360, ii)
            ], {
                strokeColor: "black",
                strokeWeight: 1,
                strokeOpacity: 0.5
            });
            map.addOverlay(polyline);
        }
        var polyline = new BMap.Polyline([
            new BMap.Point(XY.x1, ii),
            new BMap.Point(XY.x2, ii)
        ], {
            strokeColor: "black",
            strokeWeight: 1,
            strokeOpacity: 0.5
        });
        map.addOverlay(polyline);
    }
}

var addSelect = function (lng, lat) {
    map.clearOverlays();
    showPolyline();
    var x1 = Math.floor(lng / 10) * 10;
    var x2 = Math.ceil(lng / 10) * 10;
    var y1 = Math.floor(lat / 10) * 10;
    var y2 = Math.ceil(lat / 10) * 10;
    var locPoints = [
        new BMap.Point(x1, y1),
        new BMap.Point(x2, y1),
        new BMap.Point(x2, y2),
        new BMap.Point(x1, y2)
    ];
    var ply = new BMap.Polygon(locPoints, {
        strokeWeight: 1,
        strokeColor: '#FF0000'
    });
    select = ply;
    info.innerHTML = "select range, " + "longitude: " +x1 + "~" + x2 +","+ "latitude: "+ y1 +"~"+ y2;
    map.addOverlay(ply);
}

var showSelect = function () {
    if(select){
        map.addOverlay(select); 
    }
}
// 鼠标事件
map.addEventListener('click', function (e) {
    addSelect(e.point.lng, e.point.lat);
});
map.addEventListener("dragend", function () {
    showPolyline();
    showSelect();
});
map.addEventListener("zoomend", function () {
    showPolyline();
    showSelect();
});

var btnclick = function(){
    var lng = document.getElementById("lng").value;
    var lat = document.getElementById("lat").value;
    lng = parseFloat(lng);
    lat = parseFloat(lat);
    addSelect(lng, lat);
}


// 初始化格网

showPolyline();