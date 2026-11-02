export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  cover: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
  },
  {
    id: 2,
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    category: "Fiction",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
  },
  {
    id: 3,
    title: "The Art of Reading",
    author: "David Ulin",
    category: "Literature",
    cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600",
  },
  {
    id: 4,
    title: "Into the Wild",
    author: "Jon Krakauer",
    category: "Adventure",
    cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
  },
  {
    id: 5,
    title: "The Silent Library",
    author: "M. J. Rose",
    category: "Mystery",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
  },
  {
    id: 6,
    title: "A Thousand Stories",
    author: "Jane Smith",
    category: "Fiction",
    cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
  },
];
