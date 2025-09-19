import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Text,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useGetFeaturedImagesQuery} from '../services/imageApi';
import {RootState} from '../store';
import {setImages, appendImages} from '../store/gallerySlice';

import ImageGrid from '../components/gallery/ImageGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import GalleryHeader from '../components/gallery/GalleryHeader';

const GalleryScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {images, layoutType, sortBy} = useSelector(
    (state: RootState) => state.gallery,
  );

  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: featuredImages,
    isLoading,
    error,
    refetch,
  } = useGetFeaturedImagesQuery({
    page,
    per_page: 20,
  });

  useEffect(() => {
    if (featuredImages) {
      if (page === 1) {
        dispatch(setImages(featuredImages));
      } else {
        dispatch(appendImages(featuredImages));
      }
    }
  }, [featuredImages, page, dispatch]);

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (isLoading && images.length === 0) {
      return <LoadingSpinner />;
    }

    if (images.length === 0 && !isLoading) {
      return (
        <EmptyState
          icon="photo-library"
          title="No Images Available"
          subtitle="Check your connection and try again"
        />
      );
    }

    return (
      <ImageGrid
        images={images}
        layoutType={layoutType}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={
          isLoading && images.length > 0 ? <LoadingSpinner /> : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <GalleryHeader title="Featured Gallery" sortBy={sortBy} />
      <View style={styles.content}>{renderContent()}</View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to load images. Please try again.
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

export default GalleryScreen;