import React from "react";

function Pagination({ currentPage, lastPage, onPageChange }) {
    const totalPages = Number(lastPage) || 1;
    const safeCurrentPage = Math.min(
        Math.max(Number(currentPage) || 1, 1),
        totalPages,
    );

    if (totalPages <= 1) {
        return null;
    }

    const getPages = () => {
        const maxPagesToShow = 5;
        const pages = [];

        // Always show first page.
        pages.push(1);

        // If only few pages, show all page buttons.
        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 2; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // Determine sliding window around current page.
        let start = Math.max(2, safeCurrentPage - 1);
        let end = Math.min(totalPages - 1, safeCurrentPage + 1);

        // If near the start, keep window on left side.
        if (safeCurrentPage <= 3) {
            start = 2;
            end = maxPagesToShow;
        }

        // If near the end, keep window on right side.
        if (safeCurrentPage >= totalPages - 2) {
            start = totalPages - maxPagesToShow + 1;
            end = totalPages - 1;
        }

        // Add dots before window if needed.
        if (start > 2) {
            pages.push("...");
        }

        // Add middle pages.
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add dots after window if needed.
        if (end < totalPages - 1) {
            pages.push("...");
        }

        // Always show last page.
        pages.push(totalPages);

        const uniquePages = [];
        const seenPageNumbers = new Set();

        for (const page of pages) {
            if (typeof page === "number") {
                if (!seenPageNumbers.has(page)) {
                    seenPageNumbers.add(page);
                    uniquePages.push(page);
                }
                continue;
            }

            const isLastEllipsis =
                uniquePages[uniquePages.length - 1] === "...";

            if (!isLastEllipsis) {
                uniquePages.push(page);
            }
        }

        return uniquePages;
    };

    const pages = getPages();

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            {/* PREVIOUS */}
            <button
                disabled={safeCurrentPage === 1}
                onClick={() => onPageChange(safeCurrentPage - 1)}
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
            >
                Previous
            </button>

            {/* PAGE NUMBERS */}
            {pages.map((page, index) =>
                page === "..." ? (
                    <span
                        key={`pagination-ellipsis-${index}`}
                        className="px-3 py-2 text-gray-500"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={`pagination-page-${page}-${index}`}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded ${
                            page === safeCurrentPage
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
                disabled={safeCurrentPage === totalPages}
                onClick={() => onPageChange(safeCurrentPage + 1)}
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50 hover:bg-gray-200"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
