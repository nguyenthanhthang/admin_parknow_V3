import React, { useState } from "react";

const Tab = ({ label, active, onClick }) => {
  return (
    <div
      className={`px-5 py-3 cursor-pointer ${
        active
          ? "font-bold bg-lightgray rounded-t-lg rounded-b-lg"
          : "border-transparent"
      }`}
      style={{ color: active ? "#4F46E5" : "" }}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            active={index === activeTab}
            onClick={() => setActiveTab(index)}
          />
        ))}
        <div
          className="absolute bottom-0 left-0 h-1 transition-all duration-500"
          style={{
            width: `${100 / tabs.length}%`,
            transform: `translateX(${activeTab * (100 / tabs.length)}%)`,
          }}
        ></div>
      </div>
      <div className="p-4">{tabs[activeTab].component}</div>
    </div>
  );
};

export default Tabs;
