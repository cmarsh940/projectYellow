export class QuestionType {
    value: string;
    viewValue: string;
}

export const questionTypes: QuestionType[] = [
    { value: "date", viewValue: "Date" },
    { value: "goodbad", viewValue: "Good / Bad" },
    { value: "likeunlike", viewValue: "Like / Unlike" },
    { value: "mutiplechoice", viewValue: "Multiple Choice" },
    { value: "smilieFaces", viewValue: "Satisfaction (images)" },
    { value: "satisfaction", viewValue: "Satisfaction (text)" },
    { value: "text", viewValue: "Single Answer" },
    { value: "rate", viewValue: "Slide Rating (1-5)" },
    { value: "slide", viewValue: "Sliding scale (1-100)" },
    { value: "boolean", viewValue: "True / False" },
    { value: "paragraph", viewValue: "User Feedback" },
    { value: "yesno", viewValue: "YES / NO" },
]