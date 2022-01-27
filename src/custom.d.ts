export interface TagItem {
  name: string;
  value: string;
}

export interface expendTagItem {
  name: string;
  value: string;
  relatedTag: TagItem[];
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
