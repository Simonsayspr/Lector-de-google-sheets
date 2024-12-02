function createHistogram(sheetName, graphTitle, data, spreadsheet) {
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  // Definir los bins y las frecuencias
  const bins = [0, 1, 2, 3, 4, 5, 6, 7];
  const frequencies = bins.map(bin => {
      return data.filter(grade => grade >= bin && grade < bin + 1).length;
  });

  // Preparar los datos para el gráfico
  const range = sheet.getRange(1, 1, bins.length, 2);
  const values = bins.map((bin, index) => [bin, frequencies[index]]);
  // Verificar si el rango coincide con la cantidad de datos
  if (values.length > 0 && values[0].length == 2) {
      range.setValues(values);
  } else {
      throw new Error('Las dimensiones de los datos no coinciden con el rango.');
  }
  range.setFontColor("#FFFFFF");
  const chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(range)
      .setOption('title', graphTitle)
      .setOption('hAxis', { title: 'Nota final' })
      .setOption('vAxis', { title: 'Frecuencia' })
      .setPosition(5,5,0,0)
      .setOption('width', 400) 
      .setOption('height', 200)
      .build();

  sheet.insertChart(chart);
}

function createAssistanceChart(sheetName, graphTitle, data, modcount, spreadsheet){
const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
const head = data[0].map((element,idx)=>{
  if(idx == 0){
    return "Bloque";
  }
  else if(idx<=modcount){
    return `M${idx}`;
  }
  else{
    return "APR"
  }
});
const table = [head].concat(data);
const range = sheet.getRange(1,10,table.length,table[0].length);
range.setValues(table);
range.setFontColor("#FFFFFF");
 const chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(range)
      .setOption('title', graphTitle)
      .setOption('hAxis', { title: 'Bloques' })
      .setOption('vAxis', { title: 'Asistencia'})
      .setPosition(5,15,0,0)
      .setOption('isStacked', true)
      .setOption('legend',{position:'top',textStyle:{fontSize:12}})
      .setOption('width', 400) 
      .setOption('height', 200)
      .setNumHeaders(1)
      .build();

  sheet.insertChart(chart);
}

function chartBlockAvg(sheetName,graphTitle,data,spreadsheet){
const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
const info = [["Bloques", "Promedios"]].concat(data);
const range = sheet.getRange(11,1,info.length,info[0].length);
range.setValues(info);
range.setFontColor("#FFFFFF");
const chart = sheet.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(range)
      .setOption('title', graphTitle)
      .setOption('hAxis', { title: 'Bloques' })
      .setOption('vAxis', { title: 'Asistencia'})
      .setPosition(15,5,0,0)
      .setOption('isStacked', true)
      .setOption('legend',{position:'top',textStyle:{fontSize:12}})
      .setOption('width', 400) 
      .setOption('height', 200)
      .setNumHeaders(1)
      .build();
    sheet.insertChart(chart);
}

function chartBlockDev(sheetName,graphTitle,data,spreadsheet){
const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
const info = [["Bloques", "Desviaciones"]].concat(data);
const range = sheet.getRange(15,11,info.length,info[0].length);
range.setValues(info);
range.setFontColor("#FFFFFF");
const chart = sheet.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(range)
      .setOption('title', graphTitle)
      .setOption('hAxis', { title: 'Bloques' })
      .setOption('vAxis', { title: 'Asistencia'})
      .setPosition(15,15,0,0)
      .setOption('legend',{position:'top',textStyle:{fontSize:12}})
      .setOption('width', 400) 
      .setOption('height', 200)
      .setNumHeaders(1)
      .build();
    sheet.insertChart(chart);
}

function correctCell(pCell, color, string, BSheet){
  const cell = BSheet.getRange(pCell[0], pCell[1]);
  cell.setBackground(color);
  cell.setNote(string);
}


function writeSummary(active, idx,modules,recuperativo,sheetAverages,studentID,studentNRC){
  let summary = active.getSheetByName("Resumen");
  if (summary != null && idx==0) active.deleteSheet(summary); //si esque ya existe una hoja resumen, la elimino y creo una nueva
  if (idx==0){summary = active.insertSheet(); summary.setName("Resumen");}
  
  writeBaseSummary(summary,idx+1,[`Módulo B-${idx+1}`,`Promedio B-${idx+1}`],sheetAverages,studentID,studentNRC,modules,recuperativo);
}

function writeBaseSummary(sheet, column, headData,sheetAverages,studentID,studentNRC,modules,recuperativo){
  const row= 1
  const head = headData;
  if (column==1) {
    ["ID","NRC"].forEach((head,idx)=>sheet.getRange(row, idx+1).setValue(head).setFontWeight("bold"));
    studentID.forEach((item,idx)=>sheet.getRange(idx+2,1).setValue(item));
    studentNRC.forEach((item,idx)=>sheet.getRange(idx+2,2).setValue(item));
  }
  head.forEach((head,idx)=>sheet.getRange(row, idx+column*2+1).setValue(head).setFontWeight("bold"));
  modules.forEach((item,idx)=>sheet.getRange(idx+2,column*2+1).setValue(item));
  sheetAverages.forEach((item,idx)=>{
    item!=0 ? sheet.getRange(idx+2,column*2+2).setValue(item):sheet.getRange(idx+2,column*2+2).setValue("")
    
    if (parseInt(item)<4 && item!=0) sheet.getRange(idx+2,column*2+2).setBackground("#FFCCCB");  //light red
  });
  if (recuperativo!=null) recuperativo.forEach((item,idx)=>{
    if (item=="Sí"){ sheet.getRange(idx+2,column*2+2).setBackground("#FFFFE0");sheet.getRange(idx+2,column*2+2).setValue(4)}  //light yellow
  });
}


function writeSummaryTail(column,spread,condition,decimas, finalMarks, averageAttendance){
  if (condition){
    let summary = spread.getSheetByName("Resumen");
    ["Promedio Final ", "Asistencia ","Décimas "].forEach((item,idx)=>summary.getRange(1, idx+column*2+5).setValue(item).setFontWeight("bold"));
    finalMarks.forEach((item,idx)=>{{summary.getRange(2+idx, column*2+5).setValue(item); if (item<4) summary.getRange(2+idx, column*2+5).setBackground("#FFCCCB")}})
    averageAttendance.forEach((item,idx)=>{{summary.getRange(2+idx, column*2+6).setValue(item); if (item<4) summary.getRange(2+idx, column*2+6).setBackground("#FFCCCB")}})
    decimas.forEach((item,idx)=>{if (idx>0)summary.getRange(2+idx-1, column*2+7).setValue(item)})      //le resto 1 a get range porque el primer item de décimas es nulo
  }
  else{
    let summary = spread.getSheetByName("Resumen");
    ["Promedio Final ", "Asistencia ","Décimas "].forEach((item,idx)=>summary.getRange(1, idx+column*2+5).setValue(item));    //si quiero hacer resize uso summary.autoResizeColumn(idx+column*2+5);
  }
}

function writeBlock(active,count,header, ID, NRC,modules,assignation,remote){
  let newBlock = active.getSheetByName(`B${count+1}`);
  newBlock = active.insertSheet(); newBlock.setName(`B${count+1}`);
  header.forEach((head,idx)=>newBlock.getRange(1, idx+1).setValue(head).setFontWeight("bold"));
  ID.forEach((item,idx)=>newBlock.getRange(idx+2, 1).setValue(item))
  NRC.forEach((item,idx)=>newBlock.getRange(idx+2, 2).setValue(item))
  modules.forEach((item,idx)=>{newBlock.getRange(idx+2, 3).setValue(item);if (assignation[idx]!=0) newBlock.getRange(idx+2, 4).setValue(assignation[idx]); else if (remote[idx]==1) newBlock.getRange(idx+2, 4).setValue("O")})
}

function writeModuleSkeleton(active,evaluationsModules){
  let moduleAnalysis = active.getSheetByName("Análisis módulos");
  if (moduleAnalysis != null) active.deleteSheet(moduleAnalysis);
  moduleAnalysis = active.insertSheet(); moduleAnalysis.setName("Análisis módulos");
  ["1era vez","2da vez"].forEach((item,idx)=>{
    if (idx==0){moduleAnalysis.getRange(1, idx+2).setValue(item).setFontWeight("bold");}
    else {moduleAnalysis.getRange(1, idx+7).setValue(item).setFontWeight("bold");}})
  moduleAnalysis.getRange(2, 1).setValue("Módulo").setFontWeight("bold")
  const info=["# Estudiantes  ", "% Aprobación Sin Recuperativo      ", "% Aprobación  ", "Promedio global   ", "% De Abandono   ", "Promedio Asistencia   "]
  info.forEach((item,idx)=>{
    moduleAnalysis.getRange(2, idx+2).setValue(item).setFontWeight("bold"); moduleAnalysis.getRange(2, idx+8).setValue(item).setFontWeight("bold")
  })
  moduleAnalysis.autoResizeColumns(2,12)
  moduleAnalysis.getRange(1,2,1,6).merge();moduleAnalysis.getRange(1,8,1,6).merge();
  moduleAnalysis.getRange(1,2,1,11).setHorizontalAlignment("center")
  moduleAnalysis.getRange(2,1,1,1).setHorizontalAlignment("center")
  evaluationsModules.forEach((item,idx)=>moduleAnalysis.getRange(3+idx, 1).setValue(item))
}

function writeModuleBlock(number,active,data){
  const moduleAnalysis = active.getSheetByName("Análisis módulos");
  data.forEach((list,idx)=>{
    list.forEach((item,i)=>{
      if ((item!=0 || i==1)&&i>0){
        if (i!=2 && i!=3 && i!=5) moduleAnalysis.getRange(idx+3,number*6+i+1).setValue(item)
        else moduleAnalysis.getRange(idx+3,number*6+i+1).setValue(`${item}%`)
        moduleAnalysis.getRange(3,1,data.length,13).setHorizontalAlignment("center")
      }
    })
  })
}

function createProffSummarySheet(active){
  if(active.getSheetByName("Resumen Profesores") != null){
    active.deleteSheet(active.getSheetByName("Resumen Profesores"));
  }
  sheet = active.insertSheet();
  sheet.setName("Resumen Profesores");
  return sheet;
}
function writeProffs(allProffs, proffSummarySheet){
  proffSummarySheet.getRange(2, 1, 1, 1).setValue("Profesor");
  allProffs.forEach((proff, index) => {
    proffSummarySheet.getRange(index+3, 1, 1, 1).setValue(proff);
  });
}

function writeProffSummary(proffSummarySheet, allProffs, proffModules, proffEstudiantes, proffPromedioAsistencia, proffPromedioGlobal, proffPorcentAprov, BSheet){
  const aux1 = proffSummarySheet.getLastColumn()+1;
  proffSummarySheet.getRange(2, aux1, 1, 1).setValue("M");
  proffModules.forEach((mod, index) => {
    if(mod != null){
      proffSummarySheet.getRange(3+index, aux1, 1, 1).setValue(mod);
    }
    else{
      proffSummarySheet.getRange(3+index, aux1, 1, 1).setValue("No realizo modulo");
    }
  });
  const aux2 = proffSummarySheet.getLastColumn()+1;
  proffSummarySheet.getRange(2, aux2, 1, 1).setValue("#Estudiantes");
  proffEstudiantes.forEach((num, index) => {
    if(num != 0){
      proffSummarySheet.getRange(3+index, aux2, 1, 1).setValue(num);
    }
    else{
      proffSummarySheet.getRange(3+index, aux2, 1, 1).setValue("NRM");
    }
  });
  const aux3 = proffSummarySheet.getLastColumn()+1;
  if (proffPromedioAsistencia != null){
    proffSummarySheet.getRange(2, aux3, 1, 1).setValue("A");
    proffPromedioAsistencia.forEach((prom, index) => {
      if(isNaN(prom)){
        proffSummarySheet.getRange(3+index, aux3, 1, 1).setValue("NRM");
      }
      else{
        proffSummarySheet.getRange(3+index, aux3, 1, 1).setValue(prom);
      }
    })
  }
  const aux4 = proffSummarySheet.getLastColumn()+1;
  proffSummarySheet.getRange(2, aux4, 1, 1).setValue("Promedio Global");
  proffPromedioGlobal.forEach((prom, index) => {
    if(isNaN(prom)){
      proffSummarySheet.getRange(3+index, aux4, 1, 1).setValue("NRM");
    }
    else{
      proffSummarySheet.getRange(3+index, aux4, 1, 1).setValue(prom);
    }
  });
  const aux5 = proffSummarySheet.getLastColumn()+1;
  proffSummarySheet.getRange(2, aux5, 1, 1).setValue("% Aprovacion");
  proffPorcentAprov.forEach((prom, index) => {
    if(isNaN(prom)){
      proffSummarySheet.getRange(3+index, aux5, 1, 1).setValue("NRM");
    }
    else{
      proffSummarySheet.getRange(3+index, aux5, 1, 1).setValue(`${prom}%`);
    }
  });
  proffSummarySheet.getRange(1,aux1,1,aux5-aux1+1).mergeAcross().setValue(BSheet.getName());
}