import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Taskchart = () => {
  const series = [25, 15, 44, 55];
  const options = {
    chart: {
    //  width:"100%",
      type: 'donut',
    },
    labels: ["Pending", "On Hold", "On Progress","Completed"],
    theme: {
      monochrome: {
        enabled: false
      }
    },
    colors: ['#FF4560', '#FEB019', '#008FFB', '#00E396'], // Add your custom colors here
    plotOptions: {
      pie: {
        // customScale: 0.8,
        dataLabels: {
          offset: -5
        },
        donut: {
          size: '55%'
        }
      }
    },
    title: {
       text: undefined,
    },
    // dataLabels: {
    //   formatter(val, opts) {
    //     const name = opts.w.globals.labels[opts.seriesIndex];
    //     return [name, val.toFixed(1) + '%'];
    //   }
    // },
    legend: {
      show: true
    }
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="donut" />
    </div>
  );
};

export default Taskchart;
