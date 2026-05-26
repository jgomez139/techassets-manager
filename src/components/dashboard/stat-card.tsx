interface Props {
  title: string;

  value: number;

  color: string;
}

export default function StatCard({
  title,
  value,
  color,
}: Props) {
  return (
    <div
      className={`rounded-2xl p-6 text-white shadow ${color}`}
    >
      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold">
        {value}
      </h2>
    </div>
  );
}