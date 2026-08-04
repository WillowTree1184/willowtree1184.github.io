export interface TechStackRecord {
    name: string;
    usage: string;
    items: string[];
}

export const techStackRecords: TechStackRecord[] = [
    {
        name: '.NET',
        usage: '桌面应用 / CLI / 游戏 / Web API',
        items: ['C#', 'VB', 'WPF', 'Unity', 'Blazor', 'Asp.Net'],
    },
    {
        name: 'node.js',
        usage: '网页前端',
        items: ['java script', 'type script', 'vue'],
    },
    {
        name: 'Bare Metal',
        usage: '操作系统 / CLI / UEFI 应用',
        items: ['C', 'C++', 'EDK II'],
    },
];
