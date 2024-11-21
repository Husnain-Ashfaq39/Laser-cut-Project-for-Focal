import { useEffect } from "react";
import { fetchDocuments } from "@/services/db-services";
import { useDispatch } from "react-redux";
import {
  setCuttingTechnologies,
  setMaterials,
} from "@/redux/slices/quote-parts-slice";

// Custom hook to fetch cutting technologies and materials
export const useFetchCuttingTechnologiesAndMaterials = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cuttingTechnologies = await fetchDocuments("CuttingTechs");
        const materials = await fetchDocuments("Materials");

        // Dispatch the fetched data to Redux store
        dispatch(setCuttingTechnologies(cuttingTechnologies));
        dispatch(setMaterials(materials));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);
};
