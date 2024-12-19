import React from "react";
import Background from "../../assets/Rectangle 2.png";
import NotFoundImage from "../../assets/404.svg";
function NotFound() {
  return (
    <>
      <div style={{ height: "100vh" }}>
        <div className="flex justify-center">
          <img src={NotFoundImage} alt="404" className="not-found-image" />
        </div>
        <div>
          <h1 className="text-4xl text-white font-semibold text-center">
            404 - Error Page not found
          </h1>
          <p className="text-white font-semibold text-center mt-6 w-[50%] mx-auto">
            The page you are looking for might have been removed or had its name
            changed or is temporarily unavailable.
          </p>
        </div>
        <img
          src={Background}
          alt="Pink Layer Backgound"
          className="pink-backgound-layer reverse"
        />
      </div>
    </>
  );
}
export default NotFound;
