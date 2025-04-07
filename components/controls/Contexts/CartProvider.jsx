"use client";

import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({});

export function CartProvider({ children }) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderItems?.length > 0) {
      ls?.setItem("orderItems", JSON.stringify(orderItems));
    }
  }, [orderItems]);

  useEffect(() => {
    setLoading(true);
    if (ls && ls.getItem("orderItems")) {
      setOrderItems(JSON.parse(ls.getItem("orderItems")));
    }
    setLoading(false);
  }, []);

  function addItem(item) {
    setOrderItems((prev) => {
      const updatedItems = [...prev, item];
      ls?.setItem("orderItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  function deleteItem(index) {
    setOrderItems((prev) => {
      const updatedItems = prev.filter((_, i) => i !== index);
      ls?.setItem("orderItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  function calcTotal() {
    const total = Number(
      orderItems.reduce((acc, item) => acc + item.orderItemtotal, 0)
    );

    return total;
  }

  function updateItem(index, updatedItem) {
    setOrderItems((prev) => {
      const updatedItems = prev.map((item, i) =>
        i === index ? updatedItem : item
      );
      ls?.setItem("orderItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  function clearItems() {
    const items = [];
    setOrderItems(items);
    ls?.setItem("orderItems", JSON.stringify([]));
  }

  return (
    <CartContext.Provider
      value={{
        orderItems,
        setOrderItems,
        addItem,
        calcTotal,
        deleteItem,
        updateItem,
        clearItems,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
