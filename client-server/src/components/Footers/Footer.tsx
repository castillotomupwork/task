import * as React from "react";

interface IFooterProps {
}

const Footer: React.FunctionComponent<IFooterProps> = () => {
  return (
    <>
      <div className="container p-2 mx-auto">
        <div className="border-t border-solid border-gray-300 text-gray-800 text-xs text-center py-5">
            &#169; 2025 Demo | Tom Castillo
        </div>
      </div>
    </>
  );
};

export default Footer;
