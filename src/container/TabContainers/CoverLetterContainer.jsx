import React, { useState } from "react";
import {
  AppWindowIcon,
  CodeIcon,
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
    const prompt = `
Write a professional, enthusiastic, and concise cover letter for the following job:
- Job Title: ${data.jobTitle}
- Company: ${data.companyName}
- Candidate Experience: ${data.experience}
- Key Skills: ${payloadData.skills.join(", ")}

Make it sound human, 1-2 paragraphs long.
`;

    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_CHATGPT_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful career assistant that writes cover letters.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      const coverletter = completion.choices[0].message.content;
      setLoading(false);
      setCoverLetter(completion);
      // TODO: set it to state and show in right panel
    } catch (err) {
      setLoading(false);
      console.error("❌ OpenAI Error:", err);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
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
            // <div className="whitespace-pre-wrap text-sm text-gray-700 break-words"><pre>{coverLetter?.choices?.[0]?.message?.content}</pre></div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {coverLetter?.choices?.[0]?.message?.content}
            </p>
          ) : (
            <>
              <Sparkles className="text-gray-300 w-25 h-25 m-auto mt-12" />
              <p className="text-center mt-3 text-gray-400">
                Fill in the form and click "Generate Cover Letter" to get
                started
              </p>
            </>
          )}
          {/* {
            coverLetter ? 
            (
            <p>
              {coverLetter?.choices?[0]?.message?.content}
            </p>
            )
            :
            <>
             <Sparkles className="text-gray-300 w-25 h-25 m-auto mt-12" />
          <p className="text-center mt-3 text-gray-400">
            Fill in the form and click "Generate Cover Letter" to get started
          </p>
            </>
          } */}
        </CardContent>
        {/* <CardFooter>
          <Button>Save changes</Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default CoverLetterContainer;
