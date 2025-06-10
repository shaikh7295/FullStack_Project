import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { color } from 'echarts';

@Component({
  selector: 'app-portfolio-graph',
  templateUrl: './portfolio-graph.component.html',
  styleUrls: ['./portfolio-graph.component.css']
})
export class PortfolioGraphComponent implements OnInit {
  chartOption: any;
  tenureOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];
  selectedTenure = 'Daily'; 
  totalADV: number = 0;
  lastDate: string = '';
  equityValue: number = 0;  
  debtValue: number = 0;    
  commodityValue: number = 0;  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadData(this.selectedTenure);
  }

  loadData(tenure: string) {
    this.selectedTenure = tenure;
    const url = `https://backend-api-pxok.onrender.com/portfolio/${tenure}`;

    this.http.get<any>(url).subscribe(data => {
      const etf1 = data.response.portfolioData.data.ETF1;
      const etf2 = data.response.portfolioData.data.ETF2;
      const etf3 = data.response.portfolioData.data.ETF3;


      this.totalADV = parseFloat(data.response.portfolioData.data.aggregateADV);
      this.lastDate = etf1[etf1.length - 1].date;


      this.equityValue = etf1[etf1.length - 1].last;
      this.debtValue = etf2[etf2.length - 1].last;
      this.commodityValue = etf3[etf3.length - 1].last;

      const dates = etf1.map((d: any) => d.date);

      this.chartOption = {
        title: {
          text: `Portfolio Overview - ${tenure}`,
          left: 'center',
          color: '#ffff',
        },
        titlelabel: {
          color: '#002b80',
        },
        backgroundColor: '#fff',
        color: ['#ff7f50', '#87cefa', '#da70d6'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 30,
          data: ['Equity', 'Debt', 'Commodity']
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45,

            color: '#002b80',

          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#002b80',
          },
        },
        series: [
          {
            name: 'Equity',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: etf1.map((d: any) => d.last),
            color: '#5470c6',
            smooth: true
          },
          {
            name: 'Debt',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: etf2.map((d: any) => d.last),
            color: '#91cc75',
            smooth: true
          },
          {
            name: 'Commodity',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            data: etf3.map((d: any) => d.last),
            color: '#fac858',
            smooth: true
          }
        ]
      };
    });
  }
}
