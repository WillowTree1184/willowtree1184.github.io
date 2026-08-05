export interface TechStackRecord {
    name: string;
    usage: string;
    items: string[];
}

export const techStackRecords: TechStackRecord[] = [
    {
        name: '.NET',
        usage: '桌面应用 / CLI / 游戏 / Web API',
        items: ['C#', 'VB', 'WPF', 'Unity', 'Blazor', 'ASP.NET'],
    },
    {
        name: 'Node.js',
        usage: '网页前端',
        items: ['JavaScript', 'TypeScript', 'Vue.js'],
    },
    {
        name: 'Bare Metal',
        usage: '操作系统 / CLI / UEFI 应用',
        items: ['C', 'C++', 'EDK II'],
    },
];
