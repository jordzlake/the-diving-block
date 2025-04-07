import Image from "next/image";
import "@/app/about/about.css";
import Link from "next/link";
import { FaBriefcase, FaPenToSquare } from "react-icons/fa6";

const About = () => {
  return (
    <main>
      <section className="about-container">
        <div className="about-banner-content-container">
          <span className="about-banner-content-subtitle">
            The Diving Block
          </span>
          <h1 className="about-banner-content-title">About Us</h1>
        </div>
        <div className="about-content-container">
          <div className="about-first-content-container">
            <h2 className="about-first-content-container-heading">Our Story</h2>
            <p>
              The Diving Block was established in 2018 with the purpose of
              providing a local supply of swimwear, swim gear and beach items in
              one place! It was founded by Abiola Anderson, an avid swimmer and
              swim coach for over a decade. The idea was birthed when, as a
              competitive swimmer years ago, she realised that it was difficult
              to locally source swimwear and gear for training and competitions.
              Many years later, a dream became a
            </p>
            <div className="about-first-content-links-container">
              <Link href="https://newsday.co.tt/2018/02/15/andersons-swimming-passion-creating-waves/">
                <FaPenToSquare />
                &nbsp;&nbsp;&nbsp; Newsday Article
              </Link>
              <Link href="https://www.facebook.com/littlenemostt/">
                <FaBriefcase />
                &nbsp;&nbsp;&nbsp; Little Nemos Swim School
              </Link>
            </div>
          </div>
          <div className="about-second-content-container">
            <div className="about-second-content-image-container">
              <Image src="/images/about-us.png" alt="about image" fill />
            </div>
          </div>
        </div>
        <div className="about-third-content-container">
          <p>
            The Diving Block supplies a wide selection of swimwear brands, you
            {"’"}re sure to find something you need and want!
          </p>
        </div>
      </section>
    </main>
  );
};

export default About;
