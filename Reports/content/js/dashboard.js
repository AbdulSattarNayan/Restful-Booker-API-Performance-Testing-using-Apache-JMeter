/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.0, "KoPercent": 10.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7594, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.994, 500, 1500, "GetBooking_ParttialUpdated_HTTP Request"], "isController": false}, {"data": [0.0, 500, 1500, "GetBooking_Deleted_HTTP Request"], "isController": false}, {"data": [0.969, 500, 1500, "GetBooking_Updated_HTTP Request"], "isController": false}, {"data": [0.994, 500, 1500, "PartialUpdateBooking _HTTP Request"], "isController": false}, {"data": [0.911, 500, 1500, "GetBooking _HTTP Request"], "isController": false}, {"data": [0.924, 500, 1500, "CreateToken _HTTP Request"], "isController": false}, {"data": [0.0, 500, 1500, "GetBookingIds_HTTP Request"], "isController": false}, {"data": [0.862, 500, 1500, "CreateBooking _HTTP Request"], "isController": false}, {"data": [0.992, 500, 1500, "DeleteBooking _HTTP Request"], "isController": false}, {"data": [0.948, 500, 1500, "UpdateBooking _HTTP Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5000, 500, 10.0, 905.7046000000008, 291, 10388, 320.0, 2496.3000000004513, 5916.349999999998, 7917.99, 374.13947919784493, 2170.526928689015, 98.50390975755761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GetBooking_ParttialUpdated_HTTP Request", 500, 0, 0.0, 331.954, 293, 1111, 313.0, 349.90000000000003, 440.84999999999997, 948.920000000001, 80.32128514056225, 71.75200803212851, 13.413027108433736], "isController": false}, {"data": ["GetBooking_Deleted_HTTP Request", 500, 500, 100.0, 313.74800000000033, 291, 1019, 310.0, 324.0, 330.95, 354.99, 83.64001338240213, 61.40810576279692, 13.967228797256608], "isController": false}, {"data": ["GetBooking_Updated_HTTP Request", 500, 0, 0.0, 359.19599999999986, 293, 1089, 318.0, 481.0, 528.9, 561.98, 75.26719855486978, 67.49821240403432, 12.569034133674545], "isController": false}, {"data": ["PartialUpdateBooking _HTTP Request", 500, 0, 0.0, 342.2800000000003, 292, 1263, 315.0, 446.90000000000003, 473.0, 852.6100000000031, 78.064012490242, 69.79837529274005, 25.462285323965652], "isController": false}, {"data": ["GetBooking _HTTP Request", 500, 0, 0.0, 404.37599999999975, 293, 1671, 336.0, 532.9000000000001, 556.9, 1088.9700000000046, 69.46373992775771, 62.34804806890803, 11.599901882467352], "isController": false}, {"data": ["CreateToken _HTTP Request", 500, 0, 0.0, 387.64599999999973, 294, 1443, 323.5, 534.0, 549.0, 570.99, 72.34843003906816, 54.63097778903198, 17.875149218636956], "isController": false}, {"data": ["GetBookingIds_HTTP Request", 500, 0, 0.0, 5755.910000000002, 2579, 10388, 5910.5, 7917.9, 8746.95, 10000.95, 47.125353440150796, 2374.589125824694, 6.442919415645617], "isController": false}, {"data": ["CreateBooking _HTTP Request", 500, 0, 0.0, 463.46199999999976, 296, 1752, 421.5, 609.4000000000002, 662.95, 1695.92, 65.75486586007365, 60.889519496317725, 30.373097218569175], "isController": false}, {"data": ["DeleteBooking _HTTP Request", 500, 0, 0.0, 324.9140000000001, 293, 1038, 312.0, 335.0, 353.74999999999994, 892.8600000000001, 82.38589553468447, 60.247260668973475, 22.849213214697645], "isController": false}, {"data": ["UpdateBooking _HTTP Request", 500, 0, 0.0, 373.56, 293, 1376, 320.0, 504.60000000000014, 543.0, 562.96, 73.69196757553426, 66.07924189388356, 37.997420781134856], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 500, 100.0, 10.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5000, 500, "404/Not Found", 500, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["GetBooking_Deleted_HTTP Request", 500, 500, "404/Not Found", 500, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
