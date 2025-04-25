import React from "react";

const ModelCard = ({ modelName, modelPath, onClick }) => {
  return (
    <div
      onClick={() => onClick(modelPath)}
      className="cursor-pointer border rounded-lg p-4 hover:shadow-xl transition"
    >
      <img
        src={`/thumbnails/${modelName}.png`} // Add preview images manually in /public/thumbnails
        alt={modelName}
        className="w-full h-40 object-contain mb-2"
      />
      <h3 className="text-center font-semibold">{modelName}</h3>
    </div>
  );
};

export default ModelCard;
