import { Component, OnInit, NgZone } from '@angular/core';
import covid from '../../assets/COVID.json';
import Chart from 'chart.js';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpClient } from '@angular/common/http';


/* Chart code */
// Themes begin
am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);

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
  showMapView:boolean=false;

  constructor(private zone: NgZone, private http: HttpClient) { }

  
  getCOVIDTimeSeries(){
    return this.http.get('https://pomber.github.io/covid19/timeseries.json');
  }

  ngOnInit() {

    this.getCOVIDTimeSeries().subscribe(data => {
      this.covidMainData = data;
      this.covidData = this.covidMainData;

      
      Object.keys(this.covidMainData).forEach(countryName=>{
        this.lastRow=this.covidMainData[countryName].length-1;
        this.globalTotalConfirmed+=this.covidMainData[countryName][this.lastRow].confirmed;
        this.globalTotalDeath+=this.covidMainData[countryName][this.lastRow].deaths;
        this.globalTotalRecovered+=this.covidMainData[countryName][this.lastRow].recovered;
      })

      this.dateList=this.covidData.Afghanistan.map(country=>country.date);

      this.clearSelection();
    });

  }

  graphView(){
   this.showMapView=false;
  //  this.clearSelection();
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

  printMap(country, countryName){
    this.clearTheSelection=false;
    try{
    this.clickedCountry=countryName;
    this.confirmed=country[country.length-1].confirmed;
    this.death=country[country.length-1].deaths;
    this.recovered=country[country.length-1].recovered;

    this.dateList=country.map(country=>country.date);
    let confirmedList=country.map(country=>country.confirmed);
    let deathList=country.map(country=>country.deaths);
    let recoveredList=country.map(country=>country.recovered);
    
    this.displayChart(this.dateList,confirmedList,deathList,recoveredList);
    }
    catch{
    this.confirmed=0;
    this.death=0;
    this.recovered=0;
    }
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
    this.showMapView=false;
    this.searchInput='';
    this.covidData=this.covidMainData;
    this.globalConfirmedList=[];
    this.globalDeathList=[];
    this.globalRecoverdList=[];
  
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
   this.displayChart(this.dateList,this.globalConfirmedList,this.globalDeathList,this.globalRecoverdList);


  }

  displayChart(dates,confirms,deaths,recovers){

   this.chart=new Chart('canvas',{
      type: 'line',
      data: {
        labels:dates,
        datasets: [{ 
            data: confirms,
            label: "Confirmed",
            borderColor: "rgb(235, 213, 15)",
            fill: false
          }, 
           { 
            data:deaths,
            label: "Dead",
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
          text: 'Corona Spread Analysis'
        }
      }
    })
  }

  displayMap() {
     this.showMapView=true;

      let chart = am4core.create("chartdiv", am4maps.MapChart);
      // Set map definition
      
      chart.geodata = am4geodata_worldLow;
      
      // Set projection
      chart.projection = new am4maps.projections.Orthographic();
      chart.panBehavior = "rotateLongLat";
      chart.deltaLatitude = -20;
      chart.padding(20,20,20,20);
      
      // limits vertical rotation
      chart.adapter.add("deltaLatitude", function(delatLatitude){
          return am4core.math.fitToRange(delatLatitude, -90, 90);
      })
      
      // Create map polygon series
      let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      
      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;
      
      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = am4core.color("#56f5ef");
      polygonTemplate.stroke = am4core.color("#454a58");
      polygonTemplate.strokeWidth = 0.5;

      console.log(polygonTemplate.tooltipText, this.covidData);
            
      polygonTemplate.events.on("hit", (ev) => {
        console.log("clicked on ", ev.target.dataItem.dataContext['name']);
        let countryName=ev.target.dataItem.dataContext['name'];
        if( countryName === 'United States'){
          countryName = 'US';
        }
        let country=this.covidData[countryName];
        this.printMap(country, countryName);      
      },this);

      let graticuleSeries = chart.series.push(new am4maps.GraticuleSeries());
      graticuleSeries.mapLines.template.line.stroke = am4core.color("#ffffff");
      graticuleSeries.mapLines.template.line.strokeOpacity = 0.08;
      graticuleSeries.fitExtent = false;
      
      
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 10;
      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color("#454a58");
      
      // Create hover state and set alternative fill color
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(0).brighten(-0.5);
      
      let animation;
      setTimeout(function(){
        animation = chart.animate({property:"deltaLongitude", to:100000}, 20000000);
      }, 3000)
      
      chart.seriesContainer.events.on("down", function(){
      if(animation){
        animation.stop();
      }
      })
      
    
  }

}