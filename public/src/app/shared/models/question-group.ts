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
        name: 'Dates',
        group: [
            { value: "date", viewValue: "Date Calendar" },
            { value: "dateStartEnd", viewValue: "Date Calendar (Min - Max date range)" },
            { value: "dateWeekday", viewValue: "Weekday Calendar (Monday - Friday)" },
        ]
    },
    {
        name: 'Drop Down',
        group: [
            { value: "dropDown", viewValue: "Drop Down (Single answer)" },
            { value: "dropDownMultiple", viewValue: "Drop Down (Multiple answer)" },
        ]
    },
    {
        name: 'Multiple Choice',
        group: [
            { value: "multiplechoice", viewValue: "Multiple Choice (Single answer)" },
            { value: "multiplechoiceOther", viewValue: "Multiple Choice W/ optional user input (one answer)" },
        ]
    },
    {
        name: 'Ratings',
        group: [
            { value: "rate", viewValue: "Slide Rating (1-5)" },
            { value: "star", viewValue: "Star Rating" },
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
        name: 'Scales',
        group: [
            { value: "slide", viewValue: "Sliding scale (1-100)" },
        ]
    },
    {
        name: 'User Feedback',
        group: [
            { value: "text", viewValue: "Single Answer Responce" },
            { value: "paragraph", viewValue: "User Feedback" },        
        ]
    }  
]