export class Sub {
    name: string
    supported: any;
}
export class SubscriptionGroup {
    name: string;
    group: Sub[];
}

export const subscriptionGroups: SubscriptionGroup[] = [
    {
        name: 'Free',
        group: [
            { name: "Unlimited Surveys", supported: true },
            { name: "Unlimited Question", supported: true },
            { name: "Unlimited Responses", supported: true },
            { name: "Mobile friendly", supported: true },
            { name: "Email support", supported: true },
            { name: "Real time analytics", supported: true },
            { name: "Custom logo", supported: false },
            { name: "Data export", supported: false },
            { name: "Security protocals", supported: false },
            { name: "Import participants", supported: false },
            { name: "Phone support", supported: false },
            { name: "SMS text support", supported: false },
            { name: "Advanced security", supported: false },
            { name: "Custom URL", supported: false },
            { name: "Custom response", supported: false },
            { name: "Removed 'Powered by' mark", supported: false },
        ]
    },
    {
        name: 'Basic',
        group: [
            { name: "Unlimited Surveys", supported: true },
            { name: "Unlimited Question", supported: true },
            { name: "Unlimited Responses", supported: true },
            { name: "Mobile friendly", supported: true },
            { name: "Email support", supported: true },
            { name: "Real time analytics", supported: true },
            { name: "Custom logo", supported: false },
            { name: "Data export", supported: true },
            { name: "Security protocals", supported: true },
            { name: "Import participants", supported: true },
            { name: "Phone support", supported: false },
            { name: "SMS text support", supported: false },
            { name: "Advanced security", supported: false },
            { name: "Custom URL", supported: false },
            { name: "Custom response", supported: false },
            { name: "Removed 'Powered by' mark", supported: false },
        ]
    },
    {
        name: 'Pro',
        group: [
            { name: "Unlimited Surveys", supported: true },
            { name: "Unlimited Question", supported: true },
            { name: "Unlimited Responses", supported: true },
            { name: "Mobile friendly", supported: true },
            { name: "Email support", supported: true },
            { name: "Real time analytics", supported: true },
            { name: "Custom logo", supported: true },
            { name: "Data export", supported: true },
            { name: "Security protocals", supported: true },
            { name: "Import participants", supported: true },
            { name: "Phone support", supported: true},
            { name: "SMS text support", supported: true },
            { name: "Advanced security", supported: true },
            { name: "Custom URL", supported: false },
            { name: "Custom response", supported: false },
            { name: "Removed 'Powered by' mark", supported: false },
        ]
    },
    {
        name: 'Elite',
        group: [
            { name: "Unlimited Surveys", supported: true },
            { name: "Unlimited Question", supported: true },
            { name: "Unlimited Responses", supported: true },
            { name: "Mobile friendly", supported: true },
            { name: "Email support", supported: true },
            { name: "Real time analytics", supported: true },
            { name: "Custom logo", supported: true },
            { name: "Data export", supported: true },
            { name: "Security protocals", supported: true },
            { name: "Import participants", supported: true },
            { name: "Phone support", supported: true },
            { name: "SMS text support", supported: true },
            { name: "Advanced security", supported: true },
            { name: "Custom URL", supported: true },
            { name: "Custom response", supported: true },
            { name: "Removed 'Powered by' mark", supported: true },
        ]
    }
]