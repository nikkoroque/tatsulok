import Image from 'next/image';
import React from 'react'
import { BoxReveal } from '../ui/box-reveal';
import { TypingAnimation } from '../ui/typing-animation';

type Props = {
    heroTitle: string;
    heroSubText: string;
    heroButtonText: string;
    heroButtonLink: string;
    heroImage: string;
}

const Hero = ({ heroTitle, heroSubText, heroButtonText, heroButtonLink, heroImage }: Props) => {
    return (
        <>
            <div className="container px-6 py-16 mx-auto text-center">
                <div className="max-w-lg mx-auto">
                    <TypingAnimation className="scroll-m-20 py-5 text-5xl font-extrabold tracking-tight lg:text-5xl" duration={85}>{heroTitle}</TypingAnimation>
                    <BoxReveal boxColor={"#313131"} duration={1}>
                        <p className="leading-7 text-gray-500 [&:not(:first-child)]:mt-6 text-lg">{heroSubText}</p>
                    </BoxReveal>
                    <div className="flex flex-col items-center justify-center">
                        <BoxReveal boxColor={"#313131"} duration={1}>
                            <button className="px-6 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-gray-800 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none">
                                {heroButtonText}
                            </button>
                        </BoxReveal>
                    </div>
                </div>
                <div className="flex justify-center mt-10">
                    <img className="object-cover w-full h-96 rounded-xl lg:w-4/5" src={heroImage} />
                </div>
            </div>
        </>

    )
}

export default Hero;