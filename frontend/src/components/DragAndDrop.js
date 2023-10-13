import React from 'react';
import styles from '../Css/ReactionForm.module.css';

export default function DragAndDrop({ items, setItems }) {
  const onDragStart = (e, index) => {
    e.dataTransfer.setData('itemIndex', index);
  };

  const onDrop = (e, index) => {
    const fromIndex = Number(e.dataTransfer.getData('itemIndex'));
    const newItems = [...items];
    [newItems[fromIndex], newItems[index]] = [newItems[index], newItems[fromIndex]];
    setItems(newItems);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles["drag-area"]}>
        <div className={styles["bordered-box"]}>
      {items.map((item, index, array) => (
        <>
          <div
            key={index}
            className={styles["draggable-item"]}
            draggable={true}
            onDragStart={(e) => onDragStart(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragOver={onDragOver}
          >
            {item}
          </div>
          {index < array.length - 1 && <div className={styles["divider"]}></div>}
        </>
      ))}
      </div>
    </div>
  );
      }  