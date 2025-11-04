import React from "react";

const TabRequest = ({ tabs, activeTab, handleTabClick }) => {
  return (
    <ul className="mb-4 flex list-none flex-row flex-wrap border-b-0 pl-0">
      {tabs.map((tab) => (
        <li key={tab.id} role="presentation" className="mr-4">
          <button
            className={`my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-5 pb-2.5 pt-3 text-sm font-medium leading-tight text-neutral-500 hover:border-transparent ${
              activeTab === tab.id
                ? "bg-blue-400 text-white"
                : "bg-lightgray text-neutral-500"
            }`}
            id={tab.id}
            onClick={() => handleTabClick(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            style={{
              borderRadius: "0.4rem",
              color: activeTab === tab.id ? "#fff" : undefined,
              cursor: "pointer",
            }}
          >
            <span style={{ cursor: "pointer" }}>{tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabRequest;
