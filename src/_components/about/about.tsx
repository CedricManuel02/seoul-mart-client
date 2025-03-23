import React from "react";
import {
  FacebookIcon,
  InstagramIcon,
  Mail,
  MapPin,
  Phone,
  TwitterIcon,
} from "lucide-react";
import Link from "next/link";
export default function AboutContainer() {
  return (
    <div id="about" className="py-10 flex flex-col gap-10 justify-between lg:flex-row">
      <div className="lg:w-6/12 w-full">
        <h1 className="py-2 text-green-500 text-xl md:text-2xl lg:text-4xl font-bold">
          About Us.
        </h1>
        <p className="text-slate-500 py-4 text-sm">
          Welcome to Bella & Pepper, your destination for authentic Korean food
          and beverages! Our passion for Korean cuisine drives us to offer a
          carefully curated selection of high-quality ingredients, snacks, and
          drinks.
          <br />
          <br />
          We believe food is a celebration of culture, and we’re here to help
          you explore the vibrant flavors of Korea. Join us on this delicious
          journey and bring the taste of Korea to your kitchen!
        </p>
        <div className="flex gap-2 flex-col text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-8 p-2 w-8 rounded cursor-pointer bg-green-200 text-green-500" />
            <p className="text-slate-500">(586) 245-3999</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-8 p-2 w-8 rounded cursor-pointer bg-green-200 text-green-500" />
            <p className="text-slate-500">bellaandpepper@gmail.com</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-8 p-2 w-8 rounded cursor-pointer bg-green-200 text-green-500" />
            <Link href="https://maps.app.goo.gl/Lny7JauuRmgyUdW19" className="text-slate-500 hover:underline">Soldiers Hills Phase IV Almond Drive, Molino VI, Bacoor</Link>
          </div>
        </div>
        <div className="py-4 flex items-center gap-2 justify-start">
          <TwitterIcon className="cursor-pointer text-green-600 hover:text-green-700" />
          <FacebookIcon className="cursor-pointer text-green-600 hover:text-green-700" />
          <InstagramIcon className="cursor-pointer text-green-600 hover:text-green-700" />
        </div>
      </div>
      <iframe
        className="rounded-lg w-full h-[350px] lg:max-w-[600px] lg:max-h-[450px]"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30915.732479622624!2d120.96550286286707!3d14.400247207992738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d23cbad4cb5b%3A0xdb61388cc9fdd71f!2sMolino%20I%2C%20Bacoor%2C%20Cavite!5e0!3m2!1sen!2sph!4v1730702158344!5m2!1sen!2sph"
        loading="lazy"
      ></iframe>
    </div>
  );
}
