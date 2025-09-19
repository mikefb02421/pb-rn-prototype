import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  SafeAreaView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useLazySearchImagesQuery} from '../services/imageApi';
import {RootState} from '../store';
import {
  setQuery,
  setSearchResults,
  appendSearchResults,
  addToHistory,
  setSearching,
} from '../store/searchSlice';

import SearchInput from '../components/search/SearchInput';
import SearchFilters from '../components/search/SearchFilters';
import ImageGrid from '../components/gallery/ImageGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const SearchScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {query, results, isSearching, filters} = useSelector(
    (state: RootState) => state.search,
  );

  const [searchImages, {isLoading, error}] = useLazySearchImagesQuery();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = useCallback(
    async (searchQuery: string, newPage = 1, append = false) => {
      if (!searchQuery.trim()) return;

      dispatch(setSearching(true));

      try {
        const result = await searchImages({
          query: searchQuery,
          page: newPage,
          per_page: 20,
          ...filters,
        }).unwrap();

        if (append) {
          dispatch(appendSearchResults(result.results));
        } else {
          dispatch(setSearchResults(result.results));
          dispatch(addToHistory(searchQuery));
        }

        setPage(newPage);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        dispatch(setSearching(false));
      }
    },
    [dispatch, searchImages, filters],
  );

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      dispatch(setQuery(newQuery));
      if (newQuery.trim()) {
        handleSearch(newQuery);
      } else {
        dispatch(setSearchResults([]));
      }
    },
    [dispatch, handleSearch],
  );

  const handleLoadMore = useCallback(() => {
    if (query && !isLoading && !isSearching) {
      handleSearch(query, page + 1, true);
    }
  }, [query, isLoading, isSearching, page, handleSearch]);

  const handleRefresh = useCallback(async () => {
    if (query) {
      setRefreshing(true);
      await handleSearch(query, 1, false);
      setRefreshing(false);
    }
  }, [query, handleSearch]);

  const renderContent = () => {
    if (isLoading && results.length === 0) {
      return <LoadingSpinner />;
    }

    if (!query) {
      return (
        <EmptyState
          icon="search"
          title="Start Searching"
          subtitle="Enter a search term to find amazing images"
        />
      );
    }

    if (results.length === 0 && !isLoading) {
      return (
        <EmptyState
          icon="photo-library"
          title="No Results Found"
          subtitle="Try adjusting your search terms or filters"
        />
      );
    }

    return (
      <ImageGrid
        images={results}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isLoading && results.length > 0 ? <LoadingSpinner /> : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchInput
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Search for images..."
        />
        <SearchFilters />
      </View>
      <View style={styles.content}>{renderContent()}</View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SearchScreen;