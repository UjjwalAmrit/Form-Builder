import React, { useState, useEffect } from 'react';
import './CategorizeRenderer.css'; // Make sure the stylesheet is imported

const CategorizeRenderer = ({ question, value, onChange }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState({});
  // State to handle the drag-over visual feedback
  const [dragOverCategory, setDragOverCategory] = useState(null);

  useEffect(() => {
    // Logic to correctly populate items and categories from props
    const initialCategories = value || {};
    const placedItems = new Set(Object.values(initialCategories).flat().map(i => i.text));
    const remainingItems = question.items.filter(item => !placedItems.has(item.text));

    setItems(remainingItems);
    setCategories(initialCategories);
  }, [question, value]);

  const onDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const onDragOver = (e, category) => {
    e.preventDefault();
    setDragOverCategory(category);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOverCategory(null);
  };

  const onDrop = (e, category) => {
    e.preventDefault();
    setDragOverCategory(null);
    const item = JSON.parse(e.dataTransfer.getData('application/json'));
    
    const newCategories = { ...categories };
    // Remove the item from any other category it might be in
    Object.keys(newCategories).forEach(cat => {
      newCategories[cat] = newCategories[cat].filter(i => i.text !== item.text);
    });

    if (!newCategories[category]) {
      newCategories[category] = [];
    }
    newCategories[category].push(item);
    
    onChange(newCategories);
  };

  const removeFromCategory = (category, itemToRemove) => {
    const newCategories = { ...categories };
    newCategories[category] = newCategories[category].filter(item => item.text !== itemToRemove.text);
    
    if (newCategories[category].length === 0) {
      delete newCategories[category];
    }
    
    onChange(newCategories);
  };

  return (
    <div className="categorize-renderer">
      <div className="items-section">
        <h4>Items to Categorize:</h4>
        <div className="items-bank">
          {items.map((item, index) => (
            <div
              key={index}
              className="draggable-item"
              draggable
              onDragStart={(e) => onDragStart(e, item)}
            >
              {item.text}
            </div>
          ))}
          {items.length === 0 && (
            <p className="items-bank-placeholder">
              All items have been categorized
            </p>
          )}
        </div>
      </div>

      <div className="categories-section">
        <h4>Categories:</h4>
        <div className="categories-grid">
          {question.categories.map((category, index) => (
            <div key={index} className="category-box">
              <h5 className="category-title">{category}</h5>
              <div
                className={`drop-zone ${dragOverCategory === category ? 'drag-over' : ''}`}
                onDragOver={(e) => onDragOver(e, category)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, category)}
              >
                {categories[category] && categories[category].length > 0 ? (
                  categories[category].map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="dropped-item"
                      onClick={() => removeFromCategory(category, item)}
                      title="Click to remove"
                    >
                      {item.text}
                    </div>
                  ))
                ) : (
                  <p className="drop-zone-placeholder">Drag items here</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorizeRenderer;