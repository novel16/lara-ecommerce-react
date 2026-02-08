import React from "react";

function Pagination({ currentPage, lastPage, onPageChange }) {
    if (lastPage <= 1) return null;

    const getPages = () => {
        const totalPages = lastPage;
        const maxPagesToShow = 5;
        const pages = [];

        // --- Always show first page ---
        pages.push(1);

        // If only few pages, just show all
        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 2; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Determine sliding window around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        // If near the start
        if (currentPage <= 3) {
            start = 2;
            end = maxPagesToShow;
        }

        // If near the end
        if (currentPage >= totalPages - 2) {
            start = totalPages - maxPagesToShow + 1;
            end = totalPages - 1;
        }

        // Add dots before window if needed
        if (start > 2) {
            pages.push("...");
        }

        // Add middle pages (NO DUPLICATES)
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add dots after window if needed
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page
        pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            {/* PREVIOUS */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
            >
                Previous
            </button>

            {/* PAGE NUMBERS */}
            {pages.map((page, index) =>
                page === "..." ? (
                    <span key={index} className="px-3 py-2 text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded ${
                            page === currentPage
                                ? "bg-blue-700 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            {/* NEXT */}
            <button
                disabled={currentPage === lastPage}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
