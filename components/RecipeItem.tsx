import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Recipe, RootStackParamList } from '../types';

const RecipeItem = React.memo(({ item }: { item: Recipe }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = useCallback(() => {
    navigation.navigate('RecipeDetail', { recipeId: item.id });
  }, [navigation, item.id]);

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      </Card.Content>
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.item.updatedAt === nextProps.item.updatedAt;
});

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
});

export default RecipeItem;
