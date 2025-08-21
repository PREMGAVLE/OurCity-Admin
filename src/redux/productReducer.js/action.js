
import {  ADD_JOBS_SUCCESS, ADD_PROJECT_SUCCESS, ADD_SKILL_SUCCESS, ADD_TASK_SUCCESS, GET_JOBS_SUCCESS, GET_JOBSCOMPLITION_SUCCESS, GET_PRODUCT_SUCCESS, GET_SKILL_SUCCESS, GET_TASK_SUCCESS, GET_USERTASK_SUCCESS, PRODUCT_FAILURE, PRODUCT_REQUEST } from "./actiontype"
import axios from "axios";


const BASE_URL ="https://learn2earn-alpha.vercel.app/api/"

//Projects section////////
// export const getProject = (yourConfig) =>(dispatch)=> {
//     dispatch({type:PRODUCT_REQUEST})

//     return axios.get(`${BASE_URL}/showProjects`,yourConfig)
//     .then((res) => {
//         console.log(res)
//         return (
//         dispatch({type:GET_PRODUCT_SUCCESS, payload:res.data.data})
//         )
//     })
//     .catch((err)=>{
//         console.log(err)
//         dispatch({type:PRODUCT_FAILURE})
//     });
// }


// export const addProject = (data,yourConfig)=> (dispatch) => {
//   dispatch({type:PRODUCT_REQUEST})

//  return axios.post(`${BASE_URL}/addProject`,data,yourConfig)
//   .then((res) => {
//       console.log(res)
//       return (
//       dispatch({type:ADD_PROJECT_SUCCESS, payload:res.data})
//       )
//   })
//   .catch((err)=>{
//       // console.log(err)
//       dispatch({type:PRODUCT_FAILURE,payload:err.response.data})
//   });
// }


