// components/quotes/create-quote/AddParts.tsx
import { FunctionComponent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearparts } from "@/redux/slices/quote-parts-slice";
import { RootState } from "@/redux/store";
import NavbarAdmin from "@/components/nav/navbar-admin";
import FooterAdmin from "@/components/footer/footer-admin";
import FileUpload from "@/components/quotes/create-quote/file-upload";
import CreateNewQuoteSteper from "@/components/quotes/create-quote/steper";
import Parts from "@/components/quotes/create-quote/part/parts";
import AddOtherParts from "@/components/quotes/create-quote/add-other-parts";
import { Button } from "@/components/_ui/button";
import { toast } from "@/components/_ui/toast/use-toast";
import HorizontalDivider from "@/assets/quotes/horizontal-divider.svg";
import { useSavePartsAndQuote } from "@/services/db-services";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCuttingTime } from "@/utils/format-cutting-time";

const AddParts: FunctionComponent = () => {
  // Destructure savePartsAndQuote and loading from the hook
  const { savePartsAndQuote, loading: saveLoading } = useSavePartsAndQuote(
    "draft",
    "no",
  );

  const Quote = useSelector((state: RootState) => state.quoteParts);
  const user = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [invalidParts, setInvalidParts] = useState([]);
  const [oversizedParts, setOversizedParts] = useState([]);
  const [fileDimensions, setFileDimensions] = useState({});

  const partsRef = useRef(null);

  // Generate PDF
  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Parts Details - Quote ${Quote.id}`, 10, 10);

    // Format data for autoTable
    const tableData = Quote.parts.map((part) => [
      part.name || "Unnamed Part",
      `${fileDimensions[part.id].width} x ${fileDimensions[part.id].height} mm`,
      part.quantity,
      part.material.name,
      `${part.thickness} mm`,
      `${part.size.width} x ${part.size.height} mm`,
      `${formatCuttingTime(part.cuttingTime * part.quantity)}`,
      `$${part.totalCost.toFixed(2)}`,
    ]);

    // Pass `pdf` as the first argument and `options` as the second
    autoTable(pdf, {
      head: [
        [
          "Name",
          "Dimensions",
          "Quantity",
          "Material",
          "Thickness",
          "Size",
          "Cutting Time",
          "Total Cost ($)",
        ],
      ],
      body: tableData,
      startY: 20, // Position the table below the title
    });

    pdf.save(`Parts_Details_Quote_${Quote.id}.pdf`);
  };

  const handleCancel = () => {
    dispatch(clearparts());
    navigate(user.role === "admin" ? "/admin/quotes" : "/quotes/history");
  };
  const handleSaveOrNext = (action: "save" | "next") => {
    if (Quote.parts.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one part",
        duration: 3000,
      });
      return;
    }

    // Separate errors for missing fields and size mismatch
    const invalidParts = [];
    const oversizedParts = [];

    Quote.parts.forEach((part) => {
      const missingFields = [];

      // Check for missing fields
      if (!part.material) missingFields.push("material");
      if (!part.cuttingTechnology) missingFields.push("cuttingTechnology");
      if (!part.thickness) missingFields.push("thickness");
      if (!part.size) missingFields.push("size");
      if (part.quantity <= 0) missingFields.push("quantity");
      // Check if part dimensions exceed selected sheet size
      if (part.size && fileDimensions[part.id]) {
        const sheetWidth = part.size.width;
        const sheetHeight = part.size.height;
        const partDimensions = fileDimensions[part.id];

        if (
          partDimensions.width > sheetWidth ||
          partDimensions.height > sheetHeight
        ) {
          oversizedParts.push(part.id);
        }
      }

      if (missingFields.length) {
        invalidParts.push({ id: part.id, missingFields });
      }
    });

    setOversizedParts(oversizedParts);
    setInvalidParts(invalidParts); // Update state for invalid fields

    // Display toast messages based on error type
    if (invalidParts.length > 0) {
      const description =
        invalidParts.length <= 3
          ? `Please complete missing fields for parts: ${invalidParts
              .slice(0, 3)
              .map(
                (part) =>
                  `"${Quote.parts.find((p) => p.id === part.id)?.name || `Unnamed Part (${part.id})`}"`,
              )
              .join(", ")}.`
          : "Multiple parts need additional information. Please review all parts.";

      toast({
        variant: "destructive",
        title: "Error",
        description,
        duration: 5000,
      });
      return;
    }

    // Display specific toast for oversized parts
    if (oversizedParts.length > 0) {
      const oversizedDescription =
        oversizedParts.length <= 3
          ? `Part dimensions exceed sheet size for: ${oversizedParts
              .slice(0, 3)
              .map(
                (id) =>
                  `"${Quote.parts.find((p) => p.id === id)?.name || `Unnamed Part (${id})`}"`,
              )
              .join(", ")}.`
          : "Multiple parts exceed the selected sheet size. Please review all parts.";

      toast({
        variant: "destructive",
        title: "Size Error",
        description: oversizedDescription,
        duration: 5000,
      });
      return;
    }

    // Save or navigate if no errors are found
    if (action === "save") savePartsAndQuote();
    if (action === "next") navigate("/quotes/new-quote/summary");
  };

  return (
    <div className="w-full bg-slate-100">
      <NavbarAdmin />
      <main className="m-auto flex min-h-screen flex-col px-[5%] py-5">
        <h1 className="text-center font-primary text-3xl">
          Create a new quote
        </h1>
        <CreateNewQuoteSteper currentStep={1} />
        <h2 className="font-primary text-2xl">Add Parts</h2>
        <div className="mt-4 flex min-h-[650px] min-w-[500px] flex-col rounded-xl border bg-white shadow-sm">
          {Quote.status !== "uneditable" && (
            <>
              <FileUpload />
              <AddOtherParts />
              <img src={HorizontalDivider} className="mt-12 px-6" />
            </>
          )}
          <img src={HorizontalDivider} className="px-6" />
          <div ref={partsRef}>
            <Parts
              invalidParts={invalidParts}
              oversizedParts={oversizedParts}
              fileDimensions={fileDimensions}
              setFileDimensions={setFileDimensions}
            />
          </div>
        </div>
         {Quote.status==='draft' && ( 
        <div className="m-auto flex w-full flex-row justify-between space-x-4 px-2 py-2">
          <div>
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="mr-2 rounded-full border bg-white"
              disabled={saveLoading} // Disable button when saving
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveOrNext("save")}
              variant="default"
              className="mr-2 rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
            >
              {saveLoading
                ? "Saving..."
                : Quote.id !== ""
                  ? "Update Quote Draft"
                  : "Save Quote as Draft"}
            </Button>
            <Button
              onClick={downloadPDF}
              variant="default"
              className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
            >
              Download PDF
            </Button>
          </div>
          <Button
            onClick={() => handleSaveOrNext("next")}
            variant="default"
            className="rounded-full bg-black px-6 py-2 text-white hover:bg-gray-900"
          >
            Next
          </Button>
        </div>)}
      </main>
      <FooterAdmin />
    </div>
  );
};

export default AddParts;
