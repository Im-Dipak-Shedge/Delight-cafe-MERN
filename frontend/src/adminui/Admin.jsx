import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddItem from "./AddItem";
import ListItems from "./ListItems";
import ManageOrders from "./ManageOrders";
import { AiOutlinePlus } from "react-icons/ai";
import { FiList } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

export default function Admin() {
  const [activePage, setActivePage] = useState("add-items");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "add-items":
        return <AddItem />;
      case "list-items":
        return <ListItems />;
      case "orders":
        return <ManageOrders />;
      default:
        return <AddItem />;
    }
  };

  const navItems = [
    {
      name: "Add Items",
      key: "add-items",
      icon: <AiOutlinePlus className="mr-2 h-5 w-5" />,
    },
    {
      name: "List Items",
      key: "list-items",
      icon: <FiList className="mr-2 h-5 w-5" />,
    },
    {
      name: "Manage Orders",
      key: "orders",
      icon: <MdManageAccounts className="mr-2 h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f9f9fb] text-[#1e1e2f]">
      {/* Header */}
      <header className="flex justify-between items-center bg-white px-6 py-4 shadow-sm rounded-b-lg">
        <h1 className="text-2xl font-bold text-[#b58969] tracking-wide">
          Admin Panel
        </h1>
        <div className="flex items-center space-x-4">
          <span className="hidden md:block font-medium text-[#1e1e2f]">
            Welcome, Admin
          </span>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="cursor-pointer  border-2 border-red-300  text-red-500 px-4 py-2 rounded-lg shadow-md hover:bg-[#f86464] hover:text-white  transition-all font-semibold"
          >
            Logout
          </button>

          <div className="w-12 h-12 border-2 border-neutral-700 rounded-full flex items-center justify-center shadow-inner ">
            <RiAdminFill className="text-neutral-600 text-2xl " />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-[#e2e2e8] p-4 rounded-tr-lg shadow-inner flex flex-col space-y-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activePage === item.key
                  ? "bg-[#faedcd] text-[#4b2e05] shadow-md border-l-4 border-[#b58969]"
                  : "text-[#1e1e2f] hover:bg-[#e9d8a6] hover:translate-x-1"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 bg-white rounded-lg m-4 shadow-md">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
