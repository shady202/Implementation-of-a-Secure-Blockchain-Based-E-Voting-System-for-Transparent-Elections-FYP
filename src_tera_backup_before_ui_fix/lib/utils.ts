export const generateCategoryId = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, '-');
};
