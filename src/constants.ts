export const HFS_APIs = {
  login: 'https://hfs-be.yunxiao.com/v2/users/sessions',
  userSnapshot: 'https://hfs-be.yunxiao.com/v2/user-center/user-snapshot',
  examList: 'https://hfs-be.yunxiao.com/v3/exam/list?start=0&limit=100',
  examOverview: 'https://hfs-be.yunxiao.com/v3/exam/${examId}/overview',
  examRankInfo: 'https://hfs-be.yunxiao.com/v3/exam/${examId}/rank-info',
  answerPicture:
    'https://hfs-be.yunxiao.com/v3/exam/${examId}/papers/${paperId}/answer-picture?pid=${pid}',
  paperRankInfo:
    'https://hfs-be.yunxiao.com/v3/exam/${examId}/papers/${paperId}/rank-info',
} as const;
