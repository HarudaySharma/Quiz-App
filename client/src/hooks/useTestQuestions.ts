import { useEffect, useState } from "react";
import { Categories, MCQ } from "../types";

type useTestQuestionsParams = {
    category?: Categories,
    mcqCount?: number,
}

const useTestQuestions = ({category: cat, mcqCount: mqC }: useTestQuestionsParams) => {
    const [category, setCategory] = useState<Categories | undefined>(cat);
    const [mcqCount, setMcqCount] = useState<number | undefined>(mqC);
    useEffect(() => {
        if(!category || !mcqCount)
            return;
        const fetchQuestions = async() => {
            try {
                const res = await fetch('/api/quiz/test/questions/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ category, mcqCount })
                });
                if (!res.ok) {
                    console.log("failed");
                    return;
                }
                const data = await res.json() as MCQ[];
                console.log(data);
                // set the MCQ LIST state
                //setMcqList(data);
            }
            catch(err) {
                console.log(err);
            }
        }
        fetchQuestions();
    }, [category, mcqCount]);
    return [setCategory, setMcqCount];
}

export default useTestQuestions;