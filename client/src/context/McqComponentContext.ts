import { useContext, createContext } from "react";
import { MCQ, MarkedQuestion } from "../types";


type CompoundMcqContextType = {
    mcq: MCQ;
    correctCount: number;
    inCorrectCount: number;
    totalMcqs: number;
    markedAnswers: MarkedQuestion[];
}

export const CompoundMcqContext = createContext<CompoundMcqContextType | undefined>(undefined);

export const useMcqComponentContext = () => {
    const context = useContext(CompoundMcqContext);

    if (!context) {
        throw Error("wtf you doing! pass the McqComponent state and its setter in the context provider");
    }

    return {
        mcq: context.mcq,
        correctCount: context.correctCount,
        inCorrectCount: context.inCorrectCount,
        totalMcqs: context.totalMcqs,
        markedAnswers: context.markedAnswers,
    }
}
