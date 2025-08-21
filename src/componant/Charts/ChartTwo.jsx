import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from '../../axios';

const ChartTwo = () => {
  const [weekDays, setWeekDays] = useState([]);
  const [weekAmtData, setWeekAmtData] = useState([]);
  const [series, setSeries] = useState([
    {
      name: 'Loans',
      data: [],
    },
    {
      name: 'Revenue',
      data: [13, 23, 20, 8, 13, 27, 15], // Dummy revenue data, update as needed
    },
  ]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/admins/totalCollectionsWeeklyStats");
        if (response?.data?.result?.dailyStats) {
          const dailyStats = response.data.result.dailyStats;

          const weeks = dailyStats.map((e) => e.day);
          const weeksAmt = dailyStats.map((e) => e.totalAmount);

          setWeekDays(weeks);
          setWeekAmtData(weeksAmt);

       
          setSeries([
            { name: 'Loans', data: weeksAmt },
            { name: 'Revenue', data: [13, 23, 20, 8, 13, 27, 15] },
          ]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const options = {
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'bar',
      height: 335,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
              columnWidth: '25%',
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: '25%',
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    dataLabels: { enabled: false },
    xaxis: { categories: weekDays },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Satoshi',
      fontWeight: 500,
      fontSize: '14px',
      markers: { radius: 99 },
    },
    fill: { opacity: 1 },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Profit this week
          </h4>
        </div>
        <div>
          <div className="relative z-20 inline-block">
            <select className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none">
              <option value="" className='dark:bg-boxdark'>This Week</option>
              <option value="" className='dark:bg-boxdark'>Last Week</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <div id="chartTwo" className="-ml-5 -mb-9">
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
