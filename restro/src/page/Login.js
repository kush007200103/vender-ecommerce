import React, { useState } from "react";
import Animlog from "../assests/login-animation.gif";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link } from "react-router-dom";
import {toast} from "react-hot-toast";
import {useNavigate } from "react-router-dom";
import {useDispatch, useSelector } from "react-redux";
import {loginRedux} from "../redux/userSlice";

const Login = () => {
  const [showpass, setshowpass] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate=useNavigate()
  const userData =useSelector(state=>state)

  const dispatch =useDispatch();








  const handeleshowpass = () => {
    setshowpass((preve) => !preve);
  };
  
  const hadleOnChnage = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        /*In the new state object, the spread operator (...) is used to create a shallow copy of the previous state. 
        This is done to avoid directly mutating the previous state object.*/
        ...preve,
        /*Then, a new property is added to the new state object using computed property names. The name variable is used as the property key, and the value variable is used as the property value. 
        The square brackets around [name] indicate that the property key is computed dynamically based on the value of the name variable. */
        [name]: value,
      };
    });
  };
  const handleSubmit = async (e) => {
    //  page is not refreshing on pressing submit button
    e.preventDefault();
    const { email, password } = data;
    if (email && password) {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/Login`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      
        toast(responseData.message)

        if(responseData.alert){
          dispatch(loginRedux(responseData))
          setTimeout(() => {
            navigate("/")
          }, 1000);
        }

        // console.log(responseData);
      // alert("sucessfully enter");
    } else {
      alert("please enter require fields");
    }
  };
  return (
    <div className="p-3 md:4">
      <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4">
        {/* <h1 className='text-center text-2xl font-bold'>Signup</h1> */}
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md  m-auto">
          <img src={Animlog} className="w-full" />
        </div>
        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type={"text"}
            id="email"
            name="email"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded outline-1 focus-within:outline-red-200"
            value={data.email}
            onChange={hadleOnChnage}
          />
          <label htmlFor="password">Password</label>
          <div className="flex   px-2 py-1 mt-1 mb-2  bg-slate-200 rounded focus-within:outline outline-red-200">
            <input
              type={showpass ? "text" : "password"}
              id="password"
              name="password"
              className="w-full bg-slate-200  border-none outline-none"
              value={data.password}
              onChange={hadleOnChnage}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handeleshowpass}
            >
              {showpass ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <button className="w-full max-w-[120px] m-auto bg-red-400 rounded-full hover:bg-red-700 cursor-pointer text-white text-l font-medium text-center py-2 mt-4 ">
            Login
          </button>
        </form>
        <p className="text-left text-sm mt-2 mb-2">
          Create a New account :{" "}
          <Link to={"/Signup"} className="text-red-300 underline">
            SignUp
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
