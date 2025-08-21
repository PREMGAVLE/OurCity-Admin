import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";

import LogoDark from "../../Images/Sai-removebg-preview.png";
import HomeImage from "../../Images/secure-login-concept-illustration.png";

const NewLogin = () => {
  const [phone, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/Users/login", { phone, password });
      localStorage.setItem("token", response.data.accessToken);
      if (response.data) {
        window.location.replace("/dash");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2 text-center   ">
          <Link className="mb-5.5  w-32 inline-block" to="/">
            <img className="w-44" src={LogoDark} alt="Logo" />
          </Link>
          <div className="w-2/3  m-auto">
          <img className="w-full " src={HomeImage} alt="" />
          </div>
          
        </div>

        <div className="w-full xl:w-1/2 border-stroke dark:border-strokedark xl:border-l-2 p-4 sm:p-12.5 xl:p-17.5">
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Sign In to Sai Finance
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="text-start mb-2.5 block font-medium text-black dark:text-white">
                Phone
              </label>
              <input
                name="phone"
                placeholder="Type Your Phone"
                value={phone}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <label className="text-start mb-2.5 block font-medium text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="mb-5">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-lg border border-primary bg-bgBlue p-4 text-white transition hover:bg-opacity-90 flex justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewLogin;
