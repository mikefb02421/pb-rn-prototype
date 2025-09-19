import React from 'react';
import {FlatList, View, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ImageResult} from '../../services/types';

interface ImageGridProps {
  images: ImageResult[];
  layoutType?: 'grid' | 'list';
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshControl?: React.ReactElement;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const {width: screenWidth} = Dimensions.get('window');
const GRID_SPACING = 2;
const GRID_COLUMNS = 2;
const IMAGE_SIZE = (screenWidth - GRID_SPACING * (GRID_COLUMNS + 1)) / GRID_COLUMNS;

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  layoutType = 'grid',
  onEndReached,
  onEndReachedThreshold,
  refreshControl,
  ListFooterComponent,
}) => {
  const renderImage = ({item}: {item: ImageResult}) => {
    return (
      <View style={styles.imageContainer}>
        <FastImage
          source={{uri: item.urls.small}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={images}
      renderItem={renderImage}
      keyExtractor={(item) => item.id}
      numColumns={layoutType === 'grid' ? GRID_COLUMNS : 1}
      contentContainerStyle={styles.container}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={refreshControl}
      ListFooterComponent={ListFooterComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: GRID_SPACING / 2,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: GRID_SPACING / 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageGrid;