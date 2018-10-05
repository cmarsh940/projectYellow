export class Question {
    value: string;
    viewValue: string;
}

export class QuestionGroup {
    name: string;
    group: Question[];
}

export const questionGroups: QuestionGroup[] = [
    {
        name: 'Boolean',
        group: [
            { value: "goodbad", viewValue: "Good / Bad" },
            { value: "likeunlike", viewValue: "Like / Unlike" },
            { value: "boolean", viewValue: "True / False" },
            { value: "yesno", viewValue: "YES / NO" },
        ]
    },
    {
        name: 'Satisfaction',
        group: [
            { value: "smilieFaces", viewValue: "Satisfaction (images)" },
            { value: "satisfaction", viewValue: "Satisfaction (text)" },
        ]
    },
    {
        name: 'Ratings',
        group: [
            { value: "rate", viewValue: "Slide Rating (1-5)" },
        ]
    },
    {
        name: 'Dates',
        group: [
            { value: "date", viewValue: "Date (Calender)" },       
        ]
    },
    {
        name: 'Multiple Choice',
        group: [
            { value: "mutiplechoice", viewValue: "Multiple Choice (one answer)" },
        ]
    },
    {
        name: 'User Feedback',
        group: [
            { value: "text", viewValue: "Single Answer Responce" },
            { value: "paragraph", viewValue: "User Feedback" },        
        ]
    },
    {
        name: 'Scales',
        group: [
            { value: "slide", viewValue: "Sliding scale (1-100)" },     
        ]
    }   
]