"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Brain, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import LanguageToggle from "@/components/LanguageToggle";

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleStartTest = () => {
    router.push("/quiz");
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="animate-float">
            <Code2 size={80} className="mx-auto text-purple-600 mb-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Dev<span className="text-purple-600">Type</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-6">
          <Button
            onClick={handleStartTest}
            size="lg"
            className="bg-dev-gradient hover:opacity-90 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {t.startTest}
          </Button>
          <p className="text-sm text-gray-500">{t.noSignupRequired}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {t.features.aiPowered.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t.features.aiPowered.description}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {t.features.careerInsights.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                {t.features.careerInsights.description}
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <Zap className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">
                {t.features.quickFun.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t.features.quickFun.description}</p>
            </CardContent>
          </Card>
        </div>

        {/* Example Types */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t.whichDevType}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {t.devTypes.map((type, index) => (
              <span
                key={index}
                className="bg-white px-4 py-2 rounded-full border border-purple-200 text-gray-700 hover:bg-purple-50 transition-colors duration-200"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
