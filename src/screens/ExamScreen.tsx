import {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {fetchHFSApi} from '../utils/api';
import {HFS_APIs} from '../constants';
import {formatTimestamp} from '../utils/time';
import {ExamObject} from '../../types/exam';
import * as React from 'react';

type ExamParams = {
  examId: string;
};

export default function ExamScreen() {
  const route = useRoute();
  const {examId} = route.params as ExamParams;

  const [examObject, setExamObject] = useState<ExamObject | null>(null);
  const [displayedPapersMode, setDisplayedPapersMode] = useState<{
    [key: string]: boolean;
  }>({});

  const getExamObject = useCallback(
    async (token: string) => {
      try {
        const [detailsResponse, examRankResponse] = await Promise.all([
          fetchHFSApi(HFS_APIs.examOverview, {
            token: token,
            method: 'GET',
            getParams: {examId},
          }),
          fetchHFSApi(HFS_APIs.examRankInfo, {
            token: token,
            method: 'GET',
            getParams: {examId},
          }),
        ]);

        if (detailsResponse.ok && examRankResponse.ok) {
          const details = detailsResponse.payload;
          const examRank = examRankResponse.payload;

          setExamObject({
            detail: details,
            rank: examRank,
          });

          // Initialize papers display mode
          if (details.papers) {
            const initialPapersMode = {};
            details.papers.forEach(paper => {
              initialPapersMode[paper.paperId] = false;
            });
            setDisplayedPapersMode(initialPapersMode);
          }
        }
      } catch (error) {
        console.error('Failed to fetch exam data:', error);
      }
    },
    [examId],
  );

  useEffect(() => {
    // TODO: Get token from secure storage
    const token = 'YOUR_TOKEN_HERE';
    getExamObject(token);
  }, [getExamObject]);

  const togglePaperDisplay = (paperId: string) => {
    setDisplayedPapersMode(prev => ({
      ...prev,
      [paperId]: !prev[paperId],
    }));
  };

  if (!examObject) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{examObject?.detail?.name}</Text>
          <Text style={styles.date}>
            发布时间: {formatTimestamp(String(examObject?.detail?.time))}
          </Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreTitle}>总分</Text>
          <Text style={styles.scoreValue}>{examObject?.detail?.score}</Text>
          {examObject?.rank && (
            <Text style={styles.rankInfo}>
              年级排名: {examObject.rank.rank.grade}
            </Text>
          )}
        </View>

        <View style={styles.papers}>
          <Text style={styles.sectionTitle}>试卷</Text>
          {examObject?.detail?.papers.map(paper => (
            <View key={paper.paperId} style={styles.paperItem}>
              <TouchableOpacity
                style={styles.paperHeader}
                onPress={() => togglePaperDisplay(paper.paperId)}>
                <Text style={styles.paperTitle}>{paper.name}</Text>
                <Text style={styles.paperScore}>得分: {paper.score}</Text>
              </TouchableOpacity>
              {/* {displayedPapersMode[paper.paperId] && (
                <View style={styles.paperDetails}>
                  <Text>正确题数: {paper.correctCount}</Text>
                  <Text>错误题数: {paper.wrongCount}</Text>
                  <Text>总题数: {paper.totalCount}</Text>
                </View>
              )} */}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  scoreSection: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1a73e8',
    marginBottom: 8,
  },
  rankInfo: {
    fontSize: 14,
    color: '#666',
  },
  papers: {
    backgroundColor: 'white',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  paperItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  paperHeader: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paperScore: {
    fontSize: 16,
    color: '#1a73e8',
  },
  paperDetails: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
});
