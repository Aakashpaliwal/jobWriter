import React, { useState } from "react";
import {
  AppWindowIcon,
  CodeIcon,
  Copy,
  Download,
  Loader2Icon,
  Mail,
  Sparkle,
  Sparkles,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OpenAI from "openai";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { analytics } from "@/firebase";
import { logEvent } from "firebase/analytics";
import axios from 'axios';

const schema = z.object({
  jobTitle: z.string().min(1, "Job Title is required"),
  companyName: z.string().min(1, "Company Name is required"),
  experience: z.string().min(10, "Please provide a brief description"),
  skills: z.string().min(1, "At least one skill is required"),
});

const CoverLetterContainer = () => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    let skillsArr = data.skills
      .split(",")
      .map((item) => item.trim())
      .filter((s) => /^[a-zA-Z0-9\s\-_.]+$/.test(s));
    let payloadData = {
      ...data,
      skills: skillsArr,
    };
    setLoading(true);
    try {
      const response = await axios.post('https://careeerscribebe.onrender.com/api/generate-cover-letter', payloadData);
      setCoverLetter(response.data.coverLetter);
      logEvent(analytics, "coverletter_generated");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.error || 'Failed to generate cover letter.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    toast("Copied!", {
      description: "Cover letter copied to clipboard",
    });
  };

  const downloadAsPDF = () => {
    const formData = getValues();
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - 2 * margin;

    // Set font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Cover Letter", margin, margin + 10);

    // Add content
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Split text into lines that fit the page width
    const lines = doc.splitTextToSize(coverLetter, maxWidth);
    doc.text(lines, margin, margin + 30);

    // Save the PDF
    const fileName = `Cover_Letter_${formData.jobTitle || "Job"}_${
      formData.companyName || "Company"
    }.pdf`.replace(/[^a-zA-Z0-9_]/g, "_");
    doc.save(fileName);
    toast("Downloaded!", {
      description: "Cover letter saved as PDF",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={"border-0"}>
          <CardHeader>
            <CardTitle className={"text-xl flex items-center gap-2"}>
              <WandSparkles className="text-blue-500" />
              Cover Letter Details
            </CardTitle>
            <CardDescription>
              Fill in the details below to generate a personalized cover letter
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label
                htmlFor="jobTitle"
                className={errors.jobTitle ? "text-red-500" : ""}
              >
                Job Title
              </Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Sr. Frontend Developer"
                {...register("jobTitle")}
                className={
                  errors.jobTitle
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.jobTitle && (
                <p className="text-sm text-red-500">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g. Jeavio"
                {...register("companyName")}
                className={
                  errors.companyName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="experience">
                Brief Description of Experience
              </Label>

              <Textarea
                id="experience"
                placeholder="e.g. 6 years building scalable React apps across industries"
                {...register("experience")}
                className={
                  errors.experience
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="skills">Key Skills (Comma Seperated)</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Redux, Node.js, Leadership"
                {...register("skills")}
                className={
                  errors.skills
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className={"w-full"} variant={"primary"} disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" /> Generating...
                </>
              ) : !coverLetter ? (
                "Generate Cover Letter"
              ) : (
                "Generate Cover Letter Again"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Card className={"border-0"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Generated Cover Letter</CardTitle>
          <CardDescription>
            Your personalized cover letter will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {coverLetter ? (
            <>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {coverLetter}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </Button>
                <Button
                  onClick={downloadAsPDF}
                  variant="outline"
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Sparkles className="text-gray-300 w-25 h-25 m-auto mt-12" />
              <p className="text-center mt-3 text-gray-400">
                Fill in the form and click "Generate Cover Letter" to get
                started
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterContainer;
