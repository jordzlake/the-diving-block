import "@/components/main/footer/footer.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content-container">
        <div className="footer-content-top">
          <div className="footer-image-container">
            <Image src="/images/logo.png" alt="footer-logo" fill />
          </div>
          <p className="footer-content-top-text">
            {" "}
            We are based in Trinidad and Tobago
          </p>
        </div>
        <div className="footer-content-grid">
          <div className="footer-content-grid-item">
            <h2 className="footer-content-grid-title">About Us</h2>
            <p className="footer-content-grid-text">
              The Diving Block was established in 2018 with the purpose of
              providing a local supply of swimwear
            </p>
          </div>
          <div className="footer-content-grid-item">
            <h2 className="footer-content-grid-title">Quick Links</h2>
            <ul className="footer-content-grid-links">
              <li>
                <Link href="/" className="footer-content-grid-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="footer-content-grid-link">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-content-grid-link">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-content-grid-link">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="footer-content-grid-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-content-grid-item">
            <h2 className="footer-content-grid-title">Contact</h2>
            <p className="footer-content-grid-text">+1 (868) 314-3157</p>
            <p className="footer-content-grid-text">info@thedivingblock.com</p>
          </div>
          <div className="footer-content-grid-item">
            <h2 className="footer-content-grid-title">Follow</h2>
            <ul className="footer-content-grid-links">
              <li>
                <Link
                  className="footer-content-grid-link"
                  href="https://www.facebook.com/thedivingblock/"
                >
                  <span className="footer-content-brand-logo">
                    <FontAwesomeIcon icon={faFacebook} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Facebook
                </Link>
              </li>
              <li>
                <Link
                  className="footer-content-grid-link"
                  href="https://www.instagram.com/thedivingblock/"
                >
                  <span className="footer-content-brand-logo">
                    <FontAwesomeIcon icon={faInstagram} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Instagram
                </Link>
              </li>
              <li>
                <Link
                  className="footer-content-grid-link"
                  href="https://api.whatsapp.com/send/?phone=18683143157&text&app_absent=0"
                >
                  <span className="footer-content-brand-logo">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Whatsapp
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-content-bottom">
          <p>&copy; 2021 The Diving Block. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
