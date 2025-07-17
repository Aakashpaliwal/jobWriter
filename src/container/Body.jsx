import React from "react";
import {
  AppWindowIcon,
  CodeIcon,
  FileText,
  Mail,
  User,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import CoverLetterContainer from "@/container/TabContainers/CoverLetterContainer";
import BioContainer from "@/container/TabContainers/BioContainer";
import ColdemailContainer from "@/container/TabContainers/coldemailContainer";

const Body = () => {
  return (
    <div>
      <h1 className="text-3xl text-center pt-14 font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
        {" "}
        Land Your Dream Job with AI
      </h1>
      <p className="text-center text-lg text-gray-500 mt-5">
        Generate professional cover letters, compelling bios, and effective cold{" "}
        <br />
        outreach emails that get you noticed by employers and recruiters.
      </p>
      <div className="flex w-full flex-col gap-6 mt-14 px-3">
        <Tabs defaultValue="coverletter">
          <TabsList className={"w-full bg-[#F0F4F9]"}>
            <TabsTrigger value="coverletter" className={"hover:cursor-pointer"}>
              <FileText /> Cover Letter
            </TabsTrigger>
            <TabsTrigger value="password" className={"hover:cursor-pointer"}>
              <User /> Professional Bio
            </TabsTrigger>
            <TabsTrigger
              value="coldoutreach"
              className={"hover:cursor-pointer"}
            >
              <Mail /> Cold Outreach
            </TabsTrigger>
          </TabsList>
          <TabsContent value="coverletter" className={"mt-6 mb-6"}>
            <CoverLetterContainer />
          </TabsContent>
          <TabsContent value="password" className={"mt-6 mb-6"}>
            <BioContainer />
          </TabsContent>
          <TabsContent value="coldoutreach" className={"mt-6 mb-6"}>
            <ColdemailContainer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Body;
