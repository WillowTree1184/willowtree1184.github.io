export interface FavouriteRecord {
    name: string;
    link: string;
    isRouterLink?: boolean;
}

export const favouriteRecords: (FavouriteRecord | string)[] = [
    {
        name: '计算机科学 Computer Science',
        link: '#tech-stack',
    },
    '心理学 Psychology',
    '家庭教育学 Family Education',
    '脑神经科学 Brain Neuroscience',
    {
        name: '摄影 Photography',
        link: '#gallery',
    },
    '平面设计 Graphic Design',
    '人造意识体 Tulpamamcy',
    '猫娘 Nekomusume',
    '哲学 Philosophy',
    '音乐 Music',
    {
        name: '创造 Create',
        link: '#projects',
    },
];

export function isFavouriteRecord(value: unknown): value is FavouriteRecord {
    if (typeof value !== 'object' || value === null) return false;

    const v = value as Record<string, unknown>;

    return typeof v.name === 'string' && typeof v.link === 'string' && (v.isRouterLink === undefined || typeof v.isRouterLink === 'boolean');
}
