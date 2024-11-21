import deletesvg from "@/assets/icons/delete.svg";

function MaterialCard({ material, isSelected, onClick, onDelete }) {
  return (
    <div
      key={material.id}
      className={`transform cursor-pointer rounded-lg border bg-white p-6 shadow-md transition-transform hover:scale-105 ${
        isSelected ? "border-blue-500" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{material.name}</h2>
        <img
          src={deletesvg}
          alt="Delete"
          className="h-5 w-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </div>
      <div className="text-gray-600">
        <p>Sheets: {material.sheets ? material.sheets.length : 0}</p>
      </div>
    </div>
  );
}

export default MaterialCard;
