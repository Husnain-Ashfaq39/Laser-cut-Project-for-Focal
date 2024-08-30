import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import svgs from "../../data/svgs.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/_ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/_ui/pagination";
import NavbarAdmin from "@/components/nav/navbar-admin";
import FooterAdmin from "@/components/footer/fouter-admin";

const ParametricLibrary: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialCategory =
    location.state?.selectedCategory || svgs[0]?.mainCategory || "";

  const [selectedCategory, setSelectedCategory] =
    React.useState(initialCategory);
  const [shapes, setShapes] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const shapesPerPage = 4;

  React.useEffect(() => {
    handleCategoryChange(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const selectedCategoryData = svgs.find(
      (item) => item.mainCategory === category,
    );
    setShapes(selectedCategoryData ? selectedCategoryData.subCategories : []);
    setCurrentPage(1);
  };

  const handleShapeClick = (shape) => {
    const shapeNameInRoute = shape.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/quotes/new-quote/quick-part/${shapeNameInRoute}`, {
      state: { shape, selectedCategory },
    });
  };

  const indexOfLastShape = currentPage * shapesPerPage;
  const indexOfFirstShape = indexOfLastShape - shapesPerPage;
  const currentShapes = shapes.slice(indexOfFirstShape, indexOfLastShape);
  const totalPages = Math.ceil(shapes.length / shapesPerPage);

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 font-secondary">
      <NavbarAdmin />
      <main className="flex w-full flex-col items-center p-6">
        <h3 className="mb-6 text-2xl font-semibold">PARAMETRIC LIBRARY</h3>
        <section className="w-full max-w-7xl rounded-lg border border-gray-300 bg-white p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="mb-6 w-full md:mb-0 md:w-2/5">
              <div className="mb-6">
                <Link
                  to="/quotes/new-quote"
                  state={{ selectedCategory: location.state?.selectedCategory }}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Go back to Creating New Quote
                </Link>
              </div>
              <b className="mb-4 block font-semibold">Please Select Category</b>
              <Select
                onValueChange={handleCategoryChange}
                defaultValue={selectedCategory}
              >
                <SelectTrigger className="w-full font-medium">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>
                <SelectContent className="font-secondary font-medium">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {svgs.map((item) => (
                      <SelectItem
                        key={item.mainCategory}
                        value={item.mainCategory}
                      >
                        {item.mainCategory}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-3/5">
              <a className="mb-4 block text-lg font-semibold">
                Please select your shape:
              </a>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {currentShapes.map((shape, index) => (
                  <div
                    key={index}
                    onClick={() => handleShapeClick(shape)}
                    className="cursor-pointer"
                  >
                    <div
                      className="flex h-72 items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: shape.svgPreview }}
                    />
                    <p className="my-9 text-center">{shape.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {shapes.length > shapesPerPage && (
            <div className="mt-6 flex w-full justify-end">
              <div className="flex">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, pageIndex) => (
                      <PaginationItem key={pageIndex}>
                        <PaginationLink
                          href="#"
                          isActive={pageIndex + 1 === currentPage}
                          onClick={() => setCurrentPage(pageIndex + 1)}
                        >
                          {pageIndex + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </section>
      </main>
      <FooterAdmin />
    </div>
  );
};

export default ParametricLibrary;
