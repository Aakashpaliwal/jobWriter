import { Zap } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="bg-white p-3">
      <div className="flex gap-5">
        <div className="w-12 h-12 bg-blue-500 flex items-center justify-center text-white rounded-md">
          <Zap />
        </div>
        <div>
          <h4 className="text-blue-500 font-medium">CareerCraft AI</h4>
          <p className="text-sm text-gray-500">Your AI-powered job application toolkit</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
