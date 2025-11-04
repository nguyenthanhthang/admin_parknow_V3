/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";

const TabSelector = ({ tabs }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  return (
    <div>
      <div className="sm:hidden">
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={activeTabIndex}
          onChange={(event) => handleTabClick(parseInt(event.target.value))}
        >
          {tabs.map((tab, index) => (
            <option key={index} value={index}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-100 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {tabs.map((tab, index) => (
          <li key={index} className="w-full cursor-pointer">
            <p
              className={`inline-block w-full p-4 ${
                activeTabIndex === index
                  ? "text-white bg-blue-500 rounded-t-lg focus:outline-none"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-t-lg focus:outline-none"
              }`}
              aria-current={activeTabIndex === index ? "page" : undefined}
              onClick={() => handleTabClick(index)}
            >
              {tab.label}
            </p>
          </li>
        ))}
      </ul>
      <div className="p-4">{tabs[activeTabIndex].component}</div>
    </div>
  );
};

export default TabSelector;
