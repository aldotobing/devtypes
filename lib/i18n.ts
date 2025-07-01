export type Language = "en" | "id";

export interface Translations {
  // Landing Page
  title: string;
  subtitle: string;
  startTest: string;
  noSignupRequired: string;
  features: {
    aiPowered: {
      title: string;
      description: string;
    };
    careerInsights: {
      title: string;
      description: string;
    };
    quickFun: {
      title: string;
      description: string;
    };
  };
  whichDevType: string;
  devTypes: string[];

  // Quiz Page
  devTypeAssessment: string;
  back: string;
  questionOf: string;
  answerHonestly: string;

  // Result Page
  yourResults: string;
  resultsSubtitle: string;
  perfectRoles: string;
  shareMyDevType: string;
  retakeTest: string;
  backToHome: string;
  shareText: string;
  thinksFits: string;
  helpImprove: string;

  // Loading
  analyzingDevType: string;
  loadingQuestions: string;
  analyzingDNA: string;
  processing: string;
  mightTakeMoment: string;

  // Errors
  somethingWrong: string;
  couldntLoadQuestions: string;
  tryAgain: string;
  goBackHome: string;
  analysisFailed: string;
  noResultsFound: string;
  haventTakenQuiz: string;
  takeQuiz: string;
  startOver: string;
}

const translations: Record<Language, Translations> = {
  en: {
    title: "DevType",
    subtitle:
      "Discover your developer personality through an AI-powered assessment designed specifically for tech professionals",
    startTest: "🚀 Start the Test",
    noSignupRequired: "No signup required • Takes 2-3 minutes • 100% anonymous",
    features: {
      aiPowered: {
        title: "AI-Powered Analysis",
        description:
          "Advanced AI analyzes your coding habits and preferences to determine your unique developer archetype",
      },
      careerInsights: {
        title: "Career Insights",
        description:
          "Get personalized role recommendations and discover which tech positions align with your personality",
      },
      quickFun: {
        title: "Quick & Fun",
        description:
          "Takes just 2-3 minutes to complete with questions that every developer can relate to",
      },
    },
    whichDevType: "Which DevType Are You?",
    devTypes: [
      "🏗️ The Architecture Astronaut",
      "🐛 The Debug Detective",
      "⚡ The Performance Perfectionist",
      "🎨 The UI Unicorn",
      "🔧 The DevOps Monk",
      "📚 The Legacy Whisperer",
    ],
    devTypeAssessment: "DevType Assessment",
    back: "Back",
    questionOf: "Question {current} of {total}",
    answerHonestly: "Answer honestly for the most accurate results",
    yourResults: "Your DevType Results 🎉",
    resultsSubtitle:
      "Based on your responses, here's your developer personality profile",
    perfectRoles: "Perfect Roles for You:",
    shareMyDevType: "Share My DevType",
    retakeTest: "Retake Test",
    backToHome: "Back to Home",
    shareText: "I just discovered my developer personality: {type} - {quote}",
    thinksFits: "Think this result fits you? Share it with your dev friends!",
    helpImprove: "Help us improve DevType by sharing your feedback",
    analyzingDevType: "Analyzing Your DevType",
    loadingQuestions: "Loading your personalized questions...",
    analyzingDNA: "Analyzing your developer DNA...",
    processing: "Processing...",
    mightTakeMoment: "This might take a moment...",
    somethingWrong: "Oops! Something went wrong",
    couldntLoadQuestions:
      "We couldn't load the quiz questions. Please try again.",
    tryAgain: "Try Again",
    goBackHome: "Go Back Home",
    analysisFailed: "Analysis Failed",
    noResultsFound: "No Results Found",
    haventTakenQuiz: "It looks like you haven't taken the quiz yet.",
    takeQuiz: "Take the Quiz",
    startOver: "Start Over",
  },
  id: {
    title: "DevType",
    subtitle:
      "Cari tau kepribadian lo sebagai developer lewat tes AI yang fun dan santai, khusus buat anak tech!",
    startTest: "🚀 Mulai Tesnya!",
    noSignupRequired: "Nggak perlu daftar • Cuma 2-3 menit • 100% anonim",
    features: {
      aiPowered: {
        title: "Analisis Pakai AI",
        description:
          "AI bakal ngulik kebiasaan ngoding lo dan kasih tau tipe developer lo yang paling relate!",
      },
      careerInsights: {
        title: "Insight Karir",
        description:
          "Dapet rekomendasi role yang cocok sama kepribadian lo. Siapa tau nemu passion baru!",
      },
      quickFun: {
        title: "Cepat & Seru",
        description:
          "Cuma butuh 2-3 menit, pertanyaannya juga santai dan pasti nyambung sama dunia dev!",
      },
    },
    whichDevType: "Lo Tipe Dev yang Mana?",
    devTypes: [
      "🏗️ Arsitek Astronot",
      "🐛 Detektif Debug",
      "⚡ Perfeksionis Performa",
      "🎨 Unicorn UI",
      "🔧 Biksu DevOps",
      "📚 Pembisik Legacy",
    ],
    devTypeAssessment: "Tes Kepribadian Dev",
    back: "Balik",
    questionOf: "Pertanyaan {current} dari {total}",
    answerHonestly: "Jawab santai aja, yang penting jujur biar hasilnya pas!",
    yourResults: "Hasil DevType Lo 🎉",
    resultsSubtitle: "Dari jawaban lo, ini nih profil kepribadian dev lo:",
    perfectRoles: "Role yang Cocok Buat Lo:",
    shareMyDevType: "Share DevType Gue",
    retakeTest: "Tes Lagi",
    backToHome: "Balik ke Home",
    shareText: "Gue baru aja nemuin kepribadian dev gue: {type} - {quote}",
    thinksFits: "Ngerasa hasilnya relate? Share ke temen-temen dev lo juga!",
    helpImprove: "Bantu DevType makin keren, kasih feedback dong!",
    analyzingDevType: "Lagi dianalisis DevType lo...",
    loadingQuestions: "Bentar ya, lagi nyiapin pertanyaan spesial buat lo...",
    analyzingDNA: "Ngulik DNA developer lo...",
    processing: "Lagi diproses...",
    mightTakeMoment: "Sabar ya, bentar doang kok...",
    somethingWrong: "Waduh, ada error nih 😅",
    couldntLoadQuestions:
      "Pertanyaannya gagal dimuat. Coba refresh atau ulangi lagi ya!",
    tryAgain: "Coba Lagi",
    goBackHome: "Balik ke Home",
    analysisFailed: "Analisis Gagal, maaf ya!",
    noResultsFound: "Nggak nemu hasilnya nih...",
    haventTakenQuiz: "Kayaknya lo belum isi kuisnya deh.",
    takeQuiz: "Yuk, isi kuisnya!",
    startOver: "Mulai Dari Awal",
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function formatString(
  template: string,
  params: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}
