export interface AccountRecord {
    key: string;
    value?: string | string[];
    isRawValue?: boolean;
    children?: AccountRecord[];
}

export const accountRecords: AccountRecord[] = [
    {
        key: 'Spec:',
        value: ['Chordata &rang; ', 'Mammalia &rang; ', 'Homo Sapiens'],
        isRawValue: true,
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
        value: ['[ ', 'List(2) ', ']'],
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
                        value: ['[ ', 'Unknown ', ']'],
                    },
                    {
                        key: 'Stat:',
                        value: 'Growing',
                    },
                ],
            },
        ],
    },
    {
        key: ' Pos:',
        value: ['Earth &rang; ', 'Asia &rang; ', 'China'],
        isRawValue: true,
    },
    {
        key: 'Stat:',
        value: 'Alive',
    },
];
