import { ReactNode } from "react";
import { useMcqComponentContext } from "../../context/McqComponentContext";

export const TotalMcqs = () => {
    const { totalMcqs } = useMcqComponentContext();
    return <div>Total MCQs: {totalMcqs}</div>
}

export const CorrectCount = () => {
    const { correctCount } = useMcqComponentContext();
    return <div>Correct: {correctCount}</div>
}

export const InCorrectCount = () => {
    const { inCorrectCount } = useMcqComponentContext();
    return <div>InCorrect: {inCorrectCount}</div>
}


interface Props {
    children: ReactNode[];
}

const McqComponentMetaData = ({ children }: Props) => {
    return (
        <div className='flex flex-row gap-4'>
            {children}
        </div>
    );
}

McqComponentMetaData.TotalMcqs = TotalMcqs;
McqComponentMetaData.CorrectCount = CorrectCount;
McqComponentMetaData.InCorrectCount = InCorrectCount;

export default McqComponentMetaData;
