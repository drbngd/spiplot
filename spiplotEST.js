//coding for add data and add row button
function createCell(cell, text, style) {
    var div = document.createElement('div'), //create a div element
        txt = document.createTextNode(text);
    div.appendChild(txt);
    div.setAttribute('class', style);
    div.setAttribute('className', style);
    cell.appendChild(div);
}

document.getElementById('addcol').addEventListener('click', 
function addCol() {
    var tbl_ref =  document.getElementById('inputTB'),
    i;
    for (i = 0; i < tbl_ref.rows.length; i++) {
        createCell(tbl_ref.rows[i].insertCell(tbl_ref.rows[i].cells.length), '-', 'col');
    } 
    editTB();
    updatePlot();
});

document.getElementById('addrow').addEventListener('click',
function addRow() {
    var tbl_ref =  document.getElementById('inputTB'), 
        row = tbl_ref.insertRow(tbl_ref.rows.length),
        i;
    //inserting cells to new row
    for (i = 0; i < tbl_ref.rows[0].cells.length; i++) {
        createCell(row.insertCell(i), '-', 'row');
    }
    editTB();
   updatePlot();
});

document.getElementById('delrow').addEventListener('click',
function deleteRows() { // delete table rows with index greater then 0
    var tbl = document.getElementById('inputTB'), // table reference
        lastRow = tbl.rows.length - 1;             // set the last row index

    //deletes last row if row index is greater than 1
    if (lastRow > 1) {
        tbl.deleteRow(lastRow);
    }
});

document.getElementById('delcol').addEventListener('click', 
function deleteColumns() {// delete table columns with index greater then 0
    var tbl = document.getElementById('inputTB'), // table reference
        lastCol = tbl.rows[0].cells.length - 1;   // set the last column index
    
    //deletes last column if index is greater than 3
    if (lastCol > 3) {
        for (var i = 0; i < tbl.rows.length; i++) {
            tbl.rows[i].deleteCell(lastCol);
        }
    }
});

//coding for making the table element editable
function editTB() {
    var table = document.getElementById('inputTB');
    var cellsNum = table.getElementsByTagName('td');
    for (var i = 0; i < cellsNum.length; i++) {
        cellsNum[i].onclick = function() {
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.value = this.innerHTML;
            input.innerHTML = '';
            input.style.width =  (this.offsetWidth /* - (this.clientLeft * 2) */) + 'px';
            input.style.height =  (this.offsetHeight/*  - (this.clientTop * 2) */) + 'px';
            input.style.border = '0px';
            input.style.fontFamily = 'inherit';
            input.style.fontSize = 'inherit';
            input.style.textAlign = 'inherit';
            input.style.backgroundColor = 'LightGoldenRodYellow';

            input.onblur = function() {
                var td = input.parentElement;
                var orig_txt = input.parentElement.getAttribute('data-text');
                var current_txt = this.value;

                if (orig_txt != current_txt) {
                    //checks for changes in the cell's text
                    //save to db with Ajax
                    td.removeAttribute('data-clicked');
                    td.removeAttribute('data-text');
                    td.innerHTML = current_txt;
                    td.style.cssText = 'padding: 5px';
                    console.log(orig_txt + ' is changed to ' + current_txt);
                } else {
                    td.removeAttribute('data-clicked');
                    td.removeAttribute('data-text');
                    td.innerHTML = orig_text;
                    td.style.cssText = 'padding: 5px';
                    console.log('No Changes');
                }
            }

            input.onkeypress = function() {
                if (event.keyCode == 13){
                    this.blur();
                }
            }
            this.innerHTML = '';
            this.style.cssText = 'padding 0px 0px';
            this.append(input);
            this.firstElementChild.select();

        }
    } 
    updatePlot();  
}

//coding for the displaying the chart element on the homepage
const CHART = document.getElementById('spiPLOT');
//console.log(CHART);
var myRadarChart = new Chart(CHART, {
    type: 'radar',
    data: {
        labels: [],
        datasets: [{
            label: "AROMA 1",
            backgroundColor: "rgba(0,0,200,0.2)",
            borderColor: '#00FFFF',
            borderWidth: 2,
            data: []
        }, {
            label: "AROMA 2",
            backgroundColor: 'rgba(0,0,200,0.1)',
            borderColor: '#00FF00',
            borderWidth: 2,
            data: []
        }, {
            label: 'AROMA 3',
            backgroundColor: 'rgba(255,0,120,0.2)',
            borderColor: '#FD0052',
            borderWidth: 2,
            data: []
        }]
    },
    options: {
        dragData: true,
        dragDataRound: 0,
        dragOptions: {
          showTooltip: true
        },
        onDragStart: function(e) {
           console.log(e)
        },
        onDrag: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing'
          console.log(datasetIndex, index, value)
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'default' 
          console.log(datasetIndex, index, value)
        },
        hover: {
          onHover: function(e) {
            const point = this.getElementAtEvent(e)
            if (point.length) e.target.style.cursor = 'grab'
            else e.target.style.cursor = 'default'
          }
        },
        scale: {
          ticks: {
            max: 100,
            min: 0,
            stepSize: 5
          }
        }
    }
    
});


//function returns an empty 2D array
function getNull2d(arr) {
    for (let i = 0; i <= 1; i++){
        arr[i] = [];
        for (let j = 0; j <= 0; j++) {
            arr[i][j] = null;
        }
    }
    arr[0] = [];
    arr[1] = [];
    console.log(arr);
}

//code to get data from the HTML table
var indata = [''];
var coldata = [''];

//function to store table data
function updatePlot() {
    indata = [];
    // console.log(indata)
    // getNull2d(indata);
    // console.log(indata);
    var table = document.getElementById('inputTB');
    var lim = table.getElementsByTagName('td').length;
    var alldata = table.getElementsByTagName('td');
    for (let i = 0; i < lim; i++) {
        indata.push(alldata[i].innerHTML);
    }
    //console.log(indata);
    coldata = getColumns(indata, 'inputTB');
    console.log(coldata);
    //console.log(coldata.length);
    //updateChart(myRadarChart, coldata);
}
//function to arrange the indata array columnwise
function getColumns(arr, tbname) {
    var table = document.getElementById(tbname);
    var row = table.getElementsByTagName('tr').length;
    var column = table.getElementsByTagName('tr')[0].getElementsByTagName('td').length;
    console.log("Creating table ", tbname, "with dims", row + ';' + column)
    var arr1 = [];
    getArray(arr1, column, row);
    for (let i = 0; i < column; i++) {
        for (let j = 0; j < row; j++) {
            arr1[i][j] = arr[i+j*column];
        } 
    }
    return arr1;
}
//function to create custom array
function getArray(arr, row, column) {
    for (let i = 0; i < row; i++) {
        arr[i] = [];
        for (let j = 0; j < column; j++) [
            arr[i][j] = 0
        ]
    }
}

//random color generator functions
function getRandomRGBA() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.2 + ')';
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  document.getElementById('plot').addEventListener('click', 
    function updateChart() {
        updatePlot();
        calcAromaValues();

        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < unq_descriptors.length; i++) {
                myRadarChart.data.datasets[j].data[i] = display_data[i][j+1];
            }
        }
        myRadarChart.data.labels = unq_descriptors; //updates the axis
        myRadarChart.update();

}
  );

//calculates aroma values to be displayed
//weight is assummed to be 0.5 for secondary and third descriptors
//aroma is a 2D array with 3 columns
var display_data = [];
var unq_descriptors = [];
function calcAromaValues() {
    updatePlot();
    var descriptors = []; //to store all the descriptors
    unq_descriptors = []; //to store unique descriptors
    var aroma_val = []; //to store flow rate factor for each descriptor
    var cumaroma_val = [];
    var scalingfactor = 0;
    var scaledaroma_val = [];
    display_data = []; 

    getNull2d(descriptors);
    getArray(descriptors, 8, 3);
    getNull2d(aroma_val);
    getArray(aroma_val, (8*3), 3);
    getNull2d(cumaroma_val);
    
    var gdataStartIdx = 5; //column index in the gdata where primary descriptor is mentioned
    for (var j = 0; j < 8; j++){
        for (var i = 0; i < 3; i++){
            descriptors[j][i] = coldata[(i+5)][(j+1)];
        }
    }
    console.log('Descriptors');
    console.log( descriptors);
    for (let j = 0; j < 3; j++){
        for (let i = 0; i < (8*3); i+=3) {
            aroma_val[i][j] = 100*(coldata[9+j][i/3+1]-coldata[2][i/3+1]+1)/(coldata[4][i/3+1]-coldata[2][i/3+1]+1);
            if (coldata[8][i/3+1] == 'n' || coldata[8][i/3+1] == 'N'){
                aroma_val[i+1][j] = 0;
                aroma_val[i+2][j] = 0;
                descriptors[i/3][1] = '-';
                descriptors[i/3][2] = '-';
                continue;
            }
            aroma_val[i+1][j] = 100*0.5*Math.max(0, (coldata[9+j][i/3+1]-coldata[2][i/3+1]+1)/(coldata[4][i/3+1]-coldata[2][i/3+1]+1));
            aroma_val[i+2][j] = 100*0.5*Math.max(0, (coldata[9+j][i/3+1]-coldata[2][i/3+1]+1)/(coldata[4][i/3+1]-coldata[2][i/3+1]+1));
        }
    }
    console.log(aroma_val);

    //getting unique descriptor values values from gdata
    for (let i = 0; i < 8; i++){
        for(let j = 0; j < 3; j++){
            if ((!Boolean(unq_descriptors.indexOf(descriptors[i][j])+1)) && (descriptors[i][j] !== '-')){
                console.log('Begin loop');
                console.log(!(descriptors[i][j] in unq_descriptors) + '' + (descriptors[i][j] !== '-'))
                unq_descriptors.push(descriptors[i][j]);
                console.log('Adding' + descriptors[i][j]);
            }
        }
    }
    console.log("unq desc" );
    console.log( unq_descriptors);
    var linear_desc = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 3; j++) {
            linear_desc.push(descriptors[i][j]);
        }
    }
    console.log('linear');
    console.log(linear_desc);

    //getting cumulative values for the descrptors
    getArray(cumaroma_val, unq_descriptors.length, 3);
    for (let j = 0; j < 3; j++){
        for (let i = 0; i < unq_descriptors.length; i++){
            var sum = 0;
            for (let k = 0; k < (8*3); k++) {
                if ((unq_descriptors[i] === linear_desc[k])) {
                   sum+=aroma_val[k][j]; 
                }
            cumaroma_val[i][j] = sum;  


            }
        }
    }
    // console.log('cumu aroma val');
    // console.log(cumaroma_val);
    var maxRow = cumaroma_val.map(function(row){ return Math.max.apply(Math, row); });
    scalingfactor = Math.max.apply(null, maxRow);
    //console.log('Scaling Factor' + scalingfactor);

    //getting scaled values
    getNull2d(scaledaroma_val);
    getArray(scaledaroma_val, cumaroma_val.length, 3);
    for (let i = 0; i < cumaroma_val.length; i++){
        for (let j = 0; j < 3; j++){
            scaledaroma_val[i][j] = (cumaroma_val[i][j]/scalingfactor)*100;
        }
    }
    //console.log(scaledaroma_val);



    //adding data to display_data
    getNull2d(display_data);
    getArray(display_data, unq_descriptors.length, 4);
    for (let i = 0; i < unq_descriptors.length; i++) {
        display_data[i][0] = unq_descriptors[i];
    }
    for (let i = 0; i < display_data.length; i++){
        for (let j = 1; j < 4; j++){
            display_data[i][j] = scaledaroma_val[i][j-1];
        }
    }
    //console.log(display_data);
}
      
document.addEventListener('DOMContentLoaded', ()=>{
    editTB();
    updatePlot();     
});
