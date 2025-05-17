"use client";
import Image from "next/image";
import "@/app/cart/cart.css";
import FormInput from "@/components/controls/form/input/FormInput";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { useEffect, useState, useContext } from "react";
import { Loading } from "@/components/controls/loading/Loading";
import Link from "next/link";
import { OrderContext } from "@/components/contexts/OrderContext";
import { CldImage } from "next-cloudinary";
import { userSchema } from "@/lib/schema";
import { FaChevronDown, FaChevronUp, FaTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import FormRow from "@/components/controls/form/row/FormRow";
import { useRouter } from "next/navigation";

import { getSettings } from "@/lib/settingActions";
import { createOrder } from "@/lib/orderActions";

export const dynamic = "force-dynamic";

const Cart = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const {
    orderItems,
    setOrderItems,
    incrementItem,
    decrementItem,
    deleteItem,
    clearItems,
  } = useContext(OrderContext);

  const [pending, setPending] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    phone: "",
    email: "",
    location: 0,
  });

  const [settings, setSettings] = useState({});

  const [errors, setErrors] = useState([]);

  const [locations, setLocations] = useState([
    { name: "Local Pickup", cost: 0 },
  ]);

  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setPending(false);
    (async () => {
      try {
        const set = await getSettings();
        setSettings(set[0]);
        console.log("settings", set[0]);
        const loc = set[0].locations;
        setLocations(loc);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName,
        lastName: session.user.firstName,
        city: session.user.city,
        street: session.user.street,
        phone: session.user.phone,
        email: session.user.email,
        location: 0,
      });
      setUserId(session?.user?._id);
    }
    console.log("It worked.");
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setPending(true);
    e.preventDefault();

    const total =
      Number(
        orderItems.reduce((acc, oi) => {
          return acc + oi.orderItemTotal;
        }, 0)
      ) + Number(locations[formData.location].cost);

    const customerData = {
      firstName: formData.firstName,
      lastName: formData.firstName,
      city: formData.city,
      street: formData.street,
      phone: formData.phone,
      email: formData.email,
      password: "Ordering1!",
    };

    const validationResult = userSchema.safeParse(customerData);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(
        (issue) => `${issue.message}`
      );
      setErrors(errors);
      return;
    }

    const pickupLocation =
      locations[formData.location].name +
      ": $" +
      String(Number(locations[formData.location].cost).toFixed(2));

    delete customerData.password;

    const data = {
      total,
      customerData,
      orderItems,
      pickupLocation,
      userId: userId ? userId : "",
    };

    const response = await createOrder(data);
    console.log("res", response);
    if (response.errors) {
      setPending(false);
      setErrors(response.errors);
    } else {
      toast.success("Order successfully placed");

      window.location.href = response.data.url;
    }
  };

  return (
    <main>
      <section className="container">
        {orderItems.length > 0 ? (
          <div className="cart-container">
            <div className="cart-wrapper">
              <div className="cart-title">Cart</div>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th className="table-title">Name</th>
                    <th className="table-title">Size</th>
                    <th className="table-title">Color</th>
                    <th className="table-title">Cost</th>
                    <th className="table-title">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems &&
                    orderItems.length > 0 &&
                    orderItems.map((oi, i) => (
                      <tr key={i}>
                        <td className="table-name">
                          <div
                            className="table-image"
                            onClick={() => {
                              router.push(`/shop/${oi.item._id}`);
                            }}
                          >
                            <CldImage
                              src={oi.item.image}
                              fill
                              alt="product image"
                              defaultImage="404_lztxti.png"
                            />
                            <span className="product-quantity">
                              {oi.amount}
                            </span>
                          </div>
                          {oi.item.name}
                        </td>
                        <td>
                          <span>{oi.size && oi.size}</span>
                        </td>
                        <td>
                          <span>{oi.color && oi.color}</span>
                        </td>

                        <td>
                          $
                          {`${Number(oi.cartItemCost).toFixed(2)} x ${
                            oi.amount
                          } = $${Number(oi.orderItemTotal).toFixed(2)}`}{" "}
                          TTD
                        </td>
                        <td>
                          <div className="table-actions">
                            <div
                              className="table-action-increment table-action"
                              onClick={() => {
                                incrementItem(i);
                              }}
                            >
                              <FaChevronUp />
                            </div>
                            <div
                              className="table-action-delete table-action"
                              onClick={() => {
                                deleteItem(i);
                              }}
                            >
                              <FaTrashCan />
                            </div>
                            <div
                              className="table-action-decrement table-action"
                              onClick={() => {
                                decrementItem(i);
                              }}
                            >
                              <FaChevronDown />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="table-cost final">Shipping:</td>
                    <td className="table-cost final">
                      ${Number(locations[formData.location].cost).toFixed(2)}{" "}
                      TTD
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="table-cost final">Total:</td>
                    <td className="table-cost final">
                      $
                      {(
                        Number(
                          orderItems.reduce((acc, oi) => {
                            return acc + oi.orderItemTotal;
                          }, 0)
                        ) + Number(locations[formData.location].cost)
                      ).toFixed(2)}{" "}
                      TTD
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
                <FormInput
                  label="Enter your email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={false}
                  validationSchema={userSchema.shape.email}
                />
                <FormRow>
                  <FormInput
                    label="Enter your first name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.firstName}
                  />
                  <FormInput
                    label="Enter your last name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.lastName}
                  />
                </FormRow>
                <FormInput
                  label="Enter your phone number"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={true}
                  validationSchema={userSchema.shape.phone}
                />
                <FormRow>
                  <FormInput
                    label="Enter your city name"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.city}
                  />
                  <FormInput
                    label="Enter your street name"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.street}
                  />
                </FormRow>
                {locations && (
                  <FormInput
                    label="Shipping"
                    type="radio"
                    name="location"
                    options={locations.map((loc, i) => ({
                      displayValue: `${loc.name}${
                        Number(loc.cost) > 0 ? ": $" : ""
                      }${
                        Number(loc.cost) > 0 ? Number(loc.cost).toFixed() : ""
                      }`,
                      value: i,
                    }))}
                    value={formData.location}
                    onChange={handleChange}
                  />
                )}
                <div className="checkout-button-container">
                  <button
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                    className="checkout-button"
                    disabled={pending}
                  >
                    {pending ? "Wait A Sec..." : "Submit"}
                  </button>
                </div>
                <ErrorContainer errors={errors} />
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
