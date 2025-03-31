import React from "react";

type AppTitleProps = {
  title: string;
};

const AppTitle = ({ title }: AppTitleProps) => {
  return (
    <>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {title}
      </h4>
    </>
  );
};

export default AppTitle;