export class Subscription {
    id: string;
    name: string;
    price: string;
    tax: string;
    total: string;
    billingCycle: number;
    surveyCount: number;
}


export const subscription: Subscription[] = [
    {
        'id': '0',
        'name': 'FREE',
        'price': '0.00',
        'tax': '0.00',
        'total': '0.00',
        'billingCycle': 1,
        'surveyCount': 5
    },
    {
        'id': '1',
        'name': 'BASIC',
        'price': '30.00',
        'tax': '1.87',
        'total': '31.87',
        'billingCycle': 1,
        'surveyCount': 100
    },
    {
        'id': '2',
        'name': 'PRO',
        'price': '35.00',
        'tax': '2.19',
        'total': '37.19',
        'billingCycle': 1,
        'surveyCount': 99999
    },
    {
        'id': '3',
        'name': 'ELITE',
        'price': '99.00',
        'tax': '6.19',
        'total': '105.19',
        'billingCycle': 1,
        'surveyCount': 99999
    },
    {
        'id': '4',
        'name': 'ELITE',
        'price': '360.00',
        'tax': '22.50',
        'total': '382.50',
        'billingCycle': 12,
        'surveyCount': 99999
    },
    {
        'id': '5',
        'name': 'ELITE',
        'price': '420.00',
        'tax': '26.25',
        'total': '446.25',
        'billingCycle': 12,
        'surveyCount': 99999
    },
    {
        'id': '6',
        'name': 'ELITE',
        'price': '1188.00',
        'tax': '74.25',
        'total': '1262.25',
        'billingCycle': 12,
        'surveyCount': 99999
    }
];
