"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { AlignJustify } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="container px-6 py-4 mx-auto">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <a href="#">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Tatsulok
            </h3>
          </a>

          {/* <!-- Mobile menu button --> */}
          <div className="flex lg:hidden">
            <Button
              x-cloak
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-label="toggle menu"
            >
              <AlignJustify />
            </Button>
          </div>
        </div>

        {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
        <div
          className={`${
            isOpen
              ? "translate-x-0 opacity-100 "
              : "opacity-0 -translate-x-full"
          } absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center`}
        >
          <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
            <a
              href="#"
              className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              About
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Services
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
