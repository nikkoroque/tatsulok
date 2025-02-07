import Faq from "@/components/faq/Faq";
import Hero from "@/components/hero/Hero";
import { MarqueeDemo } from "@/components/marquee/Marquee";
import { BoxReveal } from "@/components/ui/box-reveal";
import { Spotlight } from "@/components/ui/spotlight";
import Image from "next/image";
import React from "react";


export default function AboutPage() {
    return (
        <>
            <Hero
                heroTitle="ONE Retail POS System"
                heroSubText="Payments, inventory, and eCommerce are just the start. The Tatsulok for Retail POS is your smart partner to connect every tool that keeps your business moving — so you can shape what’s next."
                heroButtonText="Learn More"
                heroButtonLink="#"
                heroImage="https://target.scene7.com/is/image/Target/GUEST_4bd4abb1-5d86-4342-bdba-05e8a1918b17?fmt=webp&qlt=80&wid=2400"
            />


            <div className="container px-6 py-16 mx-auto">
                <div className="container flex flex-col items-center px-4 py-12 mx-auto xl:flex-row">
                    <div className="flex justify-center xl:w-1/2">
                        <Image className="h-80 w-80 sm:w-[28rem] sm:h-[28rem] flex-shrink-0 object-cover rounded-full" src="https://target.scene7.com/is/image/Target/GUEST_f4dbdac4-9205-4a7c-b8f9-7967b2268a4f?fmt=webp&qlt=80&wid=600" width="600" height="600" alt="" />
                    </div>

                    <div className="flex flex-col items-center mt-6 xl:items-start xl:w-1/2 xl:mt-0">
                        <BoxReveal boxColor={"#313131"} duration={0.5}>
                            <h2 className="scroll-m-20 pb-2 text-3xl font-extrabold tracking-tight mb-4">
                                What is TATSULOK POS System?
                            </h2>
                        </BoxReveal>
                        <BoxReveal boxColor={"#313131"} duration={0.5}>
                            <p className="text-lg leading-8 text-gray-500 mt-1">TATSULOK is a smart retail POS system that streamlines payments, inventory, and eCommerce. With TATSULOK, you can optimize operations and stay ahead of the curve, empowering you to shape the future of your business.</p>
                        </BoxReveal>
                    </div>
                </div>
            </div>

            <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Built to simplify your <br /> <span className="text-blue-500">day-to-day.</span>
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                        Overwhelmed with tasks? Boost efficiency and work smarter, not harder with top-tier productivity tools.
                    </p>
                </div>
            </div>
            <MarqueeDemo />
            <Faq></Faq>
        </>
    );
}