import {TagItem} from '@/custom';

const defaultExpenseTags = [
  {name: 'food', value: '餐饮'},
  {name: 'shopping', value: '购物'},
  {name: 'house', value: '居住'},
  {name: 'transport', value: '交通'},
  {name: 'entertainment', value: '娱乐'},
  {name: 'medical', value: '医疗'}
] as TagItem[];
const defaultIncomeTags = [
  {name: 'bonus', value: '奖金'},
  {name: 'gift', value: '餐饮'},
  {name: 'part-time', value: '兼职'},
  {name: 'reimbursement', value: '报销'},
  {name: 'salary', value: '工资'}
] as TagItem[];


export {defaultExpenseTags, defaultIncomeTags};
