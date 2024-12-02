
function onOpen() {
    // Obtiene una referencia a la interfaz de Spreadsheet
    const ui = SpreadsheetApp.getUi();
    
    // Crea un nuevo menú en la toolbar de Google Spreadsheets
    // Para cada item se indica el nombre y la función a la cual llamar cuando se selecciona
    ui.createMenu('Menú')
        .addItem('Verificar promedios', 'verifyAverage')
        .addItem('Generar resumen', 'createSummary')
        .addItem('Graficos', 'createGraphs')
        .addItem('Próximo bloque','createNextBlock')
        .addItem('Análisis módulos','createModuleAnalysis')
        .addItem('Resumen profesores', 'createProffSummary')
        .addToUi();
}

function verifyAverage() {
    const evaluations = getEvaluations(SpreadsheetApp.getActiveSpreadsheet());
    const ponderations = readPonderation(SpreadsheetApp.getActiveSpreadsheet());

    getBSheets(SpreadsheetApp.getActiveSpreadsheet()).forEach((BSheet,idx) => {
        const sheetEvaluations = getSheetEvaluations(BSheet);
        const modules = getModules(BSheet);
        const colNotaPreliminar = getColNotaPreliminar(BSheet);
        const colNotaFinal = getColNotaFinal(BSheet);
        const grades = getGrades(BSheet);
        const colRecuperativo = getColRecuperativo(BSheet);
        //console.log("IDX="+(idx+1));
        //console.log(sheetEvaluations);
        //console.log(evaluations);
        //console.log(modules);
        const sheetAverages = calculateAverage(modules, grades, evaluations, sheetEvaluations, ponderations);
        //console.log(sheetAverages);
        const toCorrectPreliminar = preliminarAnotate(sheetAverages, colNotaPreliminar, sheetEvaluations.length);
        toCorrectPreliminar.forEach((element) => {correctCell(element["Cell"], element["Color"], element["String"], BSheet)});
        const toCorrectFinal = finalAnotate(sheetAverages, colNotaFinal, sheetEvaluations.length, colRecuperativo);
        toCorrectFinal.forEach((element) => {correctCell(element["Cell"], element["Color"], element["String"], BSheet)});
    });
}

function validateLength() {
    // Obtenemos la hoja activa, es decir, la hoja que tiene seleccionado el usuario
    const activeSheet = SpreadsheetApp.getActiveSheet();
    // Obtenemos las celdas de la primera columna (función en readSheets.js)
    const firstCol = getColumn(activeSheet, 1);
    blankBackground(activeSheet)(firstCol);
    warningBackground(activeSheet)(checkMaxLength(firstCol, 5));
}

function addLengthCol() {
    const activeSheet = SpreadsheetApp.getActiveSheet();
    writeColumn(activeSheet, calcCellLength(getColumn(activeSheet, 1)), 2);
}

function createSummary(){
    const spread=SpreadsheetApp.getActiveSpreadsheet();
    const BSheetList=getBSheets(spread);
    const ponderations = readPonderation(spread);
    const evaluations=getEvaluations(spread);
    BSheetList.forEach((BSheet,idx) => {
      const modules = getModules(BSheet);
      const recuperativo = getColRecuperativo(BSheet);
      const sheetEvaluations = getSheetEvaluations(BSheet);
      const grades = getGrades(BSheet);
      const sheetAverages = calculateAverage(modules, grades, evaluations, sheetEvaluations, ponderations);
      const studentID=getStudentID(BSheet);
      const studentNRC=getStudentNRC(BSheet);
      writeSummary(spread,idx,modules,recuperativo,sheetAverages,studentID,studentNRC); 
    });
    const bonusNames=getBonusNames(spread);
    const decimas=getDecimas(BSheetList,bonusNames);
    const decimasTotales=calculateAllBonus(decimas);
    const preSummaryAprobation=getPreSummaryAprobation(spread,BSheetList.length)
    const moduleCount=getModuleCount(spread);
    const attendance=getAttendance(BSheetList);
    const averageAttendance=calculateAverageAttendance(attendance,evaluations);
    writeSummaryTail(BSheetList.length-1,spread,false,decimasTotales, null, averageAttendance);
    const allMarks=getPreSummary(spread);
    const aprobated=aprobationList(preSummaryAprobation,moduleCount)
    const finalMarks=calculateFinalAverage(allMarks,aprobated)
    writeSummaryTail(BSheetList.length-1,spread,true,decimasTotales,finalMarks, averageAttendance);    //Lo pongo 2 veces porque si no algunos datos fallan
}


function createGraphs() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const graph = spreadsheet.getSheetByName("Graficos");
  if(graph != null){
    spreadsheet.deleteSheet(graph);
  }
  let summary = spreadsheet.getSheetByName("Resumen");
  if (!summary) {
      createSummary();
      summary = spreadsheet.getSheetByName("Resumen");
      try {
      const data = getResColPromFinal(summary);
      createHistogram("Tabla", "Notas Finales", data, spreadsheet);
  } catch (error) {
      Logger.log(error.message);
      SpreadsheetApp.getUi().alert(error.message);
  }
      spreadsheet.deleteSheet(summary);
  }
  else{
    try {
      const data = getResColPromFinal(summary);
      createHistogram("Graficos", "Notas Finales", data, spreadsheet);
  } catch (error) {
      Logger.log(error.message);
      SpreadsheetApp.getUi().alert(error.message);
  }
}
  const allModules = getBSheets(SpreadsheetApp.getActiveSpreadsheet()).map(BSheet => {
return getModules(BSheet);
});
const modcount = getModuleCount(spreadsheet);
const students = allModules.map((element, index) => {
const BSheetName = getBSheets(SpreadsheetApp.getActiveSpreadsheet())[index].getName(); 
return [BSheetName, ...listStudPerMod(element,modcount)];
});
createAssistanceChart("Graficos","Asistencia",students,modcount,spreadsheet);
const finalGrade = getBSheets(spreadsheet).map(BSheet=>{
return getColNotaFinal(BSheet)});
const finalAvrg = finalGrade.map((element, index) => {
const BSheetName = getBSheets(SpreadsheetApp.getActiveSpreadsheet())[index].getName(); 
return [BSheetName, blockAvrg(element)];
});
chartBlockAvg("Graficos", "Promedios", finalAvrg, spreadsheet);
const finalDev = finalGrade.map((element, index) => {
const BSheetName = getBSheets(SpreadsheetApp.getActiveSpreadsheet())[index].getName(); 
return [BSheetName, blockDev(element)];
});
chartBlockDev("Graficos","Desviaciones",finalDev,spreadsheet);
}

function createNextBlock(){
    const selection=SpreadsheetApp.getUi().alert('Al crear un nuevo bloque, este se basará completamente en el bloque previo', SpreadsheetApp.getUi().ButtonSet.OK_CANCEL);
    if(selection == SpreadsheetApp.getUi().Button.OK){
      const spread=SpreadsheetApp.getActiveSpreadsheet();
      const BSheetList=getBSheets(spread);
      const lastBSheet=BSheetList[BSheetList.length -1];
      const header=getBsheetFirstRow(lastBSheet);
      const ID=getStudentID(lastBSheet),NRC=getStudentNRC(lastBSheet);
      const moduleCount=getModuleCount(spread);
      const allModules=getAllModules(BSheetList);
      const lastModules=allModules[allModules.length-1];
      const lastMarks=getColNotaFinal(lastBSheet);
      const modules=calculateNextModule(moduleCount,lastModules,lastMarks);
      const remote=verifyRemote(allModules,modules);
      const professors=getProfessors(lastBSheet);
      const assignation=assignProffesors(professors,modules,remote)
      writeBlock(spread,BSheetList.length,header,ID,NRC,modules,assignation,remote);
    }
  }

function createModuleAnalysis(){
  const spread=SpreadsheetApp.getActiveSpreadsheet();
  const BSheetList=getBSheets(spread);
  const moduleCount=getModuleCount(spread)
  const data=getModulesAttendanceRecuperativeFinal(BSheetList);
  const ocurrence1=getModuleOcurrence(1,data,moduleCount);      //aquí se puede modificar la cantidad de veces que dio el módulo el alumno
  const ocurrence2=getModuleOcurrence(2,data,moduleCount);
  const ocurrences=[ocurrence1,ocurrence2];                     //esta lista sería más grande si quiero ver lás cantidades de veces que se dió el módulo
  const evaluationsModules=getEvaluationsModules(spread);
  writeModuleSkeleton(spread,evaluationsModules)
  ocurrences.forEach((ocurrence,counter)=>writeModuleBlock(counter,spread,ocurrence))
  }

function createProffSummary(){

  const BSheets = getBSheets(SpreadsheetApp.getActiveSpreadsheet());
  //console.log(getAttendance(BSheets)[4]);
  const allProffs = getAllProfessors(BSheets);
  //console.log(allProffs);
  const proffSummarySheet = createProffSummarySheet(SpreadsheetApp.getActiveSpreadsheet());
  const blocksAttendanceList = getAttendance(BSheets);
  writeProffs(allProffs, proffSummarySheet);

  BSheets.forEach((BSheet, index) => {
      console.log(BSheet.getName());
      const proffModules = allProffs.map((proff) => findModule(proff, BSheet)); //si es null, no construir el bloque, dejar vacio?
      console.log(proffModules);
      const proffEstudiantes = allProffs.map((proff) => getNumEstudiantes(proff, BSheet));
      console.log(proffEstudiantes);
      const proffPromedioAsistencia = allProffs.map((proff) => getPromedioAsistencia(proff, BSheet, blocksAttendanceList[index])); //Si es null, saltarse la columna promedio
      console.log(proffPromedioAsistencia);
      const proffPromedioGlobal = allProffs.map((proff) => getPromedioGlobal(proff, BSheet));
      console.log(proffPromedioGlobal);
      const proffPorcentAprov = allProffs.map((proff) => getPorcentAprov(proff, BSheet));
      console.log(proffPorcentAprov);
      writeProffSummary(proffSummarySheet, allProffs, proffModules, proffEstudiantes, proffPromedioAsistencia, proffPromedioGlobal, proffPorcentAprov, BSheet);
  });
}