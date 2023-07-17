import React, { useState } from "react";
import Animlog from "../assests/login-animation.gif";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/imagetoutility";
import {toast} from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [showpass, setshowpass] = useState(false);
  const [showconfpass, setshowconfpass] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const handeleshowpass = () => {
    setshowpass((prev) => !prev);
  };
  
  const handeleshowconfpass = () => {
    setshowconfpass((prev) => !prev);
  };

  

  const handleChange = (e) => {
    const {name,value} = e.target;
    setData((prev) => {
      return {
      ...prev,
      [name]: value,
      };
    });
  };

  const handleUploadProfile = async (e) => {

    const data = await ImagetoBase64(e.target.files[0]);
    setData((prev) => {
      return {
      ...prev,
      image: data
      }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, email, password, confirmPassword } = data;

    if (firstName && email && password && confirmPassword) {
      if (password === confirmPassword) {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/Signup`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        })

        const responseData = await response.json();
        console.log(responseData);
        toast(responseData.message);
        navigate("/Login");
      } else {
        alert("Password and confirm password do not match");
      }
    } else {
      alert("Please enter all required fields");
    }
  };

  return (
    <div className="p-3 md:4">
      <div className="w-full max-w-sm bg-white m-auto flex flex-col p-4">
        <div className="w-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
          <img src={data.image ? data.image : Animlog} className="w-full" alt="Profile" />
          <label htmlFor="profileImage">
            <div className="absolute bottom-0 h-1/3 bg-slate-500 bg-opacity-30 w-full text-center">
              <p className="text-sm p-1 text-white cursor-pointer">Upload</p>
            </div>
            <input type="file" id="profileImage" accept="image/" className="hidden" onChange={handleUploadProfile} />
          </label>
        </div>
        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-red-200"
            value={data.firstName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded focus-within:outline-red-200"
            value={data.lastName}
            onChange={handleChange}
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            className="mt-1 mb-2 w-full bg-slate-200 px-2 py-1 rounded outline-1 focus-within:outline-red-200"
            value={data.email}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <div className="flex px-2 py-1 mt-1 mb-2 bg-slate-200 rounded focus-within:outline outline-red-200">
            <input
              type={showpass ? "text" : "password"}
              id="password"
              name="password"
              className="w-full bg-slate-200 border-none outline-none"
              value={data.password}
              onChange={handleChange}
            />
            <span className="flex text-xl cursor-pointer" onClick={handeleshowpass}>
              {showpass ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="flex px-2 py-1 mt-1 mb-2 bg-slate-200 rounded focus-within:outline outline-red-200">
            <input
              type={showconfpass ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="w-full bg-slate-200 border-none outline-none"
              value={data.confirmPassword}
              onChange={handleChange}
            />
            <span className="flex text-xl cursor-pointer" onClick={handeleshowconfpass}>
              {showconfpass ? <BiShow /> : <BiHide />}
            </span>
          </div>
          <button className="w-full max-w-[150px] m-auto bg-red-400 rounded-full hover:bg-red-700 cursor-pointer text-white text-xl font-medium text-center py-2 mt-4">
            Sign Up
          </button>
        </form>
        <p className="text-left text-sm mt-2 mb-2">
          Already have an account?{" "}
          <Link to="/login" className="text-red-300 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
