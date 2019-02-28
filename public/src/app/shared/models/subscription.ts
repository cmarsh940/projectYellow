export class Subscription {
    id: number;
    name: string;
    price: number;
    surveyCount: number;
}


export const subscription: Subscription[] = [
    {
        'id': 0,
        'name': 'FREE',
        'price': 0.00,
        'surveyCount': 5
    },
    {
        'id': 1,
        'name': 'BASIC',
        'price': 30.00,
        'surveyCount': 100
    },
    {
        'id': 2,
        'name': 'PRO',
        'price': 35.00,
        'surveyCount': 99999
    },
    {
        'id': 3,
        'name': 'ELITE',
        'price': 99.00,
        'surveyCount': 99999
    },
    {
        'id': 4,
        'name': 'ELITE',
        'price': 360.00,
        'surveyCount': 99999
    },
    {
        'id': 5,
        'name': 'ELITE',
        'price': 420.00,
        'surveyCount': 99999
    },
    {
        'id': 6,
        'name': 'ELITE',
        'price': 1188.00,
        'surveyCount': 99999
    }
];
