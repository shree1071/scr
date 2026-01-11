import React, { useState } from 'react';
import { GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { saveBMSITSurvey } from '../../lib/storage';

interface SurveyQuestion {
  id: number;
  question: string;
  type: 'scale' | 'text';
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    question: "How satisfied are you with the overall teaching experience at BMSIT?",
    type: 'scale'
  },
  {
    id: 2,
    question: "How would you rate the support provided by the college administration?",
    type: 'scale'
  },
  {
    id: 3,
    question: "How do you feel about the infrastructure and facilities at BMSIT?",
    type: 'scale'
  },
  {
    id: 4,
    question: "How would you rate the interaction and engagement with students?",
    type: 'scale'
  },
  {
    id: 5,
    question: "How satisfied are you with the opportunities for professional development and growth?",
    type: 'scale'
  },
  {
    id: 6,
    question: "How would you rate the work-life balance as a lecturer at BMSIT?",
    type: 'scale'
  },
  {
    id: 7,
    question: "How do you feel about the compensation and benefits provided?",
    type: 'scale'
  },
  {
    id: 8,
    question: "How would you rate the communication and transparency within the institution?",
    type: 'scale'
  },
  {
    id: 9,
    question: "How satisfied are you with the academic resources and materials available?",
    type: 'scale'
  },
  {
    id: 10,
    question: "What are your overall thoughts and feelings about BMSIT as a lecturer? (Please share your detailed feedback)",
    type: 'text'
  }
];

interface BMSITSurveyProps {
  onComplete: (answers: Record<number, number | string>) => void;
}

const BMSITSurvey: React.FC<BMSITSurveyProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [textAnswer, setTextAnswer] = useState('');

  const question = SURVEY_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / SURVEY_QUESTIONS.length) * 100;

  const handleScaleAnswer = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
    setTimeout(() => {
      if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete({ ...answers, [question.id]: value });
      }
    }, 300);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim()) return;
    handleComplete({ ...answers, [question.id]: textAnswer });
  };

  const handleComplete = async (finalAnswers: Record<number, number | string>) => {
    // Store survey data in Supabase
    const success = await saveBMSITSurvey(finalAnswers);
    
    if (success) {
      onComplete(finalAnswers);
    } else {
      alert('Failed to save survey. Please try again.');
    }
  };

  const handleNext = () => {
    if (question.type === 'text') {
      handleTextSubmit();
    } else if (currentQuestion < SURVEY_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setTextAnswer('');
    }
  };

  const isAnswered = question.type === 'scale' 
    ? answers[question.id] !== undefined 
    : textAnswer.trim().length > 0;

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDF4FF] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>

      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white p-8 md:p-12 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-blue-200 to-cyan-200 rounded-3xl mb-6 shadow-sm">
            <GraduationCap size={36} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">BMSIT Lecturer Exit Survey</h2>
          <p className="text-slate-500 text-lg">Question {currentQuestion + 1} of {SURVEY_QUESTIONS.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 leading-relaxed">
            {question.question}
          </h3>

          {/* Scale Input */}
          {question.type === 'scale' && (
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleScaleAnswer(value)}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    answers[question.id] === value
                      ? 'bg-blue-500 border-blue-600 text-white scale-105 shadow-lg'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:scale-102'
                  }`}
                >
                  <div className="text-3xl font-bold mb-2">{value}</div>
                  <div className={`text-xs font-medium ${
                    answers[question.id] === value ? 'text-blue-100' : 'text-slate-500'
                  }`}>
                    {value === 1 ? 'Poor' : value === 2 ? 'Fair' : value === 3 ? 'Good' : value === 4 ? 'Very Good' : 'Excellent'}
                  </div>
                  {answers[question.id] === value && (
                    <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {question.type === 'text' && (
            <div>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Share your thoughts and feedback..."
                className="w-full h-48 p-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-800 resize-none"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              currentQuestion === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Back
          </button>

          {question.type === 'text' && (
            <button
              onClick={handleTextSubmit}
              disabled={!isAnswered}
              className={`px-8 py-3 rounded-xl font-bold flex items-center transition-all ${
                isAnswered
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Complete Survey
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMSITSurvey;

