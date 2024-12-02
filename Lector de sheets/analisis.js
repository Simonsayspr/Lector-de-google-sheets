
function calculateAverage(modules, grades, evaluations, sheetEvaluations, ponderations){
    let allAverages = grades.map((element, index1) => {
        Averaged = element.reduce((acumulado, actual, index2) => {
            if(modules[index1] == 'APR'){
                return 0;
            }
            let currentModule = (modules[index1] - 1);
            let pond = ponderations[currentModule][(evaluations.indexOf(`${sheetEvaluations[index2]}`))+1];
            if(pond == "Décimas"){
                if(actual == ''){
                    actual = 0;
                }
                return((actual*0.1) + acumulado);
            }
            else if(isNaN(parseFloat(pond))){
                if(actual == ''){
                    actual = 1;//Cambiado de 0
                }
                return ((actual*0) + acumulado);
            }
            else{
                if(actual == ''){
                    actual = 1;//Cambiado de 0
                }
                return((pond*actual) + acumulado);
            }
        }, 0);
        return Math.round((Averaged+0.00001)*10)/10;
    });
    return allAverages;
}

function aprobationList(sheetInfo,moduleCount){   //1 es aprueba, 0 es reprueba
  const sheetMarks=sheetInfo.map((item)=>{verification=item.reduce((acumulado,actual,idx)=>{
    if (idx==0) return actual;
    else if (idx==1&& (acumulado==moduleCount &&actual>=4)||acumulado=="APR") return 1;
    else return 0;
  },0)
  return verification});
  return sheetMarks;
}

function tester(){
    const spread=SpreadsheetApp.getActiveSpreadsheet();
    const BSheetList=getBSheets(spread);
    /*const attendance=getAttendance(BSheetList);
    const averageAttendance=calculateAverageAttendance(attendance);
    console.log(averageAttendance)*/
    const names=getBonusNames(spread);
    const decimas=getDecimas(BSheetList,names);
}

function getModuleOcurrence(ocurrence,blockData,moduleCount){
  const organized=new Array(moduleCount).fill(0);
  organized.forEach((item,idx)=>{organized[idx]=[idx+1,0,0,0,0,0,0]})
  organized.forEach((moduleList,moduleIndex)=>{
    const ocurrenceCounter=new Array(blockData[0].length).fill(0)
    const attendance=new Array(blockData[0].length).fill(0)
    const recuperative=new Array(blockData[0].length).fill(0)
    const finalMark=new Array(blockData[0].length).fill(0)
    blockData.forEach((list,idx)=>{
      if (idx==0||idx%4==0){
        list.forEach((item,i)=>{
          if (parseInt(item)==(moduleIndex+1)) {ocurrenceCounter[i]++}
          if (ocurrenceCounter[i]==ocurrence && finalMark[i]==0){
            blockData[idx+1][i]!="" ? attendance[i]=blockData[idx+1][i]:attendance[i]=0
            blockData[idx+2][i]=="" ? recuperative[i]=1:recuperative[i]=0   //aprueba sin recuperativo si es 1
            blockData[idx+3][i]!="" ? finalMark[i]=blockData[idx+3][i]:finalMark[i]=0
          }
        })
      }
    })
    const ocurrenceInstances=finalMark.reduce((acumulado,actual)=>{if(actual!=0)return acumulado+1;else return acumulado;},0)
    if (ocurrenceInstances>0){
      const averageAttendance=Math.round((((attendance.reduce((acumulado,actual)=>{if(actual!=0)return acumulado+actual;else return acumulado},0))/ocurrenceInstances)+0.00001)*10)/10;
      const aprobation=(Math.round(((finalMark.reduce((acumulado,actual)=>{if (actual>=3.95) return acumulado+1; else return acumulado;},0))/ocurrenceInstances)*1000))/10;
      const temp=(Math.round(((recuperative.reduce((acumulado,actual)=>{if(actual!=0)return (acumulado+1);else return acumulado},0))/ocurrenceInstances)*1000))/10
      let averageRecuperative;
      temp!=100 ? averageRecuperative=temp:averageRecuperative=aprobation;
      const finalAverage=Math.round((((finalMark.reduce((acumulado,actual)=>{if(actual!=0)return acumulado+actual;else return acumulado},0))/ocurrenceInstances)+0.00001)*10)/10;
      const abandonement=(Math.round(((finalMark.reduce((acumulado,actual)=>{if(actual!=0 && actual<=1)return (acumulado+1);else return acumulado},0))/ocurrenceInstances)*1000))/10
      organized[moduleIndex][1]=ocurrenceInstances;
      organized[moduleIndex][2]=averageRecuperative;
      organized[moduleIndex][3]=aprobation;
      organized[moduleIndex][4]=finalAverage;
      organized[moduleIndex][5]=abandonement;
      organized[moduleIndex][6]=averageAttendance;
    }
  })
  return organized

}

function calculateAverageAttendance(attendance,evaluations){
    if (!evaluations.includes("A")) return null;
      const total=attendance.reduce((acumulado, actual) => acumulado.map((sum, idx) =>{
        if (actual[idx]=="") return sum+0;
        else return (sum + parseFloat(actual[idx]))}), new Array(attendance[0].length).fill(0));
      const count=attendance.reduce((acumulado, actual) => acumulado.map((sum, idx) =>{
        if (actual[idx]=="") return sum+0;
        else if (actual[idx]==null) return null;
        else return (sum + 1)}), new Array(attendance[0].length).fill(0));
      const average=total.map((item,idx)=>{
        if (item==null) return null;
        else return Math.round((item/count[idx]+0.00001)*10)/10;
      })
      return average;
  }
  

function calculateFinalAverage(summary,aprobated){
  let finalAverages = summary.map((element,idx) => {
    let num=0
        average = element.reduce((acumulado, actual) => {
          //console.log("IDX="+(idx+1)+" aprobado="+aprobated[idx])
          if (actual==""||(actual<4 && aprobated[idx]==1)) {return acumulado;}
          else if (aprobated[idx]==0 && actual !="") {num++;return acumulado+actual}
          else {num++;return acumulado+actual};
        }, 0);
        average=average/num;
        if (aprobated[idx]==0 && average>=3.95) average=3.9
        //console.log(`ID=`+(idx+1)+"="+Math.round((average+0.00001)*10)/10+","+average+"/"+num);
        return Math.round((average+0.00001)*10)/10;
    })
    return finalAverages;
}
/*
function preliminarAnotate(sheetAverages, colNotaPreliminar, evaluationsLength, BSheet){
    let toCorrect = [];
    sheetAverages.forEach((element, index) => {
        const cell = BSheet.getRange(index+2, 5+evaluationsLength);
        if(cell.getValues()[0][0] != ''  && colNotaPreliminar[index] < 1){
           toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `Nota invalida, ${colNotaPreliminar[index]} < 1. Debe ser ${sheetAverages[index]}`});
        }
        else if(element != colNotaPreliminar[index]){
            toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `${sheetAverages[index]}`});
        }
    });
    return toCorrect;
}
*/
function preliminarAnotate(sheetAverages, colNotaPreliminar, evaluationsLength){
  let toCorrect = [];
  sheetAverages.forEach((element, index) => {
      if(colNotaPreliminar[index] < 1 && colNotaPreliminar[index] != ''){
         toCorrect.push({"Cell": [index+2, evaluationsLength+5], "Color": "red", "String": `Nota invalida, ${colNotaPreliminar[index]} < 1. Debe ser ${sheetAverages[index]}`});
      }
      else if(element != colNotaPreliminar[index]){
          toCorrect.push({"Cell": [index+2, evaluationsLength+5], "Color": "red", "String": `${sheetAverages[index]}`});
      }
  });
  return toCorrect;
}
/*
function finalAnotate(sheetAverages, colNotaFinal, evaluationsLength, colRecuperativo, BSheet){
    if(colRecuperativo == null){
        let toCorrect = [];
        sheetAverages.forEach((element, index) => {
            const colPreliminarFinal = BSheet.getRange(index+2, 5+evaluationsLength, 1, 2).getValues();
            const cell = BSheet.getRange(index+2, 6+evaluationsLength);
            if((colNotaFinal[index] < 1 || element < 1) && (colPreliminarFinal[0][0] != '' || colPreliminarFinal[0][0] != '')){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `Nota invalida, ${colNotaFinal[index]} < 1. Debe ser ${sheetAverages[index]}`});
            }
            else if((element != colNotaFinal[index])){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `${element}`});
            }
        });
        return toCorrect;
    }
    else{
        let toCorrect = [];
        sheetAverages.forEach((element, index) => {
            const cell = BSheet.getRange(index+2, 7+evaluationsLength);
            if(colNotaFinal[index] < 1 || element < 1){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `Nota invalida, ${colNotaFinal[index]} < 1. Debe ser ${element}`});
            }
            else if(element >= 4 && colRecuperativo[index] != ''){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `No debio dar recuperativo, ${element} >= 4`});
            }
            else if(element < 4 && colRecuperativo[index][0] == "Sí" && colNotaFinal[index] != 4){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `4.0`});
            }
            else if(element < 4 && colRecuperativo[index][0] == "No" && colNotaFinal[index] != element){
                toCorrect.push({"Cell": cell, "Color": "#FFCCCB", "String": `${element}`});
            }
        });
        return toCorrect;
    }
}
*/
function finalAnotate(sheetAverages, colNotaFinal, evaluationsLength, colRecuperativo){
  if(colRecuperativo == null){
      let toCorrect = [];
      sheetAverages.forEach((element, index) => {

          if((colNotaFinal[index] < 1 || element < 1) && (colNotaFinal[index] != '')){
              toCorrect.push({"Cell": [index+2, evaluationsLength+6], "Color": "red", "String": `Nota invalida, ${colNotaFinal[index]} < 1. Debe ser ${element}`});
          }
          else if((element != colNotaFinal[index]) && (colNotaFinal != '')){
              toCorrect.push({"Cell": [index+2, evaluationsLength+6], "Color": "red", "String": `${element}`});
          }
      });
      return toCorrect;
  }
  else{
      let toCorrect = [];
      sheetAverages.forEach((element, index) => {
          if((colNotaFinal[index] < 1 || element < 1) && (colNotaFinal[index] != '')){
              toCorrect.push({"Cell": [index+2, evaluationsLength+7], "Color": "red", "String": `Nota invalida, ${colNotaFinal[index]} < 1. Debe ser ${element}`});
          }
          else if(element >= 4 && colRecuperativo[index] != ''){
              toCorrect.push({"Cell": [index+2, evaluationsLength+7], "Color": "red", "String": `No debio dar recuperativo, ${element} >= 4`});
          }
          else if(element < 4 && colRecuperativo[index][0] == "Sí" && colNotaFinal[index] != 4){
              toCorrect.push({"Cell": [index+2, evaluationsLength+7], "Color": "red", "String": `4.0`});
          }
          else if(element < 4 && colRecuperativo[index][0] == "No" && colNotaFinal[index] != element){
              toCorrect.push({"Cell": [index+2, evaluationsLength+7], "Color": "red", "String": `${element}`});
          }
      });
      return toCorrect;
  }
}
function calculateAllBonus(bonus){    //retorna el total de décimas, y el primer item de la lista no se usa, parte desde total[1]
    final=bonus.map((sheet)=>{
      return sheet.map((list,i)=>{
        return list.reduce((acumulado,actual,idx)=>{if (i!=0) return acumulado+parseInt(actual)},0)
      })
    })
    const total=final.reduce((acumulado, actual) => acumulado.map((sum, idx) =>{
        return (sum + parseInt(actual[idx]))}), new Array(final[0].length).fill(0));
    return total
  }

function calculateNextModule(moduleCount,modules,finalMark){
  const newModules=modules.map((module,idx)=>{
    if (finalMark[idx]>=3.95 && parseInt(module)<moduleCount) return (parseInt(module)+1);
    else if (finalMark[idx]<3.95) return module
    else return "APR"
  })
  return newModules
}

function assignProffesors(professors,newModules,remote){
  const modules=newModules.map((item,idx)=>{if (remote[idx]==1) return "O"; else return item})
  const moduleIntegrants=new Array(professors.length).fill(0)
  moduleIntegrants.forEach((item,idx)=>moduleIntegrants[idx]=[0,0])
  modules.forEach((item)=>{if (item!="APR" && item!="O") moduleIntegrants[parseInt(item)-1][0]++})
  const assignation=new Array(professors.length).fill(0)    //tiene formato profesor,módulo
  professors.forEach((item,idx)=>assignation[idx]=[item,0])
  professors.forEach((professor,idx)=>{
    const highestIntegrants=moduleIntegrants.reduce((acumulado,actual,index)=>{
      if (actual[1]!=0){
      if ((actual[0]/actual[1])>acumulado[0]) return [(actual[0]/actual[1]),index+1]
      else return acumulado;
    }
    else if (actual[1]==0 && actual[0]>0) return [Infinity,index+1]
    else return acumulado;
    },[0,0])
    if (highestIntegrants[1]!=0){
      assignation[idx][1]=highestIntegrants[1];
      moduleIntegrants[highestIntegrants[1]-1][1]++
    }
  })
  const order=new Array(professors.length).fill(0)
  professors.forEach((item,idx)=>order[idx]=[assignation[idx][1],0])
  const individualAssignations=modules.map((item,idx)=>{
    const nextProfessor=order.reduce((acumulado, actual,i)=>{
      if (actual[1]<acumulado[1] && parseInt(item)==assignation[i][1]) {console.log(actual);return [assignation[i][0],actual[1]];}
      else return acumulado;
    },[0,Infinity])
    if (nextProfessor[0]!=0){
      order[professors.indexOf(nextProfessor[0])][1]=idx;
    }
    return nextProfessor[0];
  })
  return individualAssignations;
}

function verifyRemote(array,newModules){
  console.log(array.length);
  if (array.length>=2){
    const list=newModules.map((item,idx)=>{
      //console.log(idx+" comparing "+item+" to "+array[array.length-1][idx]+" to "+array[array.length-2][idx]+" 1st="+(array[array.length-1][idx]!=item)+" 2nd="+parseInt(array[array.length-1][idx])!=item)
      if(parseInt(array[array.length-1][idx])!=item) return 0;
      else if (parseInt(array[array.length-2][idx])==parseInt(array[array.length-1][idx])) return 1;
      else return 0;
    })
    return list;
  }
  else {const empty=new Array(newModules.length).fill(0); return empty}
}

function listStudPerMod(data, modcount) {
  const modules = [...new Set(data.filter(element => element !== 'APR'))];
  const orderMod = modules.toSorted((a, b) => a - b);
  const counts = {};
  data.forEach(element => {
    if (element === 'APR') {
      counts.apr = (counts.apr || 0) + 1;
    } else {
      counts[`m${element}`] = (counts[`m${element}`] || 0) + 1;
    }
  });
const countsArray = Object.entries(counts);
const nonAprCounts = countsArray.filter(([key, value]) => key !== 'apr');
const sortedCountsArray = nonAprCounts.sort((a, b) => {
  const moduleA = parseInt(a[0].slice(1));
  const moduleB = parseInt(b[0].slice(1));
  return moduleA - moduleB;
});

if (counts.hasOwnProperty('apr')) {
  sortedCountsArray.push(['apr', counts.apr]);
}
const orderedCounts = Object.fromEntries(sortedCountsArray);
const total = Object.values(orderedCounts).reduce((sum, count) => sum + count, 0);
const students = orderMod.map(module => {
    const count = orderedCounts[`m${module}`] || 0;
    return (count / total) * 100;
  });
const aprPercentage = (orderedCounts.apr || 0) / total * 100;
students.push(aprPercentage);

  const filledStudents = students.concat(Array((modcount - students.length)+1).fill(0));

  return filledStudents;
}

function blockAvrg(data){
  const grades = data.map(element=>{
    if (element == ''){
      return 0;
    }
    else{
      return element
    }
  });
   const final = grades.filter(element => element != 0);
   const n = final.length;
   const add = final.reduce((sum, count) => sum + count, 0);
   const result = add/n;
   return result;
}

function blockDev(data){
  const grades = data.map(element=>{
    if (element == ''){
      return 0;
    }
    else{
      return element
    }
  });
   const final = grades.filter(element => element != 0);
   const n = final.length;
   const add = final.reduce((sum, count) => sum + count, 0);
   const average = add/n;
   const diff = final.reduce((sum, element) => sum + (element - average)**2,0);
   const result = Math.sqrt(diff/n);
   return result;
}