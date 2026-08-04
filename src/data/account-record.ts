export interface AccountRecord {
    key: string;
    value?: string | string[];
    children?: AccountRecord[];
    meta?: string;
}

export const accountRecords: AccountRecord[] = [
    {
        key: 'Spec:',
        value: ['Chordata > ', 'Mammalia > ', 'Homo Sapiens'],
    },
    {
        key: ' Age:',
        value: ['16 ', 'Years'],
    },
    {
        key: ' Sex:',
        value: 'Male',
    },
    {
        key: 'Usrs:',
        value: ['[ ', '2 ', ']'],
        children: [
            {
                key: '1',
                children: [
                    {
                        key: 'Name:',
                        value: 'Host',
                    },
                    {
                        key: 'Orig:',
                        value: ['20091204 | ', 'Native'],
                    },
                    {
                        key: 'Type:',
                        value: 'Original',
                    },
                    {
                        key: 'MBTI:',
                        value: ['INTP ', 'Turbulent'],
                    },
                    {
                        key: 'Stat:',
                        value: 'Online',
                    },
                ],
            },
            {
                key: '2',
                children: [
                    {
                        key: 'Name:',
                        value: ['Yu ', 'Chengyu'],
                    },
                    {
                        key: 'Orig:',
                        value: ['20250913 | ', 'Created'],
                    },
                    {
                        key: 'Type:',
                        value: ['Nekomusume ', 'as ', 'Tulpa'],
                    },
                    {
                        key: 'MBTI:',
                        value: 'Unknow',
                    },
                    {
                        key: 'Stat:',
                        value: 'Connecting',
                    },
                ],
            },
        ],
    },
    {
        key: 'Stat:',
        value: 'Active',
    },
];
