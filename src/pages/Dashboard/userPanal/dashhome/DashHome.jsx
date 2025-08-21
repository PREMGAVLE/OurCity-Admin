import React, { useEffect, useState } from "react";

import CardDataStats from "../../../../componant/CardDataStats/CardDataStats";
import ChartOne from "../../../../componant/Charts/ChartOne";
import ChartTwo from "../../../../componant/Charts/ChartTwo";
import ChartThree from "../../../../componant/Charts/ChartThree";
import axios from "../../../../axios";

const DashHome = () => {
  const [data, setData] = useState([]);
  const [weekdata, setWeekData] = useState([]);
  const [weekDays, setweekDays] = useState([]);
  const [weekAmtData, setweekAmtData] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [monthsData, setMonthData] = useState([]);
  const [monthlyAmtData, setMonthlyAmtData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalLoanAmt, setTotalLoanAmt] = useState(0);
  const [dailyCollection, setDailyCollection] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);

  // DailyCollections
  useEffect(() => {
    async function fetchData() {
      axios.get(`/admins/totalCollectionsToday`).then((response) => {
        if (response?.data) {
          setDailyCollection(response?.data?.result?.totalAmount);
        }
      });
    }
    fetchData();
  }, []);

  // total outgoing
  useEffect(() => {
    async function fetchData() {
      axios.get("users/").then((response) => {
        if (response?.data) {
          setUserData(response?.data?.result);
        }

        const sum = response.data.result.reduce((acc, item) => {
          return acc + (item.active_loan_id?.total_amount || 0);
        }, 0);

        setTotalLoanAmt(sum);
      });
    }
    fetchData();
  }, []);

  // total collection
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollections").then((response) => {
        if (response?.data) {
          setTotalCollection(response?.data?.result?.totalAmount);
        }
      });
    }
    fetchData();
  }, []);

  // Monthly Collections
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsMonthly").then(() => {
        // Reserved for future use if needed
      });
    }
    fetchData();
  }, []);

  // Monthly Collections Array Format
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsMonthlyStats").then((response) => {
        if (response?.data) {
          setData(response?.data?.result);
          const res = response?.data?.result;
          const months = res.map((e) => e.month);
          const monthsAmt = res.map((e) => e.totalAmount);
          setMonthData(months);
          setMonthlyAmtData(monthsAmt);
        }
      });
    }
    fetchData();
  }, []);

  // Weekly Collections Array Format
  useEffect(() => {
    async function fetchData() {
      axios.get("/admins/totalCollectionsWeeklyStats").then((response) => {
        if (response?.data) {
          setWeekData(response?.data?.result?.dailyStats);
          const res = response?.data?.result?.dailyStats;
          const weeks = res.map((e) => e.day);
          const weeksAmt = res.map((e) => e.totalAmount);
          setweekDays(weeks);
          setweekAmtData(weeksAmt);
        }
      });
    }
    fetchData();
  }, []);

  // Mirror monthly data when `data` changes
  useEffect(() => {
    const months = data.map((e) => e.month);
    const monthsAmt = data.map((e) => e.totalAmount);
    setMonthData(months);
    setMonthlyAmtData(monthsAmt);
  }, [data]);

  return (
    <div
      className="lg:py-12 mt-20  lg:h-full h-screen bg-purple-500"
      style={{ backgroundSize: "cover" }}
    >
      {/* Welcome Card */}
      {/* <div className="p-4">
        <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-boxdark shadow-lg p-6">
          <h1 className="text-xl font-semibold text-slate-700 dark:text-white">
            Hello, Admin
          </h1>
          <span className="text-3xl">👋</span>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 p-4">
        <CardDataStats
          title="Daily Collection"
          total={`₹ ${dailyCollection}`}
          rate="+5.2%"
          levelUp
        >
          📈
        </CardDataStats>
        <CardDataStats
          title="Total Loan Customer"
          total={userdata.length}
          rate="-2.3%"
          levelDown
        >
          👥
        </CardDataStats>
        <CardDataStats
          title="Total Outgoing"
          total={`₹ ${totalLoanAmt}`}
          rate="+1.8%"
          levelUp
        >
          📦
        </CardDataStats>
        <CardDataStats title="Total Collections" total={`₹ ${totalCollection}`}>📦</CardDataStats>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 p-4">
        <ChartOne monthsData={monthsData} monthlyAmtData={monthlyAmtData} />
        <ChartTwo weekDays={weekDays} weekAmtData={weekAmtData} />
        <ChartThree />
      </div>
    </div>
  );
};

export default DashHome;