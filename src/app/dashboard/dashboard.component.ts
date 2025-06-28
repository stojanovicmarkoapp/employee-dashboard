import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { CommonModule } from '@angular/common';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports : [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  employees: any[] = [];
  chart: any;
  constructor(private employeeService: EmployeeService){}
  @ViewChild('pieChart',{static:true}) chartRef!: ElementRef;
  ngOnInit(): void {
    Chart.register(ArcElement,Tooltip,Legend,PieController, ChartDataLabels);
    this.employeeService.getEmployees().subscribe((data: any[])=>{
      const employeeMap: {[name: string]: number} = {};
      for (const entry of data){
        const name = entry.EmployeeName?.trim();
        if(!name) continue;
        const startTime = new Date(entry.StarTimeUtc);
        const endTime = new Date(entry.EndTimeUtc);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000*3600);
        if(!employeeMap[name]){
          employeeMap[name] = 0;
        }
        employeeMap[name] += hours;
      }
      this.employees = Object.entries(employeeMap)
        .map(([Name, TotalHours]) => ({Name, TotalHours}))
        .sort((a,b)=> b.TotalHours-a.TotalHours)
        this.createChart();
    });
  }
  calculateTotalHours(entry: any): number{
    const startTime = new Date(entry.StarTimeUtc);
    const endTime = new Date(entry.EndTimeUtc);
    return (endTime.getTime() - startTime.getTime())/(1000*3600);
  }
  createChart(){
    const chartNames = this.employees.map((e)=>e.Name);
    const chartData = this.employees.map((e)=>e.TotalHours);
    const context = this.chartRef.nativeElement.getContext('2d');
    this.chart = new Chart(context,{
      type: 'pie',
      data : {
        labels: chartNames,
        datasets : [{
          label: 'Pie Chart',
          data: chartData,
          backgroundColor : [
            'red' , 'yellow', 'orange', 'blue', 'green', 'magenta', 'black', 'cyan', 'violet','grey'
          ]
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            formatter: (value: number, context: any)=>{
              const data = context.chart.data.datasets[0].data as number[];
              const total = data.reduce((acc,val) => acc + val, 0);
              const percentage = (value/total) * 100;
              return percentage.toFixed(1) + '%';
            },
            color: 'white',
            font: {
              weight: 'bold' as const
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
}
