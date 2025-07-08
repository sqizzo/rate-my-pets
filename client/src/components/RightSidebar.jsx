import React from "react";
import Suggestion from "./Suggestion";

const RightSidebar = ({ suggestionsData }) => (
  <aside className="w-[380px] h-screen fixed top-0 right-0 p-8 text-white hidden lg:block">
    <div className="flex items-center mb-6">
      <img
        src="https://placehold.co/56x56/76D7C4/000000?text=ME"
        alt="My profile"
        className="w-14 h-14 rounded-full"
      />
      <div className="ml-4 flex-grow">
        <p className="font-bold">myusername</p>
        <p className="text-gray-400">My Full Name</p>
      </div>
      <button className="text-blue-400 font-bold text-xs">Switch</button>
    </div>

    <div className="flex justify-between items-center mb-4">
      <p className="font-bold text-gray-400 text-sm">Suggested for you</p>
      <button className="font-bold text-xs">See All</button>
    </div>

    <div>
      {suggestionsData.map((sugg) => (
        <Suggestion key={sugg.id} suggestion={sugg} />
      ))}
    </div>

    <footer className="mt-8 text-gray-500 text-xs">
      <p>
        <a href="#" className="hover:underline">
          About
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Help
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Press
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          API
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Jobs
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Privacy
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Terms
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Locations
        </a>{" "}
        •
        <a href="#" className="hover:underline">
          {" "}
          Language
        </a>
      </p>
      <p className="mt-4">© 2024 INSTAGRAM FROM META</p>
    </footer>
  </aside>
);

export default RightSidebar;
