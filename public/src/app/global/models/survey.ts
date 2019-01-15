export class Survey {
    _id: any;
    category: string;
    name: string;
    private: boolean;
    questions: any;
    user: any;
    creator: any;
    lastSubmission: any;
    submissionDates: any;
    surveyTime?: number;
    averageTime?:number;
    totalAnswers?: number;
    users?: any;
    device?: any;
    agent?:any;
    platform?: any;
    createdAt: any;
    updatedAt: any;
}