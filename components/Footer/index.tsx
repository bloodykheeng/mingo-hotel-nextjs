"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="relative z-10 bg-white  dark:bg-gray-dark bottom-0 ">
        <div className="container">

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-8">
            <p className="text-center text-base text-body-color dark:text-white">
              © {new Date().getFullYear()} Mingo Hotel {" "}
              <a
                href="https://www.ppda.go.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Uganda
              </a>
            </p>
          </div>

        </div>

      </footer>
    </>
  );
};

export default Footer;
