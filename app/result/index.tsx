import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import type { PartMatch } from '@/types';

function formatScore(score: number): string {
  return `${(score * 100).toFixed(1)}%`;
}

export default function ResultScreen() {
  const { queryUri, matches: matchesParam, capturedAt } = useLocalSearchParams<{
    queryUri: string;
    matches: string;
    capturedAt: string;
  }>();

  const matches: PartMatch[] = matchesParam ? JSON.parse(matchesParam) : [];
  const bestMatch = matches[0];

  const header = (
    <View>
      <Text style={styles.title}>Resultado</Text>
      <Text style={styles.subtitle}>
        Ranking local por similaridade (histograma + grid de cores)
      </Text>

      {queryUri ? (
        <View style={styles.queryCard}>
          <Image source={{ uri: queryUri }} style={styles.queryImage} />
          <View style={styles.queryMeta}>
            <Text style={styles.queryLabel}>Foto capturada</Text>
            <Text style={styles.queryDate}>
              {capturedAt
                ? new Date(capturedAt).toLocaleString('pt-BR')
                : 'Agora'}
            </Text>
          </View>
        </View>
      ) : null}

      {bestMatch ? (
        <View style={styles.bestMatchCard}>
          <Text style={styles.bestMatchLabel}>Melhor match</Text>
          <Text style={styles.bestMatchName}>{bestMatch.partName}</Text>
          <Text style={styles.bestMatchScore}>
            Confiança: {formatScore(bestMatch.score)}
          </Text>
          <Text style={styles.bestMatchMeta}>
            Baseado em {bestMatch.imageCount} imagens do dataset
          </Text>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            Nenhuma peça encontrada no dataset.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Ranking completo</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.partId}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <View style={styles.rankCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{index + 1}</Text>
            </View>
            <View style={styles.rankInfo}>
              <Text style={styles.rankName}>{item.partName}</Text>
              <Text style={styles.rankMeta}>
                {item.imageCount} imagens · score {formatScore(item.score)}
              </Text>
            </View>
            <View style={styles.scoreBarTrack}>
              <View
                style={[styles.scoreBarFill, { width: `${item.score * 100}%` }]}
              />
            </View>
          </View>
        )}
        ListFooterComponent={
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Nova busca</Text>
          </Pressable>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 20,
  },
  queryCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  queryImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#334155',
  },
  queryMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  queryLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  queryDate: {
    color: '#94a3b8',
    fontSize: 13,
  },
  bestMatchCard: {
    backgroundColor: '#14532d',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  bestMatchLabel: {
    color: '#bbf7d0',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bestMatchName: {
    color: '#f0fdf4',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  bestMatchScore: {
    color: '#86efac',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  bestMatchMeta: {
    color: '#bbf7d0',
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  rankCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  rankBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 13,
  },
  rankInfo: {
    paddingRight: 36,
  },
  rankName: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  rankMeta: {
    color: '#94a3b8',
    fontSize: 13,
  },
  scoreBarTrack: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 999,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 999,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
