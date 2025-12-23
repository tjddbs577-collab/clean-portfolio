import { Item } from "@/core/data/mock";

interface ItemListProps {
  items: Item[];
}

export function ItemList({ items }: ItemListProps) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          {item.description && <p>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}

