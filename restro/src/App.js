import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setDataproducts } from "./redux/productslide";

function App() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productList);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/product`);
        if (!res.ok) {
          throw new Error("Failed to fetch product data");
        }
        const resData = await res.json();
        dispatch(setDataproducts(resData));
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product data");
      }
    })();
  }, [dispatch]);
  return (
    <>
      <Toaster />
      <div>
        <Header />
        <main className="pt-16 bg-slate-100 min-h-[calc(100vh)]">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
