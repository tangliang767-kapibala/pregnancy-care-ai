
export const calculatePregnancyData = (lastPeriodDate: string) => {
  const lmp = new Date(lastPeriodDate);
  const today = new Date();
  
  // 预产期通常是末次月经后的 280 天
  const dueDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
  
  // 计算已经过去的天数
  const diffTime = Math.abs(today.getTime() - lmp.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const currentWeek = Math.floor(diffDays / 7);
  
  // 剩余天数
  const remainingTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  return {
    currentWeek: Math.min(42, currentWeek), // 最高显示42周
    daysRemaining,
    dueDate: dueDate.toLocaleDateString('zh-CN')
  };
};
