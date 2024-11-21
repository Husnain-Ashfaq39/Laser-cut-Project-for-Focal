import { Button } from "@/components/_ui/button";
import leftsvg from "@/assets/icons/left.svg";
import rightsvg from "@/assets/icons/right.svg";

function MaterialPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mb-4 flex justify-center space-x-4">
      {/* Previous Button */}
      <img
        src={leftsvg}
        className={`cursor-pointer ${currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        alt="Previous Page"
      />

      {/* Page Number Buttons */}
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          className="rounded-full"
          key={index}
          variant={currentPage === index + 1 ? "destructive" : "default"}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Button>
      ))}

      {/* Next Button */}
      <img
        src={rightsvg}
        className={`cursor-pointer ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        alt="Next Page"
      />
    </div>
  );
}

export default MaterialPagination;
