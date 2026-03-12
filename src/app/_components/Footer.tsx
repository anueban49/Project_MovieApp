"use client";
import { Film, Mail, Phone, Instagram, InstagramIcon } from "lucide-react";
import { useTheme } from "../Providers/ThemeContext";
export const Footer = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full bg-indigo-700  h-fit min-h-70 flex justify-around items-start p-10 text-white">
      <div className={` `}>
        <div className="flex gap-2 ">
          <Film className={`text-white`} />
          <p className={`text-white italic font-bold`}>Movie Z</p>
        </div>
        <div>© 2024 Movie Z. All Rights Reserved.</div>
      </div>
      <div className="flex gap-[5em]">
        {" "}
        <div className={` flex flex-col gap-5`}>
          <p className="text-xl font-bold">Contact Information</p>
          <div className="flex gap-5 items-center">
            <Mail />
            <div className="flex flex-col gap-2">
              <p className="font-bold">Email:</p>
              <p>support@movieZ.com</p>
            </div>
          </div>
          <div className="flex gap-5 items-center">
            <Phone />
            <p className="font-bold">Phone:</p>
            <p>s+976 (11) 123-4567</p>
          </div>
        </div>
        <div className={` flex flex-col gap-5`}>
          <p className="text-xl font-bold">Follow us</p>

          <div className="flex flex-col gap-2">
            <span className="font-medium">Facebook</span>
            <span className="font-medium">Instagram</span>
            <span className="font-medium">Twitter</span>
            <span className="font-medium">Youtube</span>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
