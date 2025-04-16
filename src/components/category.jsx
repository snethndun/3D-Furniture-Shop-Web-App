import React, { useState } from "react";

const categories = [
  {
    id: 1,
    name: "Living Room",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    count: 124,
  },
  {
    id: 2,
    name: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    count: 86,
  },
  {
    id: 3,
    name: "Dining",
    image:
      "https://images.unsplash.com/photo-1617104678098-de229db51175?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    count: 78,
  },
  {
    id: 4,
    name: "Office",
    image:
      "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    count: 42,
  },
];

const CategorySection = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleClick = (categoryName) => {
    setSelectedCategory(categoryName);
    onSelectCategory(categoryName);
  };

  return (
    <section className="py-10 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div
              key={category.id}
              onClick={() => handleClick(category.name)}
              className={`group relative rounded-lg overflow-hidden shadow-md transition-shadow cursor-pointer ${
                isSelected ? "ring-4 ring-indigo-500" : "hover:shadow-xl"
              }`}
            >
              <div className="aspect-[3/4]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                </h3>
                <p className="text-indigo-300 text-sm">
                  {category.count} products
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
