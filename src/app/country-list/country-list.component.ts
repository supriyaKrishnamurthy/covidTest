import { Component, OnInit } from '@angular/core';
import covid from '../../assets/COVID.json';
import Chart from 'chart.js';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  json_data:object;
  covidData:any;
  covidMainData:any;
  searchInput:string;
  clickedCountry:string;
  confirmed:number;
  death:number;
  recovered:number;
  globalTotalConfirmed:number=0;
  globalTotalDeath:number=0;
  globalTotalRecovered:number=0;
  lastRow:number;
  chart:[];
  clearTheSelection:boolean=false;
  globalConfirmedList:Array<number>=[];
  globalDeathList:Array<number>=[];
  globalRecoverdList:Array<number>=[];
  dateList:[];


  constructor() { }

  ngOnInit() {
    this.covidMainData=covid;
    this.covidData=this.covidMainData;

    Object.keys(this.covidMainData).forEach(countryName=>{
      this.lastRow=this.covidMainData[countryName].length-1;
      this.globalTotalConfirmed+=this.covidMainData[countryName][this.lastRow].confirmed;
      this.globalTotalDeath+=this.covidMainData[countryName][this.lastRow].deaths;
      this.globalTotalRecovered+=this.covidMainData[countryName][this.lastRow].recovered;
    })
  }

  printCountry(country){
    this.clearTheSelection=false;
    this.clickedCountry=country.key;
    this.confirmed=country.value[country.value.length-1].confirmed;
    this.death=country.value[country.value.length-1].deaths;
    this.recovered=country.value[country.value.length-1].recovered;

    
    this.dateList=country.value.map(country=>country.date);
    let confirmedList=country.value.map(country=>country.confirmed);
    let deathList=country.value.map(country=>country.deaths);
    let recoveredList=country.value.map(country=>country.recovered);
    
    this.displayChart(this.dateList,confirmedList,deathList,recoveredList);
     
  }

  searchByCountry(){
    this.covidData={};
    Object.keys(this.covidMainData).forEach(countryName=>{
      if(countryName.toLowerCase().includes(this.searchInput.toLowerCase())){
        this.covidData[countryName]=this.covidMainData[countryName]
      }
    })
  }

  clearSelection(){
    this.clearTheSelection=true;
    this.searchInput='';
    this.covidData=this.covidMainData;

  
    let totalDays=this.covidMainData.Afghanistan.length-1 /**Check how to generalize this */
   /**for each date sumup the values of each country for that date**/
    for(let i=0;i<=totalDays;i++){
      let globalConfirmedByDate=0;
      let globalDeathByDate=0;
      let globalRecoveredByDate=0
        Object.keys(this.covidMainData).forEach(countryName=>{
          /**for given day sumup the values of each country **/
          globalConfirmedByDate+=this.covidMainData[countryName][i].confirmed;
          globalDeathByDate+=this.covidMainData[countryName][i].deaths;
          globalRecoveredByDate+=this.covidMainData[countryName][i].recovered;

        })
      /**Push data to array for each date summed up values **/

        this.globalConfirmedList.push(globalConfirmedByDate);
        this.globalDeathList.push(globalDeathByDate);
        this.globalRecoverdList.push(globalRecoveredByDate);
   }

   console.log(this.globalConfirmedList,this.globalDeathList,this.globalRecoverdList);
   this.displayChart(this.dateList,this.globalConfirmedList,this.globalDeathList,this.globalRecoverdList);


  }

  displayChart(dates,confirms,deaths,recovers){

   this.chart=new Chart('canvas',{
      type: 'line',
      data: {
        labels:dates,
        datasets: [{ 
            data: confirms,
            label: "confirmed",
            borderColor: "rgb(235, 213, 15)",
            fill: false
          }, 
           { 
            data:deaths,
            label: "dead",
            borderColor: "rgba(255, 136, 0, 0.795)",
            fill: false
          },
          { 
            data: recovers,
            label: "Recovered",
            borderColor: "rgb(49, 190, 49)",
            fill: false
          },
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Corona spread analysis'
        }
      }
    })
  }

}
