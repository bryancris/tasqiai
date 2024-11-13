/* eslint-disable no-useless-catch */
import { AxiosResponse } from 'axios';
import { api } from '@/lib/api';
import { Task, TaskEntry } from '@/types';
import { SearchParamsOptions, queryParamsMapping } from '@/lib/util/filter';

interface TaskLabelRelation {
  labelId: string;
  taskId: string;
}

export const TaskService = {
  createTask: async (task: TaskEntry) => {
    try {
      const response: AxiosResponse<Task> = await api.post('/api/tasks', task, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  // Define default value for the entire argument using Partial
  getTasks: async (
    params: Partial<SearchParamsOptions> = {},
  ): Promise<Task[]> => {
    try {
      const queryParams: { [key: string]: string | boolean | number } = {};

      // Loop through each [param, queryParam] pair in the queryParamsMapping object
      // eslint-disable-next-line no-restricted-syntax
      for (const [param, queryParam] of Object.entries(queryParamsMapping)) {
        // Extract the value of the current parameter from the params object
        const paramValue = params[param as keyof SearchParamsOptions];

        // Check if the extracted parameter value is not undefined
        if (paramValue !== undefined) {
          // Assign the non-undefined parameter value to the corresponding property in the queryParams object
          queryParams[queryParam] = paramValue;
        }
      }

      const response: AxiosResponse = await api.get('/api/tasks', {
        params: queryParams,
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  },
  getTask: async (taskId: string): Promise<Task> => {
    try {
      const response: AxiosResponse = await api.get(`/api/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  updateTask: async (taskId: string, updatedTask: TaskEntry): Promise<Task> => {
    try {
      const response: AxiosResponse = await api.put(
        `/api/tasks/${taskId}`,
        updatedTask,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  deleteTask: async (taskId: string): Promise<Task> => {
    try {
      const response: AxiosResponse = await api.delete(`/api/tasks/${taskId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  addLabel: async ({ taskId, labelId }: TaskLabelRelation): Promise<void> => {
    try {
      const response: AxiosResponse = await api.post(
        `/api/tasks/${taskId}/labels/${labelId}`,
        null,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  },
  removeLabel: async ({
    labelId,
    taskId,
  }: TaskLabelRelation): Promise<void> => {
    try {
      const response: AxiosResponse = await api.delete(
        `/api/tasks/${taskId}/labels/${labelId}`,
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  },
};