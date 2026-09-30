import { Calendar, Clock, AlertTriangle } from 'lucide-react';

export default function StudySchedule() {
  const schedule = [
    { date: "Oct 1", topic: "Gradient Descent", reason: "Memory strength dropping below 70%", urgent: true },
    { date: "Oct 2", topic: "Backpropagation", reason: "Prerequisite for upcoming exam", urgent: false },
    { date: "Oct 4", topic: "Transformer Architectures", reason: "New topic to cover", urgent: false }
  ];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <Calendar className="text-blue-400" size={32}/> Optimized Study Schedule
      </h2>
      <p className="text-slate-400 mb-8">This schedule is automatically generated based on the Ebbinghaus forgetting curve.</p>
      
      <div className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/80 border-b border-slate-700/50">
            <tr>
              <th className="p-6 font-semibold text-slate-300">Date</th>
              <th className="p-6 font-semibold text-slate-300">Topic</th>
              <th className="p-6 font-semibold text-slate-300">Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, i) => (
              <tr key={i} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/30 transition">
                <td className="p-6 font-medium text-white flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  {item.date}
                </td>
                <td className="p-6 text-blue-400 font-bold">{item.topic}</td>
                <td className="p-6 text-slate-300 flex items-center gap-2">
                  {item.urgent && <AlertTriangle size={16} className="text-orange-400"/>}
                  {item.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
