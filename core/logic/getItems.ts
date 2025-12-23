import { mockItems, type Item } from "../data/mock";

export async function getItems(): Promise<Item[]> {
  // Simulate async operation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockItems);
    }, 100);
  });
}

