export interface TagItem {
  name: string;
  value: string;
}

export interface RecordItem {
  tag: TagItem;
  type: '-' | '+';
  note: string;
  amount: number;

}

export interface TabBar {
  name: string;
  value: '-' | '+';
}
