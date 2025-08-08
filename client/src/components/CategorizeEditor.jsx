import React, { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import './CategorizeEditor.css'; // Make sure the stylesheet is imported

const CategorizeEditor = ({ question, onChange }) => {
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState('');

  const addCategory = () => {
    if (newCategory.trim()) {
      onChange({
        ...question,
        categories: [...(question.categories || []), newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (index) => {
    const updatedCategories = question.categories.filter((_, i) => i !== index);
    onChange({
      ...question,
      categories: updatedCategories,
      items: (question.items || []).filter(item => 
        updatedCategories.includes(item.correctCategory)
      )
    });
  };

  const addItem = () => {
    if (newItem.trim() && question.categories && question.categories.length > 0) {
      onChange({
        ...question,
        items: [...(question.items || []), {
          text: newItem.trim(),
          correctCategory: question.categories[0]
        }]
      });
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    onChange({
      ...question,
      items: (question.items || []).filter((_, i) => i !== index)
    });
  };

  const updateItemCategory = (itemIndex, category) => {
    const updatedItems = [...(question.items || [])];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], correctCategory: category };
    onChange({ ...question, items: updatedItems });
  };

  return (
    <div>
      <div className="form-group">
        <label>Question Text</label>
        <input
          type="text"
          className="form-control"
          value={question.questionText || ''}
          onChange={(e) => onChange({ ...question, questionText: e.target.value })}
          placeholder="Enter the instruction (e.g., 'Sort the animals')"
        />
      </div>

      <div className="form-group">
        <label>Categories</label>
        <div className="editor-input-group">
          <input
            type="text"
            className="form-control"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); }}}
          />
          <button type="button" onClick={addCategory} className="editor-add-btn">
            <FiPlus />
          </button>
        </div>
        
        <div className="category-pills-container">
          {(question.categories || []).map((category, index) => (
            <div key={index} className="category-pill">
              <span>{category}</span>
              <button type="button" onClick={() => removeCategory(index)} className="pill-remove-btn">
                <FiX size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Items to Categorize</label>
        <div className="editor-input-group">
          <input
            type="text"
            className="form-control"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter item text"
            onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); }}}
          />
          <button
            type="button"
            onClick={addItem}
            className="editor-add-btn"
            disabled={!question.categories || question.categories.length === 0}
          >
            <FiPlus />
          </button>
        </div>

        {(question.items || []).map((item, index) => (
          <div key={index} className="item-row">
            <span className="item-text">{item.text}</span>
            <select
              value={item.correctCategory}
              onChange={(e) => updateItemCategory(index, e.target.value)}
              className="item-category-select"
            >
              {(question.categories || []).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => removeItem(index)} className="item-remove-btn">
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorizeEditor;