import {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {fetchHFSApi} from '../utils/api';
import {formatTimestamp} from '../utils/time';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HFS_APIs} from '../constants';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ExamDetail} from '../../types/exam';

const ExamCard = ({
  name,
  score,
  released,
  examId,
}: {
  name: string;
  score: string;
  released: string;
  examId: string;
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Exam', {examId})}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{name}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>成绩:</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <Text style={styles.releaseDate}>发布时间: {released}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [examList, setExams] = useState<
    {
      name: string;
      score: string;
      released: string;
      examId: string;
    }[]
  >([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const token = AsyncStorage.getItem('hfs_token');
    if (!token) {
      setTimeout(() => {
        // TODO: Add toast message
        navigation.navigate('Login');
      });
      return;
    }

    const loadExams = async () => {
      try {
        const exams = await fetchHFSApi(HFS_APIs.examList, {
          method: 'GET',
          token: token as unknown as string,
        });

        if (!exams.ok || !exams.payload?.list) {
          // TODO: Add toast message
          console.error('获取考试列表失败：' + exams.errMsg);
          return;
        }

        const newExams = exams.payload.list.map((exam: ExamDetail) => ({
          name: exam.name,
          score: `${exam.score}/${exam.manfen}`,
          released: formatTimestamp(exam.time),
          examId: exam.examId,
        }));

        setExams(newExams);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      }
    };

    loadExams();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={examList}
        renderItem={({item}) => (
          <ExamCard
            name={item.name}
            score={item.score}
            released={item.released}
            examId={item.examId}
          />
        )}
        keyExtractor={item => item.examId}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    color: '#666',
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  releaseDate: {
    color: '#666',
    fontSize: 14,
  },
});
