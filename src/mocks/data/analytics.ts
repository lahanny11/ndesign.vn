// src/mocks/data/analytics.ts
export const MOCK_ANALYTICS: Record<string, object> = {
  month: {
    period: 'month',
    production: {
      total_in_progress: 8,
      late_count: 1,
      soon_late_count: 2,
      sla_rate: 87.5,
      late_tasks: [
        {
          order_id: 'ord-0002-uuid-bcde-f234-567890123456',
          task_name: 'Slide bài giảng tháng 4',
          designer_full_name: 'Designer 02',
          days_late: 3,
          priority: 'high',
        },
      ],
    },
    quality: {
      avg_revision_rounds: 1.4,
      tasks_over_2_revisions: 3,
      qa_pass_rate_first_time: 68,
      per_designer: [
        { person_id: 'p-1', full_name: 'Designer 01', avg_revisions: 1.1, task_count: 12, done_count: 10 },
        { person_id: 'p-2', full_name: 'Designer 02', avg_revisions: 2.1, task_count: 9,  done_count: 7  },
      ],
    },
    brief_quality: {
      tasks_brief_returned: 4,
      per_team: [
        { team_id: 'team-social', team_name: 'Social Content', avg_revisions: 2.2, task_count: 8 },
        { team_id: 'team-admin',  team_name: 'Admin',          avg_revisions: 0.9, task_count: 9 },
      ],
      done_by_designer_monthly: [],
    },
  },
  today: {
    period: 'today',
    production: {
      total_in_progress: 8,
      late_count: 0,
      soon_late_count: 1,
      sla_rate: 100,
      late_tasks: [],
    },
    quality: {
      avg_revision_rounds: 1.0,
      tasks_over_2_revisions: 0,
      qa_pass_rate_first_time: 80,
      per_designer: [],
    },
    brief_quality: {
      tasks_brief_returned: 0,
      per_team: [],
      done_by_designer_monthly: [],
    },
  },
}
