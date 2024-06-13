import { ReactNode, useCallback, useEffect, useState } from 'react';
import UserForm from '../components/UserForm'
import CompoundMcq from '../components/CompoundMcq';
import { CheckedQuestion, MarkedQuestion, handleFormSubmitParams } from '../types';
import QuizResult from '../components/QuizResult';
import OverButtons from '../components/OverButtons';
import useTestQuestions from '../hooks/useTestQuestions';
import fetchCheckedAnswers from '../utils/fetchCheckedAnswers';
import analyseCheckedQuestions from '../utils/analyseCheckedAnswers';
import { Button } from '../@/components/ui/button';


/*
 * responsibility to fetch mcqs
 * and fetch mcq whenever category or mcqCount are changed
 */
export type TestResult = {
    markedQuestions: MarkedQuestion[],
    totalMcqs: number,
}

const TestPage = () => {
    const {
        mcqList,
        setCategory,
        setMcqCount,
        category,
        variant,
        isFetching,
        setVariant,
        WithTimer
    } = useTestQuestions({})
    const { fetchTimedQuestions } = WithTimer;

    const [renderComponent, setRenderComponent] = useState<ReactNode>()

    const [unvisitedQuestions, setUnvisitedQuestions] = useState<number | undefined>(undefined);
    const [time, setTime] = useState<number | undefined>(undefined);


    const handleFormSubmit = useCallback(({ category, mcqCount, requestMode, timer }: handleFormSubmitParams) => {

        setCategory(category);

        if (requestMode === 'TIMER') {
            setVariant('TIMER');
            setTime(timer);
        }
        else {
            setVariant('NO-TIMER');
            setMcqCount(mcqCount);
        }
    }, [setVariant, setCategory, setTime, setMcqCount]);


    const handleRetry = () => {
        setRenderComponent(
            <CompoundMcq
                mcqList={mcqList}
                meta={<>
                    <CompoundMcq.MetaData
                        children={<>
                            <CompoundMcq.MetaData.TotalMcqs
                                showLoading={isFetching}
                            />
                            <CompoundMcq.MetaData.AttemptedCount />
                        </>}
                    />
                    <CompoundMcq.Timer />
                </>}
                onQuizOver={onQuizOver}
                setUnvisitedQuestions={setUnvisitedQuestions}
                variant='TEST'
                time={time}
            />)
    }

    const handleReset = () => {
        if (variant === 'TIMER') {
            setTime(undefined);
        }
        if (variant === 'NO-TIMER') {
            setMcqCount(undefined);
        }
        setCategory(undefined);
        setVariant(undefined);
    }

    // to fetch more mcqs from the server if having a timed quiz 
    useEffect(() => {

        if (isFetching) {
            return;
        }

        console.log(`unvisitedQuestions :${unvisitedQuestions}`);
        if (unvisitedQuestions && unvisitedQuestions <= 5) {
            fetchTimedQuestions();
        }
    }, [unvisitedQuestions])

    // function to be executed after quiz is over
    // shows the result and reset any state that need to be reset
    const onQuizOver = async ({ markedQuestions, totalMcqs }: TestResult) => {
        if (!category)
            return;
        let checkedQuestions: CheckedQuestion[];
        try {
            checkedQuestions = await fetchCheckedAnswers(category, markedQuestions);
        }
        catch (err) {
            console.log(err);
            // show retry connection btn
            setRenderComponent(() =>
                <div className='h-screen grid justify-center items-center'>
                    <div>
                        <div className='text-red-400 bold'> failed to fetch result</div>
                        <Button
                            className={`w-fit py-4 px-12`}
                            onClick={() => onQuizOver({ markedQuestions, totalMcqs })}>
                            Retry
                        </Button>
                    </div>
                </div>
            );
            return
        }
        const { correctCount, inCorrectCount } = analyseCheckedQuestions(checkedQuestions);
        setRenderComponent(<>
            <QuizResult
                checkedQuestions={checkedQuestions}
                correctCount={correctCount}
                inCorrectCount={inCorrectCount}
                totalMcqs={totalMcqs}
            />
            <OverButtons
                className='flex flex-row justify-center gap-x-12'
                children={[
                    <OverButtons.RetryButton
                        className='bg-gray-50 text-black'
                        onClickHandler={handleRetry}
                    />,
                    <OverButtons.ResetButton
                        className='bg-gray-50 text-black'
                        onClickHandler={handleReset}
                    />
                ]} />
        </>);
    }

    useEffect(() => {
        if (variant === undefined) {
            setRenderComponent(
                <>
                    <h1 className="text-3xl text-center font-bold">
                        Take a TEST
                    </h1>
                    <UserForm
                        onSubmit={handleFormSubmit}
                    >
                        <UserForm.CategoryList />
                        <UserForm.ChooseButtons />
                        <UserForm.McqCountField />
                        <UserForm.SetTimerField />
                        <UserForm.SubmitBtn />
                    </UserForm>
                </>)
        }
        if (variant === 'NO-TIMER' && mcqList.length !== 0) {
            setRenderComponent(
                <CompoundMcq
                    mcqList={mcqList}
                    meta={<CompoundMcq.MetaData
                        children={<>
                            <CompoundMcq.MetaData.TotalMcqs
                                showLoading={isFetching}
                            />
                            <CompoundMcq.MetaData.AttemptedCount />
                        </>}
                    />}
                    onQuizOver={onQuizOver}
                    variant='TEST'
                    setUnvisitedQuestions={setUnvisitedQuestions}
                />)
        }
        if (variant === 'TIMER' && mcqList.length !== 0) {
            setRenderComponent(
                <>
                    <CompoundMcq
                        mcqList={mcqList}
                        meta={<>
                            <CompoundMcq.MetaData
                                children={<>
                                    <CompoundMcq.MetaData.TotalMcqs
                                        showLoading={isFetching}
                                    />
                                    <CompoundMcq.MetaData.AttemptedCount />
                                </>}
                            />
                            <CompoundMcq.Timer />
                        </>}
                        onQuizOver={onQuizOver}
                        variant='TEST'
                        setUnvisitedQuestions={setUnvisitedQuestions}
                        time={time}
                    />
                </>
            )
        }
    }, [variant, mcqList, isFetching]);

    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <div
                className="
                flex 
                flex-col 
                gap-4
            "
            >
                {renderComponent}
            </div>
        </div >
    )
}

export default TestPage
