function ExportToExcel(table,header,excelformat =''){  
    this.tableBody = table;
    this.excelFormatData= excelformat;
    this.header = header;

}

ExportToExcel.prototype.generate = function(){
    let header = "<thead> <tr>";
    this.header.forEach(function(item){
        header = header + "<td>" +item.text +"</td>";
    })
    header = header +"</tr> </thead>";
    this.excelFormatData = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
    this.excelFormatData = this.excelFormatData + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
    this.excelFormatData = this.excelFormatData + '<x:Name>Test Sheet</x:Name>';
    this.excelFormatData = this.excelFormatData + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
    this.excelFormatData = this.excelFormatData + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body> <table>';
    this.excelFormatData = this.excelFormatData +  header;
    this.excelFormatData = this.excelFormatData +  this.tableBody;
    this.excelFormatData = this.excelFormatData + '</table></body></html>';
    console.log(this.header);
    console.log("header");


}
ExportToExcel.prototype.download = function(){
    const link = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    //For IE
    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        if (window.navigator.msSaveBlob) {
        var blob = new Blob([tab_text], {
            type: "application/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, 'report.xls');
        }
    }
    //for Chrome and Firefox 
    else {
        link.setAttribute('href', data_type + ', ' + encodeURIComponent(this.excelFormatData));
        var timeStamp = Math.floor(Date.now()/1000);
        link.setAttribute('download', 'Report_' + timeStamp + '.xls');
        link.click();
        link.remove;
    }  


};

module.exports = ExportToExcel