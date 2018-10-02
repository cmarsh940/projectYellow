export class QuestionType {
    value: string;
    viewValue: string;
}

export const questionTypes: QuestionType[] = [
    { value: "boolean", viewValue: "True / False" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "text", viewValue: "Single Answer" },
    { value: "paragraph", viewValue: "User Feedback" },
    { value: "smilieFaces", viewValue: "Satisfaction (images)" },
    { value: "satisfaction", viewValue: "Satisfaction (text)" },
    { value: "yesno", viewValue: "YES / NO" },
    { value: "goodbad", viewValue: "Good / Bad" },
    { value: "slide", viewValue: "Sliding scale" },
    { value: "date", viewValue: "Date" },
    { value: "rate", viewValue: "Rating" },
]