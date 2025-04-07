"use client";
import Image from "next/image";
import "@/app/cart/cart.css";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "@/components/controls/Contexts/CartProvider";
import { Loading } from "@/components/controls/loading/Loading";
import Link from "next/link";
export const dynamic = "force-dynamic";

const Cart = () => {
  const { cart, setCart } = useContext(CartContext);

  return (
    <main>
      <section className="container">
        {cart.length > 0 ? (
          <div className="cart-container">
            <div className="cart-wrapper">
              <div className="cart-title">Cart</div>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th className="table-title">Name</th>
                    <th className="table-title">Size or Color</th>
                    <th className="table-title">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {cart &&
                    cart.length > 0 &&
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td className="table-name">
                          <div className="table-image">
                            <Image src={item.image} fill alt="product image" />
                            <span className="product-quantity">
                              {item.quantity}
                            </span>
                          </div>
                          {item.name}
                        </td>
                        <td>
                          {item.attributes?.length > 0 &&
                            item.attributes.map((subitem, i) => (
                              <span key={i}>
                                {subitem.color && subitem.color}
                                {subitem.size && subitem.size}
                              </span>
                            ))}
                        </td>

                        <td>
                          $
                          {`${item.cost} x ${item.quantity} = ${item.totalcost}`}{" "}
                          TTD
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td className="table-cost final">Total:</td>
                    <td className="table-cost final">
                      {cart.reduce((acc, item) => {
                        return acc + item.cost * item.quantity;
                      }, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="checkout-container">
              <div>
                <h2 className="checkout-title">Checkout</h2>
              </div>
              <form className="checkout-form" action="submit">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" />
                <div className="checkout-form-row">
                  <div className="checkout-row-item">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" name="firstName" id="firstName" />
                  </div>
                  <div className="checkout-row-item">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" name="lastName" id="lastName" />
                  </div>
                </div>
                <div className="checkout-form-row">
                  <div className="checkout-row-item">
                    <label htmlFor="city">City:</label>
                    <input type="text" name="city" id="city" />
                  </div>
                  <div className="checkout-row-item">
                    <label htmlFor="address">Address:</label>
                    <input type="text" name="address" id="address" />
                  </div>
                </div>

                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  placeholder="+1 (868) 737-3857"
                  name="phone"
                  id="phone"
                />
                <div className="checkout-button-container">
                  <button className="checkout-button">Submit</button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="cart-fallback-container">
            <div className="cart-fallback">
              <div className="cart-title">Cart</div>
              <div>There are no Items in your Cart</div>
              <Link href="/shop">Go Back</Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Cart;
