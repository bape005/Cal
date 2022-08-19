

const employees = [];

$(document).ready(function() {
    
    // window.documentMode.getDocuments();
    //console.log(data);

    
    //$('#spanVersion').html(data);

    /*document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
        const isDarkMode = await window.darkMode.toggle()
        document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
    })
    
    document.getElementById('reset-to-system').addEventListener('click', async () => {
        await window.darkMode.system()
        document.getElementById('theme-source').innerHTML = 'System'
    })*/
    

    $('#btnLeerDocumento').on('click', function(){
       // window.documentMode.readDocuments({name: 'Elgar Bautista'});
        //ipcRenderer.send('documento:new', {name:'Elgar Bautista'});
        window.documentMode.getDocuments()
                .then((data) => {
                    console.log(data); // Testing
                    var dataGrid = $('#dataGrid').dxDataGrid('instance');
                       dataGrid.option("dataSource", data);
                   // document.getElementById("main-content").innerText = data.toString();
                });
    });

    $("#dataGrid").dxDataGrid({
        dataSource: employees,
        keyExpr: "ID",
        allowColumnResizing: true,
        filterRow: { visible: true },
        searchPanel: { visible: true },

        toolbar: {
            items: [
                "groupPanel",
                {
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: "Directorio",
                        width: 136,
                        onClick(e) {
                            //window.documentMode.openExplorer();
                            window.documentMode.openExplorer()
                                .then((data) => {
                                    $('#aPathDirectory').html(data);
                                });
                            /*const expanding = e.component.option("text") === "Expand All";
                            dataGrid.option("grouping.autoExpandAll", expanding);
                            e.component.option("text", expanding ? "Collapse All" : "Expand All");*/
                        },
                    },
                },
                {
                    name: "addRowButton",
                    showText: "always"
                },
                "exportButton",
                "columnChooserButton",
                "searchPanel"
            ]
        },

        selection: { mode: "single" },
        onSelectionChanged: function(e) {
            e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
                if(employee) {
                    $("#selected-employee").text(`Selected employee: ${employee.FullName}`);
                }
            });
        },

        export: {
            enabled: true,
            formats: ['xlsx']
        },
        onExporting(e) {
            if (e.format === 'xlsx') {
                const workbook = new ExcelJS.Workbook(); 
                const worksheet = workbook.addWorksheet("Main sheet"); 
                DevExpress.excelExporter.exportDataGrid({ 
                    worksheet: worksheet, 
                    component: e.component,
                }).then(function() {
                    workbook.xlsx.writeBuffer().then(function(buffer) { 
                        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "DataGrid.xlsx"); 
                    }); 
                }); 
                e.cancel = true;
            } 
            else if (e.format === 'pdf') {
                const doc = new jsPDF();
                DevExpress.pdfExporter.exportDataGrid({
                    jsPDFDocument: doc,
                    component: e.component,
                }).then(() => {
                    doc.save('DataGrid.pdf');
                });
            }
        },

        headerFilter: {
            visible: true,
        },

        allowColumnReordering: true,

        columnChooser: { 
            enabled: true,
            mode: "select" 
        },

        columns: [
            {
                dataField: "ID",
                width: 50
            }, 
            {
                dataField: "Nombre",
                width: 400
            },
            {
                dataField: "LibretaMar",
                width: 160
            },
            {
                dataField: "Origen"
            },
            {
                dataField: "Destino"
            },
            {
                dataField: "Solicitud",
                visible: false
            },
            {
                dataField: "Vigencia",
                width: 100
            },
            {
                dataField: "Servicio",
                visible: false
            },
            {
                dataField: "Itinerario"
            },
            {
                dataField: "FechaHoraSalida"
            },
        ],

    });

});