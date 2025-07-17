import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full mt-10 border-t border-gray-200 bg-[#F0F4F9] py-6 px-4 flex flex-col items-center justify-center text-gray-700 text-sm">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-2xl mx-auto">
        <div className="text-center md:text-right px-4 flex items-center justify-center gap-1">
          Created by <span className="font-semibold text-blue-600">Aakash Paliwal</span>
        </div>
        <div className="hidden md:block h-6 border-l border-gray-300 mx-4"></div>
        <div className="flex flex-col md:flex-row items-center gap-2 px-4 text-center md:text-left mt-2 md:mt-0">
          <span className="flex items-center gap-1">
            <span role="img" aria-label="envelope">✉️</span> Have feedback?
          </span>
          <a
            href="mailto:aakashpaliwal95@gmail.com?subject=CareerScribe%20Feedback"
            className="text-blue-600 hover:underline font-medium"
          >
            Send me an email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
