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

const coldEmailSchema = z.object({
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientCompany: z.string().min(2, "Recipient company is required"),
  emailPurpose: z.string().min(5, "Purpose must be at least 5 characters long"),
  background: z
    .string()
    .min(10, "Background must be at least 10 characters long"),
  request: z.string().min(10, "Please specify your goal or request clearly"),
  emailType: z.enum(["networking", "opportunity", "collaboration"], {
    required_error: "Please select an email type",
  }),
});

const ColdemailContainer = () => {
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(coldEmailSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const prompt = `
You are an assistant that writes personalized and concise cold outreach emails.

Write a compelling cold email with the following information:
- Recipient Name: ${data.recipientName}
- Recipient Company: ${data.recipientCompany}
- Email Type: ${data.emailType}
- Purpose: ${data.emailPurpose}
- Sender Background: ${data.background}
- Specific Request/Goal: ${data.request}

Guidelines:
- Keep it under 150 words
- Make it friendly but professional in tone
- Ensure clarity and call-to-action
- Tailor it to the selected email type (e.g., networking, job opportunity, or collaboration)

Start with a short greeting, clearly explain why the sender is reaching out, and end with a polite closing and contact prompt.
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
              "You are a helpful assistant that writes concise and personalized cold outreach emails tailored to networking, job opportunities, or collaborations.",
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
              <Mail className="text-purple-600" />
              Email Details
            </CardTitle>
            <CardDescription>
              Craft the perfect cold outreach email to make meaningful
              connections
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-3">
              <Label
                htmlFor="recipientName"
                className={errors.recipientName ? "text-red-500" : ""}
              >
                Recipient Name
              </Label>
              <Input
                id="recipientName"
                placeholder="e.g. Sr. Frontend Developer"
                {...register("recipientName")}
                className={
                  errors.recipientName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.recipientName && (
                <p className="text-sm text-red-500">
                  {errors.recipientName.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="recipientCompany">Recipient Company</Label>
              <Input
                id="recipientCompany"
                placeholder="e.g., Innovative Tech Solutions"
                {...register("recipientCompany")}
                className={
                  errors.recipientCompany
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.recipientCompany && (
                <p className="text-sm text-red-500">
                  {errors.recipientCompany.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="emailPurpose">Email Purpose/Context</Label>
              <Input
                id="emailPurpose"
                placeholder="e.g., AI/ML development, seeking mentorship"
                {...register("emailPurpose")}
                className={
                  errors.emailPurpose
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.emailPurpose && (
                <p className="text-sm text-red-500">
                  {errors.emailPurpose.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="background">Your Background</Label>

              <Textarea
                id="background"
                placeholder="Brief description of your relevant experience..."
                {...register("background")}
                className={
                  errors.background
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.background && (
                <p className="text-sm text-red-500">
                  {errors.background.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="request">Specific Request/Goal</Label>

              <Textarea
                id="request"
                placeholder="What specific outcome are you hoping for from this email?"
                {...register("request")}
                className={
                  errors.request
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              />
              {errors.request && (
                <p className="text-sm text-red-500">{errors.request.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="emailType">Email Type</Label>
              <Controller
                control={control}
                name="emailType"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger
                      className={clsx(
                        "w-full",
                        errors.emailType && "border-red-500"
                      )}
                    >
                      <SelectValue placeholder="Choose email type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="opportunity">
                        Job Opportunity
                      </SelectItem>
                      <SelectItem value="collaboration">
                        Collaboration
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.emailType && (
                <p className="text-sm text-red-500">
                  {errors.emailType.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className={
                "w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }
              variant={"primary"}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="animate-spin" /> Generating...
                </>
              ) : !coverLetter ? (
                " Generate Email"
              ) : (
                " Generate Email Again"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
      <Card className={"border-0"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Generated Email</CardTitle>
          <CardDescription>
            Your personalized outreach email will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          {coverLetter ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {coverLetter?.choices?.[0]?.message?.content}
            </p>
          ) : (
            <>
              <Mail className="text-gray-300 w-25 h-25 m-auto mt-12" />
              <p className="text-center mt-3 text-gray-400">
                Fill in the details and click "Generate Email" to get started
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ColdemailContainer;
