"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import GridBackground from "@/components/grid-background/GridBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <>
      <div className="relative">
        {/* Add GridBackground as a background layer */}
        <div className="absolute inset-0">
          <GridBackground />
        </div>
        <div className="relative z-10">
          <div className="container px-6 py-6 mx-auto text-center">
            <div className="flex flex-col overflow-hidden">
              <ContainerScroll
                titleComponent={
                  <>
                    <h1 className="text-4xl font-semibold text-black dark:text-white">
                      Unleash the power of <br />
                      <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                        Effortless Inventory
                      </span>
                    </h1>
                    <p className="text-gray-500 mb-10 text-2xl">
                      Boost efficiency, cut costs, and make smarter inventory
                      decisions.
                    </p>
                    <Button className="mb-16">
                      Book a demo <ArrowRight />
                    </Button>
                  </>
                }
              >
                <Image
                  src="/images/ui-placeholder.png"
                  alt="hero"
                  height={720}
                  width={1400}
                  className="mx-auto rounded-2xl object-cover h-full object-left-top"
                  draggable={false} unoptimized
                />
              </ContainerScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
