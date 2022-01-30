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
  id?: number;
  tag: TagItem;
  type: '-' | '+';
  note: string;
  amount: number;
  createAt?: Date;

}

export interface TabBar {
  name: string;
  value: '-' | '+';
}
