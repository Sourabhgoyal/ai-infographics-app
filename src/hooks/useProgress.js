import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOTAL_COUNT } from '../data/infographics';

const STORAGE_KEY = '@ai_infographics_read';

export function useProgress() {
  const [readSet, setReadSet] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((json) => {
      if (json) {
        try {
          const arr = JSON.parse(json);
          setReadSet(new Set(arr));
        } catch (_) {}
      }
      setLoaded(true);
    });
  }, []);

  const markRead = useCallback(async (id) => {
    setReadSet((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      // Persist async
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const markUnread = useCallback(async (id) => {
    setReadSet((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const resetAll = useCallback(async () => {
    setReadSet(new Set());
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const readCount = readSet.size;
  const percentage = TOTAL_COUNT > 0 ? Math.round((readCount / TOTAL_COUNT) * 100) : 0;

  const getCategoryProgress = useCallback((catImages) => {
    const read = catImages.filter((img) => readSet.has(img.id)).length;
    return { read, total: catImages.length };
  }, [readSet]);

  return { readSet, readCount, percentage, loaded, markRead, markUnread, resetAll, getCategoryProgress };
}
