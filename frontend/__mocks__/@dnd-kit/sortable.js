// frontend/__mocks__/@dnd-kit/sortable.js
// This is a minimal mock for @dnd-kit/sortable
// Adjust based on what specific exports your tests are actually using from this library.

export const SortableContext = ({ children }) => children;
export const useSortable = () => ({
  setNodeRef: jest.fn(),
  attributes: {},
  listeners: {},
  transform: null,
  transition: null,
});
export const arrayMove = jest.fn((items, oldIndex, newIndex) => {
  const newItems = [...items];
  const [removed] = newItems.splice(oldIndex, 1);
  newItems.splice(newIndex, 0, removed);
  return newItems;
});
