"use client";

import { createContext, useEffect, useState } from "react";

export const OrderContext = createContext({});

export function OrderContextProvider({ children }) {
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
      orderItems.reduce((acc, item) => acc + item.orderItemTotal, 0)
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

  function incrementItem(index) {
    if (orderItems[index].amount < orderItems[index].item.quantity) {
      setOrderItems((prev) => {
        const updatedItems = prev.map((oi, i) => {
          if (i === index) {
            const updatedAmount = oi.amount + 1;
            return {
              ...oi,
              amount: updatedAmount,
              orderItemTotal: updatedAmount * oi.item.cost,
            };
          }
          return oi;
        });
        ls?.setItem("orderItems", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  }

  function decrementItem(index) {
    if (orderItems[index].amount > 1) {
      setOrderItems((prev) => {
        const updatedItems = prev.map((oi, i) => {
          if (i === index && oi.amount > 1) {
            const updatedAmount = oi.amount - 1;
            return {
              ...oi,
              amount: updatedAmount,
              orderItemTotal: updatedAmount * oi.item.cost,
            };
          }
          return oi;
        });
        ls?.setItem("orderItems", JSON.stringify(updatedItems));
        return updatedItems;
      });
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        setOrderItems,
        addItem,
        calcTotal,
        incrementItem,
        decrementItem,
        deleteItem,
        updateItem,
        clearItems,
        loading,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
