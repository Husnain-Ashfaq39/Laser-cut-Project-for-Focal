import React, { useState } from "react";

const ImagePreview: React.FC<{ imageUrl: string }> = ({ imageUrl }) => {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="w-[80px]">
      {showImage ? (
        <img
          src={imageUrl}
          alt="Part Image"
          className="max-w-full"
          onClick={() => setShowImage(false)} // Hide image on click
          style={{ cursor: "pointer" }}
        />
      ) : (
        <span
          onClick={() => setShowImage(true)} // Show image on click
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          Preview
        </span>
      )}
    </div>
  );
};

export default ImagePreview;
