import React, { ReactNode, useState } from 'react'
import { useMcqComponentContext } from '../../../context/McqComponentContext';
import { OPTIONS } from '../../../types';
import { Card, CardContent, CardFooter, CardHeader } from '../../../@/components/ui/card';
import { McqCardContext, McqComponentContextTypes } from '../../../context/MCQCardContext';
import McqQuestion from './McqQuestion';
import McqOption from './McqOption';
import McqButton from './McqButton';

interface Props {
    header: ReactNode;
    footer?: ReactNode;
    options: ReactNode;
    getCorrectOption?: () => OPTIONS;
    answerSubmitHandler: (markedOption: OPTIONS) => void;
}

const McqCard = ({
    getCorrectOption,
    answerSubmitHandler,
    header,
    footer,
    options,
}: Props) => {

    const [selectedOption, setSelectedOption] = useState<OPTIONS | null>(null);
    const [correctOption, setCorrectOption] = useState<OPTIONS | null>(null);

    const { mcq, variant } = useMcqComponentContext();

    const optionChooseHandler = (option: OPTIONS): boolean | null => {
        if (variant === 'TEST' || !getCorrectOption) {
            setSelectedOption(option);
            return null;
        }

        const correct = getCorrectOption();

        setCorrectOption(correct);
        setSelectedOption(option);

        return correct === option;
    }

    const onSubmitHandler = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedOption) {
            return;
        }

        answerSubmitHandler(selectedOption);

        // clean the coloring state
        setSelectedOption(null);
        setCorrectOption(null);
    }

    const contextValues: McqComponentContextTypes = {
        question: mcq.question,
        options: {
            A: mcq.A,
            B: mcq.B,
            C: mcq.C,
            D: mcq.D
        },
        optionChooseHandler,
        selectedOption,
        optionChoosed: null,
        correctOption,
        variant: variant,
    }

    return (
        <McqCardContext.Provider value={contextValues} >
            <Card
                className='
                    flex
                    flex-col
                    flex-wrap

                '
            >
                <CardHeader className='flex'>
                    {header}
                </CardHeader>
                <form onSubmit={onSubmitHandler} >
                    <CardContent>
                        <div className='my-4'></div>
                        <section className='flex flex-col gap-2'>
                            {options}
                        </section>
                        <div className='my-8'></div>
                    </CardContent>
                    <CardFooter>
                        {footer}
                    </CardFooter>
                </form>
            </Card>
        </McqCardContext.Provider>
    )
}

McqCard.Question = McqQuestion;
McqCard.Option = McqOption;
McqCard.SubmitButton = McqButton;

export default McqCard;


