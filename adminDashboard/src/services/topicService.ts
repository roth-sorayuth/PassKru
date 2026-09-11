import { api } from '../lib/api';
import { TopicItem } from '../types';

export const topicService = {
  async getTopics(subjectId?: number): Promise<TopicItem[]> {
    const qs = subjectId ? `?subjectId=${subjectId}` : '';
    const res = await api.get<{ topics: TopicItem[] }>(`/topics${qs}`);
    return res?.topics || [];
  },
};
