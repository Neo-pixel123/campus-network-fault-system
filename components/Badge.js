export default function Badge({ value }) {
  return <span className={`badge b-${String(value).toLowerCase()}`}>{String(value).replace("_", " ")}</span>;
}
