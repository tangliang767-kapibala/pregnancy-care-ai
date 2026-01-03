
import React, { useState } from 'react';
import { INITIAL_CHECKUPS } from '../constants';
import { analyzeMaternityReport } from '../services/geminiService';
import { User } from '../types';
import { marked } from 'marked';

interface CheckupsProps {
  user: User;
}

const Checkups: React.FC<CheckupsProps> = ({ user }) => {
  const [checkups, setCheckups] = useState(INITIAL_CHECKUPS);
  const [reportText, setReportText] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleCheckup = (id: string) => {
    setCheckups(prev => prev.map(c => 
      c.id === id ? { ...c, isCompleted: !c.isCompleted } : c
    ));
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeMaternityReport(user, reportText);
      setAnalysis(result || "分析失败，请尝试输入更详细的指标。");
    } catch (e) {
      alert("AI 服务暂时不可用");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">产检与报告</h1>
      </div>

      {/* AI 报告分析区 */}
      <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-pink-50 space-y-4">
        <h2 className="font-bold text-gray-800 flex items-center">
          <span className="mr-2">🔬</span> AI 报告解读
        </h2>
        <textarea 
          value={reportText}
          onChange={e => setReportText(e.target.value)}
          placeholder="手动输入报告指标（如：HCG 5000, 孕酮 25...）或粘贴报告文本，让 AI 帮您深度分析。"
          className="w-full h-32 bg-gray-50 border-none rounded-2xl p-4 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-pink-200"
        />
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !reportText.trim()}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            isAnalyzing ? 'bg-gray-100 text-gray-400' : 'bg-pink-500 text-white shadow-pink-100'
          }`}
        >
          {isAnalyzing ? '正在深度研读报告...' : '分析我的报告'}
        </button>

        {analysis && (
          <div className="mt-4 p-5 bg-pink-50 rounded-2xl border border-pink-100 animate-fade-in">
            <h3 className="text-xs font-bold text-pink-600 mb-2 uppercase tracking-wider">AI 专家解读结果：</h3>
            <div className="prose prose-sm text-xs text-gray-700 max-h-80 overflow-y-auto no-scrollbar" dangerouslySetInnerHTML={{ __html: marked.parse(analysis) }} />
          </div>
        )}
      </section>

      {/* 时间轴 */}
      <section className="space-y-6">
        <h2 className="font-bold text-gray-800 px-1">📅 孕期产检里程碑</h2>
        <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-pink-100">
          {checkups.map((item) => (
            <div key={item.id} className="relative flex items-start pl-12">
              <button 
                onClick={() => toggleCheckup(item.id)}
                className={`absolute left-0 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all z-10 ${
                  item.isCompleted ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-300'
                }`}
              >
                {item.isCompleted ? '✓' : item.week}
              </button>

              <div className={`flex-1 p-4 rounded-2xl border transition-all ${
                item.isCompleted ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-pink-50 shadow-sm'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-sm ${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {item.title}
                  </h3>
                  <span className="text-[9px] bg-pink-50 text-pink-500 px-2 py-0.5 rounded-full font-bold">
                    第 {item.week} 周
                  </span>
                </div>
                <p className={`text-[10px] ${item.isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Checkups;
