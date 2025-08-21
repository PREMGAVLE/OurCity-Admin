import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginationNav = ({ currentPage, setCurrentPage, pageCount }) => {
  const renderPageLinks = () => {
    const pageButtons = [];
    for (let i = 1; i <= pageCount; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`flex w-10 h-8 rounded-xl text-sm justify-center items-center border ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-white text-black"
          }`}
          onClick={() => setCurrentPage(i)}
          disabled={currentPage === i}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  return (
    <div className="flex gap-3 justify-center mt-6 flex-wrap">
      <button
        className="px-4 py-2 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft className="mr-1 inline" /> Previous
      </button>

      {renderPageLinks()}

      <button
        className="px-4 py-2 border rounded disabled:opacity-50"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        Next <FaChevronRight className="ml-1 inline" />
      </button>
    </div>
  );
};

export default PaginationNav;
