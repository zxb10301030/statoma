type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
};

export function FAQ({ items }: FAQProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">FAQ</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.question} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">{item.question}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
