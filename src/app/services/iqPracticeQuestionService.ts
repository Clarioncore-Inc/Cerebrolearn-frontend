import {
  iqPracticeQuestionsApi,
  type IQPracticeQuestionApiResponse,
  type IQPracticeQuestionCreatePayload,
  type IQPracticeQuestionDifficulty,
  type IQPracticeQuestionUpdatePayload,
} from '../../../utils/api-client';
import type { IQTestType } from '../utils/iqTestTypes';

export interface IQPracticeQuestion {
  id: string;
  type: string;
  difficulty: IQPracticeQuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
  category: string;
  tests: IQTestType[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface IQPracticeQuestionInput {
  type: string;
  difficulty: IQPracticeQuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string | null;
  category: string;
  tests: IQTestType[];
  sortOrder?: number;
}

const toQuestion = (item: IQPracticeQuestionApiResponse): IQPracticeQuestion => ({
  id: item.id,
  type: item.type,
  difficulty: item.difficulty,
  question: item.question,
  options: item.options,
  correctAnswer: item.correct_answer,
  explanation: item.explanation,
  category: item.category,
  tests: item.test_types as IQTestType[],
  sortOrder: item.sort_order,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const toCreatePayload = (
  input: IQPracticeQuestionInput,
): IQPracticeQuestionCreatePayload => ({
  type: input.type,
  difficulty: input.difficulty,
  question: input.question,
  options: input.options,
  correct_answer: input.correctAnswer,
  explanation: input.explanation,
  category: input.category,
  test_types: input.tests,
  sort_order: input.sortOrder,
});

const toUpdatePayload = (
  input: Partial<IQPracticeQuestionInput>,
): IQPracticeQuestionUpdatePayload => ({
  type: input.type,
  difficulty: input.difficulty,
  question: input.question,
  options: input.options,
  correct_answer: input.correctAnswer,
  explanation: input.explanation,
  category: input.category,
  test_types: input.tests,
  sort_order: input.sortOrder,
});

export const iqPracticeQuestionService = {
  async listPublic(): Promise<IQPracticeQuestion[]> {
    return (await iqPracticeQuestionsApi.listPublic()).map(toQuestion);
  },

  async listAdmin(): Promise<IQPracticeQuestion[]> {
    return (await iqPracticeQuestionsApi.listAdmin()).map(toQuestion);
  },

  async create(input: IQPracticeQuestionInput): Promise<IQPracticeQuestion> {
    return toQuestion(await iqPracticeQuestionsApi.create(toCreatePayload(input)));
  },

  async update(
    id: string,
    input: Partial<IQPracticeQuestionInput>,
  ): Promise<IQPracticeQuestion> {
    return toQuestion(await iqPracticeQuestionsApi.update(id, toUpdatePayload(input)));
  },

  async delete(id: string): Promise<void> {
    await iqPracticeQuestionsApi.delete(id);
  },
};