import { Component, OnInit } from '@angular/core';
import covid from '../../assets/COVID.json';
import Chart from 'chart.js';

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
  globalConfirmed:number=0;
  globalDeath:number=0;
  globalRecovered:number=0;
  lastRow:number;
  chart:[];


  constructor() { }

  ngOnInit() {
    this.covidMainData=covid;
    this.covidData=this.covidMainData;

    Object.keys(this.covidMainData).forEach(countryName=>{
      this.lastRow=this.covidMainData[countryName].length-1;
      this.globalConfirmed+=this.covidMainData[countryName][this.lastRow].confirmed;
      this.globalDeath+=this.covidMainData[countryName][this.lastRow].deaths;
      this.globalRecovered+=this.covidMainData[countryName][this.lastRow].recovered;
    })
  }

  printCountry(country){
    this.clickedCountry=country.key;
    this.confirmed=country.value[country.value.length-1].confirmed;
    this.death=country.value[country.value.length-1].deaths;
    this.recovered=country.value[country.value.length-1].recovered;

    
    let dateList=country.value.map(country=>country.date);
    let confirmedList=country.value.map(country=>country.confirmed);
    let deathList=country.value.map(country=>country.deaths);
    let recoveredList=country.value.map(country=>country.recovered);

    this.chart=new Chart('canvas',{
      type: 'line',
      data: {
        labels:dateList,
        datasets: [{ 
            data: confirmedList,
            label: "confirmed",
            borderColor: "yellow",
            fill: false
          }, 
           { 
            data:deathList,
            label: "dead",
            borderColor: "orange",
            fill: false
          },
          { 
            data: recoveredList,
            label: "Recovered",
            borderColor: "green",
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

  searchByCountry(){
    this.covidData={};
    Object.keys(this.covidMainData).forEach(countryName=>{
      if(countryName.toLowerCase().includes(this.searchInput.toLowerCase())){
        this.covidData[countryName]=this.covidMainData[countryName]
      }
    })
  }




}
