import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Correct from "../../Images/Vector.png";
import Info from "../../Images/ph_info-duotone.png";
function PlanCard() {


  return (
    <div
    id="plans"
    
    className="bg-bgWhite w-full py-6 text-center   lg:px-8 font-poppins"
  >
    <div className=" flex items-center justify-center">
      <p
        style={{ backgroundColor: "#EFEEFE" }}
        className="border-2 border rounded-full py-2 px-6 font-bold text-bgBlue"
      >
        Top Class Courses
      </p>
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
      Explore Our World's{" "}
      <span className="text-purple">Best Courses </span>
    </h2>
    <p className=" text-sm text-gray-900 mb-4 animate-fade-in lg:w-1/2 lg:m-auto ">
      Nullam eleifend metus ipsum, at ornare odio vehicula in.
      Pellentesque condimentum ntum vehicula.Nulla convallis enim eu velit
      commodo condimentum.
    </p>

    <div class="mt-4">
      
        {data &&
          data?.map((e, index) => {
            if (e?.isActive) {
              return (
                <>
                  <div class=" flex flex-col bg-white p-6 mx-auto max-w-md text-center xl:p-8 rounded-xl w-80 relative  transition hover:border-primary-focus/20 hover:shadow-primary-focus/20 transition duration-100 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                    
                    {/* <div className="h-36 bg-bgBlue rounded-xl">
                      <div className="p-2 mt-2">
                        <div className="flex gap-4 py-4 justify-center items-center">
                          <div class="absolute top-6 left-1/2 transform -translate-x-1/2 bg-purple text-white text-xs font-bold py-1 px-5 rounded ">
                            TOP SELLING
                          </div>
                          <img
                            src={e.planImage}
                            alt=""
                            className="rounded-full w-12 h-12"
                          />
                          <div>
                            <h1 className="text-white w-full text-sm text-start">
                              STATE PUBLIC SERVICE COMMISSION (PSC)
                            </h1>
                          </div>
                        </div>
                        <div className="text-white flex gap-3 ml-2">
                          <h1 className="text-3xl font-bold">
                            ₹ {e.offerPrice}
                          </h1>
                          <h1 className="line-through mt-2 text-purple">
                            ₹{e.price}
                          </h1>
                        </div>
                      </div>
                    </div> */}

                    <div className="flex font-bold text-lg mt-2 mb-2">
                      <h1>Course Information :</h1>
                    </div>

                    <ul
                      style={{ color: "#1C1A4A" }}
                      role="list"
                      class="mb-4 text-left h-64 grid grid-cols-1 lg:grid-cols-1 mt-2"
                    >
                      {e.exams.map((exam) => (
                        <>
                          <li class="flex items-center space-x-2 justify-between">
                            <div className="flex gap-4 justify-center items-center">
                              <img src={Correct} alt="" />
                              <span class="text-base-content/80">
                                {exam}
                              </span>
                            </div>
                            <div>
                              <img src={Info} alt="" />
                            </div>
                          </li>
                          <hr class="h-px bg-midGray border-1 dark:bg-black" />
                        </>
                      ))}
                    </ul>

                    <Link to={"/"}>
                      <div className="w-40 m-auto flex py-2 justify-center items-center gap-4 rounded-full bg-bgBlue text-white  transition duration-300 mt-2">
                        <button>Buy Course</button>
                        <FaArrowRightLong />
                      </div>
                    </Link>
                  </div>
                </>
              );
            }
          })}
    
    </div>

    <div className="mt-6">
      <Link to={"/"}>
        <div className="w-44 m-auto flex py-2.5 justify-center items-center gap-4 rounded-full bg-purple text-white shadow-[6px_6px_#4D2C5E] transition duration-300">
          <button>See All Courses</button>
          <FaArrowRightLong />
        </div>
      </Link>
    </div>
  </div>
  )
}

export default PlanCard
