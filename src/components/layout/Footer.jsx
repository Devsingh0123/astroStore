import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { CATEGORIES } from "../../constants/categories";

const Footer = () => {
  const collectionCategories = CATEGORIES.filter((cat) => cat.id !== "all");

  return (
    <footer className="bg-[#f7f5f2] border-t border-gray-300 mt-8 pt-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* ABOUT */}
        <div className="lg:col-span-1">
          <Link to="/">
            <img src={logo} alt="Astrotring" className="h-10 mb-4" />
          </Link>

          <p className="text-sm text-gray-700 leading-relaxed">
            AstroTring Store offers a curated collection of authentic astrology
            and spiritual products designed to enhance positivity and balance in
            life. Explore a wide range of gemstones, rudraksha, healing
            bracelets, and vastu items carefully selected by experts.
          </p>
        </div>

        <hr className="text-gray-300 mt-4" />
        <br />

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-8">
          {/* COLLECTIONS */}
          <div>
            <h2 className="text-gray-900 border-b-2 border-amber-500 inline-block pb-1 font-semibold text-lg">
              Collections
            </h2>

            <ul className="mt-4 space-y-2">
              {collectionCategories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/#category-${cat.id}`}
                    className="flex items-center gap-2 text-sm text-gray-700 transition-all duration-300 hover:text-amber-600 hover:translate-x-1"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RESOURCES */}
          <div>
            <h2 className="text-gray-900 border-b-2 border-amber-500 inline-block pb-1 font-semibold text-lg">
              Resources
            </h2>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/blogs"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Astrology Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/zodiac-signs"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Zodiac Signs
                </Link>
              </li>
              <li>
                <Link
                  to="/numerology"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Numerology
                </Link>
              </li>
              <li>
                <Link
                  to="/vastu-shastra"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Vastu Shastra
                </Link>
              </li>
              <li>
                <Link
                  to="/tarot"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Tarot
                </Link>
              </li>
              <li>
                <Link
                  to="/love-calculator"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Love Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* CORPORATE */}
          <div>
            <h2 className="text-gray-900 border-b-2 border-amber-500 inline-block pb-1 font-semibold text-lg">
              Corporate Info
            </h2>

            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/disclaimer"
                  className="text-sm text-gray-700 hover:text-amber-600"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="text-gray-900 border-b-2 border-amber-500 inline-block pb-1 font-semibold text-lg">
              Contact us
            </h2>

            <p className="text-sm text-gray-700 mt-4">
              We are available 24x7 on chat support, click to start chat
            </p>

            <div className="mt-4">
              <a
                href="mailto:mail@astrotring.com"
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-amber-600"
              >
                <Mail className="size-8 text-[#EA4335]" />
                mail@astrotring.com
              </a>
            </div>

            {/* SOCIAL */}
            <div className="flex gap-2 mt-5">
              {[
                { Icon: FaFacebook, href: "https://facebook.com" },
                { Icon: FaInstagram, href: "https://instagram.com" },
                { Icon: FaTwitter, href: "https://twitter.com" },
                { Icon: FaYoutube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-600 rounded-full h-8 w-8 grid place-items-center hover:bg-amber-600 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* APP DOWNLOAD */}
          <div>
            <h3 className="text-gray-900 border-b-2 border-amber-500 inline-block pb-1 font-semibold text-lg">
              Download Our App
            </h3>

            <div className="flex flex-col gap-3 mt-4">
              <a
                href="#"
                className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800"
              >
                <FaGooglePlay size={20} />
                <div className="flex flex-col text-left">
                  <span className="text-[8px]">GET IT ON</span>
                  <span className="text-xs font-semibold">Google Play</span>
                </div>
              </a>

              <a
                href="#"
                className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-800"
              >
                <FaApple size={20} />
                <div className="flex flex-col text-left">
                  <span className="text-[8px]">Download on the</span>
                  <span className="text-xs font-semibold">App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="border-t border-gray-300 py-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            <span className="font-semibold">Disclaimer:</span>
            Astrology services on{" "}
            <a
              href="https://astrotring.com"
              target="_blank"
              className="text-amber-600 hover:underline"
            >
              www.astrotring.com
            </a>{" "}
            are provided for guidance and knowledge purposes only. Results may
            vary. Please read our full{" "}
            <Link to="/disclaimer" className="text-amber-600 hover:underline">
              Disclaimer
            </Link>{" "}
            before using the website.
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="bg-black text-white text-center py-5">
        © {new Date().getFullYear()} Astrotring. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
