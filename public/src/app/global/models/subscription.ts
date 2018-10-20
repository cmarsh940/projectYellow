export class Subscription {
    name: string;
    price: number;
    surveyCount: number;
}


export const subscription: Subscription[] = [
    {
        "name": "FREE",
        "price": 0.00,
        "surveyCount": 5
    },
    {
        "name": "BASIC",
        "price": 30.00,
        "surveyCount": 100
    },
    {
        "name": "PRO",
        "price": 35.00,
        "surveyCount": 99999
    },
    {
        "name": "ELITE",
        "price": 99.00,
        "surveyCount": 99999
    }
]