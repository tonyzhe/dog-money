export default function idCreator(): number {
  let id = parseInt(window.localStorage.getItem('id_Max') || '0') || 0;
  id += 1;
  window.localStorage.setItem('id_Max', JSON.stringify(id));
  return id;
}
