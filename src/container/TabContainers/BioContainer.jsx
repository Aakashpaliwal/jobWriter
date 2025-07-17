import React, { useState } from "react";
import {
  AppWindowIcon,
  CodeIcon,
  Loader2Icon,
  Mail,
  Sparkle,
  Sparkles,
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
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OpenAI from "openai";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  currentRole: z.string().min(1, "Current Role is required"),
  yoe: z.string().min(1, "Years of experience is required"),
  industry: z.string().min(1, "Industry is required"),
  achievement: z.string().min(10, "Please describe your achievement"),
  bioStyle: z.enum(["professional", "casual", "executive"], {
    required_error: "Please select a bio style",
  }),
});

const BioContainer = () => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const industries = data.industry
      .split(",")
      .map((i) => i.trim())
      .filter((i) => /^[a-zA-Z0-9\s\-_.]+$/.test(i));

    const prompt = `
Write a short and impactful professional bio (2–3 sentences max, under 400 characters) that can be used across LinkedIn, GitHub, and freelance profiles.

Use a "${data.bioStyle}" tone.

Details:
- Full Name: ${data.fullName}
- Current Role: ${data.currentRole}
- Years of Experience: ${data.yoe}
- Industry or Expertise Areas: ${industries.join(", ")}
- Key Achievements: ${data.achievement}

Avoid long paragraphs. Keep it concise, skimmable, and aligned with modern professional networking platforms.
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
              "You are a helpful assistant that writes short, engaging, and impactful professional bios for LinkedIn, GitHub, and freelance profiles.",
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className={"border-0"}>
          <CardHeader>
            <CardTitle className={"text-xl flex items-center gap-2"}>
              <User className="text-green-600" />
              Bio Information
            </CardTitle>
            <CardDescription>
              Tell us about yourself to create a compelling professional bio
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label
                htmlFor="fullName"
                className={errors.fullName ? "text-red-500" : ""}
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Sr. Frontend Developer"
                {...register("fullName")}
                className={
                  errors.fullName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="currentRole">Current Job Title</Label>
              <Input
                id="currentRole"
                placeholder="e.g. Senior Software Engineer"
                {...register("currentRole")}
                className={
                  errors.currentRole
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.currentRole && (
                <p className="text-sm text-red-500">
                  {errors.currentRole.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="yoe">Years of Experience</Label>
              <Input
                id="yoe"
                placeholder="e.g. 8+"
                {...register("yoe")}
                className={
                  errors.yoe ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {errors.yoe && (
                <p className="text-sm text-red-500">{errors.yoe.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="industry">Industry or Expertise Areas</Label>
              <Input
                id="industry"
                placeholder="e.g. SaaS, Fintech, Frontend Development"
                {...register("industry")}
                className={
                  errors.industry
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="achievement">Key Achievements</Label>

              <Textarea
                id="achievement"
                placeholder="Led a team to build a React PWA used by 10M+ users"
                {...register("achievement")}
                className={
                  errors.achievement
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.achievement && (
                <p className="text-sm text-red-500">
                  {errors.achievement.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="biostyle">Bio Style</Label>
              <Controller
                control={control}
                name="bioStyle"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className={clsx(
                        "w-full",
                        errors.bioStyle && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Choose a style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bioStyle && (
                <p className="text-sm text-red-500">
                  {errors.bioStyle.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className={
                "w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              }
              variant={"primary"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" /> Generating...
                </>
              ) : !coverLetter ? (
                " Generate Bio"
              ) : (
                " Generate Bio Again"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Card className={"border-0"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Generated Bio</CardTitle>
          <CardDescription>
            Your professional bio will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {coverLetter ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {coverLetter?.choices?.[0]?.message?.content}
            </p>
          ) : (
            <>
              <User className="text-gray-300 w-25 h-25 m-auto mt-12" />
              <p className="text-center mt-3 text-gray-400">
                Fill in your information and click "Generate Bio" to get started
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BioContainer;
