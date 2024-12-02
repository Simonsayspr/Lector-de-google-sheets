function readPonderation(activeSpreadsheet){
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Evaluaciones");
  let lastRow = sheet.getLastRow()
  let lastColumn = sheet.getLastColumn()
  let data = sheet.getRange(2,1,lastRow-1,lastColumn).getValues()
  // el 2 de la columna estaba como 1
  //Logger.log(data)
  return data;
}

function getSheetEvaluations(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Preliminar");
  const sheetEvaluations = BSheet.getRange(1, 5, 1, (index+1)-5).getValues()[0];
  return sheetEvaluations;
}

function getStudentID(BSheet){
  let ID = BSheet.getRange(2, 1, BSheet.getLastRow()-1, 1).getValues();
  ID = ID.reduce((a, b) => a.concat(b), []);
  return ID;
}

function getStudentNRC(BSheet){
  let NRC = BSheet.getRange(2, 2, BSheet.getLastRow()-1, 1).getValues();
  NRC = NRC.reduce((a, b) => a.concat(b), []);
  return NRC;
}

function getModules(BSheet){
  let modules = BSheet.getRange(2, 3, BSheet.getLastRow()-1, 1).getValues();
  modules = modules.reduce((a, b) => a.concat(b), []);
  //console.log(modules);
  return modules;
}

function getEvaluationsModules(activeSpreadsheet){
  const sheet = activeSpreadsheet.getSheetByName("Evaluaciones");
  let modules = sheet.getRange(2, 1, sheet.getLastRow()-1, 1).getValues();
  modules = modules.reduce((a, b) => a.concat(b), []);
  return modules;
}

function getEvaluations(activeSpreadsheet){
  const sheet = activeSpreadsheet.getSheetByName("Evaluaciones");
  const data = sheet.getRange(1, 2, 1, sheet.getLastColumn()-1).getValues()[0];
  return data;
}

function getModuleCount(activeSpreadsheet){
const sheet = activeSpreadsheet.getSheetByName("Evaluaciones");
const data = parseInt(sheet.getRange(sheet.getLastRow(), 1, sheet.getLastRow(), 1).getValues()[0]);
return data;
}

function getBSheets(activeSpreadsheet){
  const Sheets = activeSpreadsheet.getSheets();
  const BSheets = Sheets.filter((element) => ((element.getName())[0] == "B")).toSorted((Sheet1, Sheet2) => parseInt(Sheet1.getName()[1]) - parseInt(Sheet2.getName()[1]));
  //const BSheetsSorted = BSheets.sort((element) => element.getName())
  //BSheets.forEach((element) => {console.log(element.getName());});
  return BSheets;
}

function getGrades(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Preliminar");
  const grades = BSheet.getRange(2, 5, BSheet.getLastRow()-1, (index+1)-5).getValues();
  return grades;
}
/*
function getColNotaPreliminar(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Preliminar");
  const aux = BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues();
  const colNotaPreliminar = aux.map(row => Math.round((row[0])*10)/10);
  return colNotaPreliminar;
}
*/
function getColNotaPreliminar(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Preliminar");
  const aux = BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues();
  const colNotaPreliminar = aux.map(row => {
    if(row[0] != ''){
      return Math.round((row[0])*10)/10;
    }
    else{
      return '';
    }
  });
  return colNotaPreliminar;
}

function getColNotaFinal(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Final");
  const aux = BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues();
  const colNotaFinal = aux.map(row => {
    if(row[0] != ''){
      return Math.round((row[0])*10)/10;
    }
    else{
      return '';
    }
  });
  return colNotaFinal;
}

function getFinalMarkAndModules(BSheetList){
  const array=[];
  BSheetList.forEach((BSheet,idx)=>{
    const modules=BSheet.getRange(2, 3, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    const final=BSheet.getRange(2, BSheet.getLastColumn(), BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    combination=modules.concat(final)
    if (idx==0) array[0]=combination;
    else array[0].push(combination);
  })
  return array    //es de la forma [[módulos][notas][módulos]...]
}

function getAllModules(BSheetList){
  let array=[]
  BSheetList.forEach((BSheet,idx)=>{
    const modules=BSheet.getRange(2, 3, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    if (idx==0) array[0]=modules;
    else array.push(modules);
  })
  return array
}

function getColRecuperativo(BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Aprueba Recuperativo");
  if(index == -1){
      return null;
  }
  else{
      const colRecuperativo = BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues();
      return colRecuperativo;
  }
}
function getResColPromFinal(summary) {
  const headers = summary.getRange(1, 1, 1, summary.getLastColumn()).getValues()[0];
  const index = headers.indexOf("Promedio Final ");

  if (index === -1) {
      throw new Error('Columna "Promedio Final" no encontrada.');
  }

  const aux = summary.getRange(2, index+1, summary.getLastRow()-1, 1).getValues();
  const colPromFinal = aux.map(row => Math.round((row[0]) * 10) / 10);
  return colPromFinal;
}

function getBsheetFirstRow(BSheet){
  return BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0];
}

function getPreSummary(spread){
const sheet = spread.getSheetByName("Resumen");
const sheetInfo= sheet.getRange(2, 3, sheet.getLastRow()-1, sheet.getLastColumn()-4).getValues();
const sheetMarks=sheetInfo.map((item)=>item.filter((mark,idx)=>idx%2==1))
return sheetMarks
}

function getPreSummaryAprobation(spread,index){
const sheet = spread.getSheetByName("Resumen");
const sheetInfo= sheet.getRange(2, index*2+1, sheet.getLastRow()-1, 2).getValues();
return sheetInfo;
}

function getAttendance(BSheetList){
  let attendance=BSheetList.map((BSheet)=>{
    const index=BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("A");
    if(index == -1){
        return null;
    }
    else{
        const colAttendance = BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues();
        return colAttendance;
        }
  })
  return attendance;
}

function getBonusNames(activeSpreadsheet){    //retorna todas las evaluaciones y los módulos, y pone true si la evaluación da décimas
const sheet = activeSpreadsheet.getSheetByName("Evaluaciones");
const modules = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
const names=modules.map((list,idx)=>{
  if (idx!=0){
    const verification=list.map((item,idx)=>{
      if (item=="Décimas") return true;
      else if(idx==0) return item;
      else return false;
    });
    return verification;
  }
  else{
    return list;
  }
})
return names;
}

function getDecimas(BSheetList,names){
let decimas=BSheetList.map((BSheet)=>{
  const data=BSheet.getRange(1,1 , BSheet.getLastRow(), BSheet.getLastColumn()).getValues();
  const filtered=data.map((list,idx)=>{
    if (idx!=0){
      return(list.map((item,i)=>{
        if (i>=4 && i<list.length-4 && list[2]!="APR"){
          const position=names[0].indexOf(data[0][i])
          if (names[parseInt(list[2])][position]&&item!="") return item
          else return 0;}
        else return 0;
        }))
      }
    else return list;
  });
  return filtered;
  })
  return decimas;
}

function getProfessors(BSheet){
  const professors=BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues();
  let professorList=[]
  professors.forEach((item)=>{if (!professorList.includes(item[0]) && item[0].includes("P")) professorList.push(item[0])});
  return professorList;
}

function getAllProfessors(BSheets){
  allProff = BSheets.reduce((Acc, BSheet, index) => {
    const aux = getProfessors(BSheet);
    aux.forEach((proff) => {
      //console.log(proff);
      if(Acc.includes(proff) == false){
        //console.log(Acc);
        Acc = Acc.concat(proff);
      }
    });
    return Acc;
  }, []).toSorted((p1, p2) => parseInt(p1[1]) - parseInt(p2[1]));
  return allProff;
}

function findModule(proff, BSheet){
  const aux = BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
  //console.log(aux);
  if(aux.indexOf(`${proff}`) != -1){
    return BSheet.getRange(aux.indexOf(`${proff}`)+2, 3, 1, 1).getValues()[0][0];
  }
  else{
    return null;
  }
}

function getNumEstudiantes(proff, BSheet){
  const NumEstudiantes = BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues().filter((row) => {
    if(row[0] == proff){
      return true
    }
  });
  return NumEstudiantes.length;
}


function getPromedioAsistencia(proff, BSheet, blocksAttendance){
  const colProffs = BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues();
  if(blocksAttendance != null){
    const aux = blocksAttendance.filter((row, index) => {
      if(colProffs[index][0] == proff){
        return true;
      }
    });
    //console.log(`Proff ${proff}: ${aux}`);
    //console.log(aux);
    const aux2 = Math.round((aux.reduce((acc, attGrade) => attGrade[0]+acc, 0)/aux.length) * 10) / 10;
    //console.log(aux2, aux.length);
    //console.log(`Promedio: ${aux2/aux.length}`);
    return aux2;
  }
  else{
    //console.log("Promedio null");
    return null;
  }
}

function getPromedioGlobal(proff, BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Final");
  const colProffs = BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues();
  if(index != -1){
    const colNotaFinal = getColNotaFinal(BSheet);
    //console.log(proff, colNotaFinal);
    const proffNotas = colNotaFinal.filter((Nota, index) => {
      if(colProffs[index] == proff){
        return true
      }
    });
    //console.log(proff, proffNotas);
    proffNotaspromedio = Math.round((proffNotas.reduce((acc, Nota) => Nota+acc, 0)/proffNotas.length) * 10) / 10;
    //console.log(proffNotaspromedio);
    return proffNotaspromedio;
  }
  else{
    return null;
  }
}

function getPorcentAprov(proff, BSheet){
  const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Nota Final");
  const colProffs = BSheet.getRange(2, 4, BSheet.getLastRow()-1, 1).getValues();
  if(index != -1){
    const colNotaFinal = getColNotaFinal(BSheet);
    const cantidadAlumnos = colNotaFinal.filter((Nota, index) => (Nota != '') && (colProffs[index] == proff)).length;
    //console.log(cantidadAlumnos);
    const proffNotas = colNotaFinal.filter((Nota, index) => {
      if((colProffs[index] == proff) && Nota >= 4.0){
        return true
      }
    });
    //console.log(proffNotas);
    return Math.round(((proffNotas.length*100)/cantidadAlumnos)*10)/10;
  }
  else{
    return null;
  }
}

function getModulesAttendanceRecuperativeFinal(BSheetList){
  const array=[];
  BSheetList.forEach((BSheet,idx)=>{
    const modules=BSheet.getRange(2, 3, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    const index = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("A");
    let attendance,recuperative;
    if (index!=-1){
      attendance=BSheet.getRange(2, index+1, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    }
    else {
      attendance=new Array(modules.length).fill(0);
    }
    const index2 = BSheet.getRange(1, 1, 1, BSheet.getLastColumn()).getValues()[0].indexOf("Aprueba Recuperativo");
    if (index2!=-1){
      recuperative=BSheet.getRange(2, index2+1, BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    }
    else {
      recuperative=new Array(modules.length).fill(0);
    }
    const final=BSheet.getRange(2, BSheet.getLastColumn(), BSheet.getLastRow()-1, 1).getValues().reduce((a, b) => a.concat(b), []);
    if (idx==0) {array[0]=modules;array.push(attendance);array.push(recuperative);array.push(final)}
    else {array.push(modules);array.push(attendance);array.push(recuperative);array.push(final)};
  })
  return array    //es de la forma [[módulo][asistencia][recuperativo][nota final][módulo][asistencia]...]
}
