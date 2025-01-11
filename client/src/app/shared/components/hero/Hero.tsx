import PulsatingButton from "@/components/ui/pulsating-button";
import React from "react";

const Hero = () => {
  return (
    <div>
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-lg mx-auto ">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
            Tatsulok Inventory System
          </h1>
          <p className="mt-6 text-gray-500 dark:text-gray-300">
          This application is designed to streamline and simplify inventory management for small businesses.
          </p>
          <div className="flex justify-center">
            <PulsatingButton className="mt-6">
              Start 14-Day free trial
            </PulsatingButton>
          </div>
          <p className="mt-3 text-sm text-gray-400 ">No credit card required</p>
        </div>

        <div className="flex justify-center mt-10">
          <img
            className="object-cover w-full h-96 rounded-xl lg:w-4/5"
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
