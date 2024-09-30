import ArrowRightLineIcon from "@rsuite/icons/ArrowRightLine";
import ArrowLeftLineIcon from "@rsuite/icons/ArrowLeftLine";
import PageEndIcon from "@rsuite/icons/PageEnd";
import PageTopIcon from "@rsuite/icons/PageTop";

export function Paginate({
  currentPage,
  totalPages,
  handlePageChange,
  hotel,
  hotalList,
}) {
  const displayRange = 3;

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - displayRange);
    let endPage = Math.min(totalPages, currentPage + displayRange);

    // Add ellipsis at the beginning if required
    if (startPage > 1) {
      pageNumbers.push("...");
    }

    // Add page numbers within the range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis at the end if required
    if (endPage < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  };


  return (
    <>
      <span>
        {("Page")} {currentPage} {("of")} {totalPages}, {("showing")} {hotel}{" "}
        {("records out of")} {hotalList} {("total")}
      </span>
      <nav aria-label="Page navigation example">
        <ul className="pagination mb-2 mb-sm-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{
                color: currentPage === 1 ? "#c9bcbc" : "",
                pointerEvents: "auto",
              }}
            >
              <PageTopIcon />
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                color: currentPage === 1 ? "#c9bcbc" : "",
                pointerEvents: "auto",
              }}
            >
              <ArrowLeftLineIcon />
            </button>
          </li>
          {getPageNumbers().map((pageNumber, index) => (
            <li
              className={`page-item ${
                currentPage === pageNumber ? "active" : ""
              }`}
              key={index}
            >
              {pageNumber === "..." ? (
                <span className="page-link">{pageNumber}</span>
              ) : (
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )}
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                color: currentPage === totalPages ? "#c9bcbc" : "",
                pointerEvents: "auto",
              }}
            >
              <ArrowRightLineIcon />
            </button>
          </li>
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link ms-2"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                color: currentPage === totalPages ? "#c9bcbc" : "",
                pointerEvents: "auto",
              }}
            >
              <PageEndIcon />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
