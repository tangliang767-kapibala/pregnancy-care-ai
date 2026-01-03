
import { Checkup } from './types';

export const INITIAL_CHECKUPS: Checkup[] = [
  { id: '1', week: 6, title: '初次产检', description: '确认宫内孕，建立母子健康手册', isCompleted: false },
  { id: '2', week: 12, title: 'NT检查', description: '早期染色体异常筛查，测NT值', isCompleted: false },
  { id: '3', week: 16, title: '唐氏筛查', description: '排除唐氏综合征等风险', isCompleted: false },
  { id: '4', week: 24, title: '糖耐量试验(OGTT)', description: '筛查妊娠期糖尿病', isCompleted: false },
  { id: '5', week: 28, title: '大畸形筛查(三维/四维)', description: '详细排查胎儿结构畸形', isCompleted: false },
  { id: '6', week: 32, title: '胎位检查', description: '评估胎儿发育及位置', isCompleted: false },
  { id: '7', week: 36, title: '胎心监护开始', description: '每周一次，观察胎儿宫内情况', isCompleted: false },
  { id: '8', week: 40, title: '预产期检查', description: '评估分娩方式', isCompleted: false },
];

export const FRUIT_SIZES = [
  { week: 4, name: '罂粟籽', icon: '🌱' },
  { week: 8, name: '树莓', icon: '🫐' },
  { week: 12, name: '酸橙', icon: '🍋' },
  { week: 16, name: '牛油果', icon: '🥑' },
  { week: 20, name: '香蕉', icon: '🍌' },
  { week: 24, name: '玉米', icon: '🌽' },
  { week: 28, name: '茄子', icon: '🍆' },
  { week: 32, name: '西葫芦', icon: '🥒' },
  { week: 36, name: '西瓜', icon: '🍉' },
  { week: 40, name: '南瓜', icon: '🎃' },
];

export const CATEGORIES = ['谷薯类', '蔬果类', '鱼禽肉蛋', '奶类豆类', '油脂类'];
