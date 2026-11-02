export interface Book {
    id: number;
    title: string;
    author: string;
    category: string;
    cover: string;
    description: string;
}

export const books: Book[] = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Classic",
        description:
            "A timeless story of wealth, love, ambition, and the American Dream, set in the glamorous world of the 1920s.",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    },
    {
        id: 2,
        title: "The Secret Garden",
        author: "Frances Hodgson Burnett",
        category: "Fiction",
        description:
            "A young girl discovers a hidden garden that transforms her life and brings friendship, hope, and happiness.",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    },
    {
        id: 3,
        title: "The Art of Reading",
        author: "David Ulin",
        category: "Literature",
        description:
            "An exploration of the beauty of reading and how books can shape our thoughts, imagination, and understanding of life.",
        cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600",
    },
    {
        id: 4,
        title: "Into the Wild",
        author: "Jon Krakauer",
        category: "Adventure",
        description:
            "The fascinating true story of a young adventurer who leaves society behind to explore the wilderness of Alaska.",
        cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600",
    },
    {
        id: 5,
        title: "The Silent Library",
        author: "M. J. Rose",
        category: "Mystery",
        description:
            "A mysterious library holds secrets waiting to be uncovered, drawing readers into a world of suspense and unexpected discoveries.",
        cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600",
    },
    {
        id: 6,
        title: "A Thousand Stories",
        author: "Jane Smith",
        category: "Fiction",
        description:
            "A heartwarming journey through different lives and experiences, reminding us that every person has a story worth telling.",
        cover: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600",
    },
];
