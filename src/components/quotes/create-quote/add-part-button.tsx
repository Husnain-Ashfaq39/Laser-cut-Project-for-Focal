import { useNavigate } from "react-router-dom";

const AddPartButton = ({ label, takesTo: destination }) => {
  const navigate = useNavigate()
  return (
    <button className="m-auto flex rounded-xl border border-gray-500 bg-transparent px-14 py-1 font-sm font-medium text-[#518EF8]"
    onClick={()=>(navigate(`/quotes/new-quote/${destination}`))}>
      {label}
    </button>
  );
};

export default AddPartButton;
