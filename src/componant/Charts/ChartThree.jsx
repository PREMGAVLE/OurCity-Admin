import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
  labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = () => {
  const [state, setState] = useState({
    series: [65, 34, 12, 56],
  });

  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 p-4 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <h5 className="text-xl font-semibold text-black dark:text-white">Visitors Analytics</h5>
        <select className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none">
          <option className="dark:bg-boxdark">Monthly</option>
          <option className="dark:bg-boxdark">Yearly</option>
        </select>
      </div>
      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={state.series} type="donut" />
        </div>
      </div>
      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {[['Desktop', '#3C50E0', 65], ['Tablet', '#6577F3', 34], ['Mobile', '#8FD0EF', 45], ['Unknown', '#0FADCF', 12]].map(([label, color, value]) => (
          <div key={label} className="sm:w-1/2 w-full px-8">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full" style={{ backgroundColor: color }}></span>
              <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                <span>{label}</span>
                <span>{value}%</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartThree;
