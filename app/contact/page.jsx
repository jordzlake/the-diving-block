import "@/app/contact/contact.css";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  return (
    <main>
      <section className="contact-container">
        <div className="contact-banner-content-container container">
          <span className="contact-banner-content-subtitle">
            The Diving Block
          </span>
          <h1 className="contact-banner-content-title">Contact Info</h1>
        </div>
        <div className="contact-content-container container">
          <div className="contact-content-first">
            <form className="contact-form" action="submit">
              <h2>Get In touch</h2>
              <input name="name" type="text" placeholder="Name" />
              <input name="phone" type="tel" placeholder="Phone Number" />
              <input name="email" type="email" placeholder="Email Address" />
              <textarea name="Message" placeholder="Message" id="" />
              <button>
                Submit <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </form>
          </div>
          <div className="contact-content-second">
            <h2>Contact Info</h2>
            <p>
              Phone: <span>+1 (868) 314-3157</span>
            </p>
            <p>
              Email: <span>info@thedivingblock.com</span>
            </p>

            <ul className="contact-content-grid-links">
              <li>
                <Link
                  className="contact-content-grid-link"
                  href="https://www.facebook.com/thedivingblock/"
                >
                  <span className="contact-content-brand-logo">
                    <FontAwesomeIcon icon={faFacebook} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Facebook
                </Link>
              </li>
              <li>
                <Link
                  className="contact-content-grid-link"
                  href="https://www.instagram.com/thedivingblock/"
                >
                  <span className="contact-content-brand-logo">
                    <FontAwesomeIcon icon={faInstagram} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Instagram
                </Link>
              </li>
              <li>
                <Link
                  className="contact-content-grid-link"
                  href="https://api.whatsapp.com/send/?phone=18683143157&text&app_absent=0"
                >
                  <span className="contact-content-brand-logo">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  &nbsp;&nbsp;&nbsp; Whatsapp
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
