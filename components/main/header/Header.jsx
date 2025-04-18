"use client";

import {
  NavLinks,
  NavLinksUser,
  NavLinksMain,
  NavLinksMobileMain,
} from "@/components/links/links";
import Image from "next/image";
import "@/components/main/header/header.css";
import Link from "next/link";
import { useState, useEffect, useContext, Suspense } from "react";
import { CartContext } from "@/components/controls/Contexts/CartProvider";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { handleSignOut } from "@/lib/actions/authActions";

export const dynamic = "force-dynamic";

const Header = () => {
  const { data: session } = useSession();
  console.log("Session", session);
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const [isAnimating, setIsAnimating] = useState(false);
  const [Velocity, setVelocity] = useState(null); // State to hold the Velocity function
  const [curPath, setCurPath] = useState(" ");
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    (async () => {
      const velocity = (await import("velocity-animate")).default; // Dynamically import Velocity
      setVelocity(() => velocity);
    })();
  }, []);

  const handleMobileMenuClick = (e) => {
    if (!Velocity || isAnimating) return; // Ensure Velocity is loaded before proceeding

    var McButton = e.currentTarget;
    var McBar1 = McButton.querySelector("b:nth-child(1)"); // First <b> tag
    var McBar3 = McButton.querySelector("b:nth-child(3)"); // Third <b> tag
    var dropdown = document.querySelector(".subnav-dropdown");
    console.log(dropdown);

    McButton.classList.toggle("active");
    dropdown.classList.toggle("menu-active");
    setIsAnimating(true); // Set animating flag

    if (McButton.classList.contains("active")) {
      dropdown.style.display = "block";
      dropdown.classList.remove("fade-out");
      dropdown.classList.add("fade-in");
      // Animate McBar1 (move it to 50% from the top)
      Velocity(McBar1, { top: "50%" }, { duration: 200, easing: "swing" });

      // Animate McBar3 (move it to 50% and rotate it)
      Velocity(McBar3, { top: "50%" }, { duration: 200, easing: "swing" }).then(
        () => {
          return Velocity(
            McBar3,
            { rotateZ: "90deg" },
            { duration: 800, easing: [500, 20] }
          );
        }
      );

      // Rotate McButton
      Velocity(
        McButton,
        { rotateZ: "135deg" },
        { duration: 800, delay: 200, easing: [500, 20] }
      ).then(() => {
        setIsAnimating(false); // Animation is done, allow clicks again
      });
    } else {
      dropdown.classList.remove("fade-in");
      dropdown.classList.add("fade-out");

      // Wait for the fade-out animation to complete before removing the element
      dropdown.addEventListener(
        "animationend",
        () => {
          console.log("hi");
          dropdown.classList.remove("fade-out");
          dropdown.style.display = "none"; // Remove fade-out class after animation
          // Optionally, you can remove the dropdown from the DOM or hide it
        },
        { once: true }
      ); // Listen for the event only once
      // Reverse McButton's animation
      Velocity(McButton, "reverse");

      // Rotate McBar3 back to 0deg and move it back to 100% from the top
      Velocity(
        McBar3,
        { rotateZ: "0deg" },
        { duration: 800, easing: [500, 20] }
      ).then(() => {
        return Velocity(
          McBar3,
          { top: "100%" },
          { duration: 200, easing: "swing" }
        );
      });

      // Reverse McBar1's animation with a delay
      Velocity(McBar1, "reverse", { delay: 800 }).then(() => {
        setIsAnimating(false); // Animation is done, allow clicks again
      });
    }
  };

  useEffect(() => {
    setCurPath(`${currentPath + searchParams}`);
  }, [currentPath, searchParams, session]);

  return (
    <header>
      <nav className="nav-container">
        <div className="container nav-content-container">
          {Velocity && (
            <ul className="nav-links-container">
              {NavLinks.map((navLink) => (
                <li key={navLink.name} className="nav-link mobile-hide">
                  <Link
                    href={navLink.link}
                    className={`nav-link-text ${
                      currentPath === navLink.link ? "active" : ""
                    }`}
                  >
                    {navLink.name}
                  </Link>
                </li>
              ))}
              <div className="nav-logo-container">
                <Image
                  src="/images/logo.png"
                  alt="diving block logo"
                  className="nav-logo"
                  fill
                />
              </div>
              {NavLinksUser.map((navLink) => (
                <li key={navLink.name} className="nav-link mobile-hide">
                  <Link
                    href={navLink.link}
                    className={`nav-link-text ${
                      currentPath === navLink.link ? "active" : ""
                    }`}
                  >
                    {navLink.name}
                  </Link>
                </li>
              ))}
              {!session ? (
                <>
                  <li className="nav-link mobile-hide">
                    <Link
                      href={"/login"}
                      className={`nav-link-text ${
                        currentPath === "/login" ? "active" : ""
                      }`}
                    >
                      LOG IN
                    </Link>
                  </li>
                  <li className="nav-link mobile-hide">
                    <Link
                      href={"/register"}
                      className={`nav-link-text ${
                        currentPath === "/register" ? "active" : ""
                      }`}
                    >
                      REGISTER
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-link mobile-hide">
                    <Link
                      href={"/"}
                      className={`nav-link-text ${
                        currentPath === "/profile" ? "active" : ""
                      }`}
                    >
                      PROFILE
                    </Link>
                  </li>
                  <li className="nav-link mobile-hide">
                    <div
                      className={`nav-link-text ${
                        currentPath === "/profile" ? "active" : ""
                      }`}
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      SIGN OUT
                    </div>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </nav>
      {curPath && (
        <div key={curPath} className="subnav container">
          <ul className="subnav-links">
            {NavLinksMain.map((navLink) => (
              <li key={navLink.name} className="subnav-link mobile-hide">
                <Link href={navLink.link} className="subnav-link-text">
                  {navLink.name}
                </Link>
              </li>
            ))}
          </ul>

          <div
            onClick={handleMobileMenuClick}
            className="McButton mobile-show"
            data="hamburger-menu"
          >
            <b></b>
            <b></b>
            <b></b>
          </div>

          <div style={{ display: "none" }} className="subnav-dropdown">
            <div className="subnav-mobile-menu-links">
              {!session ? (
                <>
                  <div className="subnav-link-container">
                    <Link
                      href={"/login"}
                      className={"subnav-mobile-menu-link-text"}
                    >
                      LOG IN
                    </Link>
                  </div>
                  <div className="subnav-link-container">
                    <Link
                      href={"/register"}
                      className={"subnav-mobile-menu-link-text"}
                    >
                      REGISTER
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="subnav-link-container">
                    <Link href={"/"} className={"subnav-mobile-menu-link-text"}>
                      PROFILE
                    </Link>
                  </div>
                  <div className="subnav-link-container">
                    <div
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className={"subnav-mobile-menu-link-text"}
                    >
                      SIGN OUT
                    </div>
                  </div>
                </>
              )}

              {NavLinksMobileMain.map((navLink) => (
                <div className="subnav-link-container" key={navLink.name}>
                  <Link
                    href={navLink.link}
                    className="subnav-mobile-menu-link-text"
                  >
                    {navLink.name}
                  </Link>
                  {navLink.sublinks &&
                    navLink.sublinks.map((navSubLink) => (
                      <Link
                        key={`${navLink.name}${navSubLink.name}`}
                        href={navSubLink.link}
                        className="subnav-mobile-menu-link-text sublink"
                      >
                        {navSubLink.name}
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
