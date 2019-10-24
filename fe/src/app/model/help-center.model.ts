
export interface FaqCategory {
    id: number;
    name: string;
    description: string;
}

export interface Faq {
    id: number;
    categoryId: number;
    title: string;
    description: string;
    answer: string;
}


