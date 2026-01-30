import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput, Title, Paragraph, HelperText, IconButton, Switch, SegmentedButtons, Chip, Menu, TouchableRipple } from 'react-native-paper';
import { useForm, useFieldArray, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecipeFormData, Category, Difficulty } from '../types';
import { saveRecipe } from '../services/localDataService';
import { CATEGORIES, getCategoryName, DIFFICULTY_LEVELS } from '../config/categories';

// Zod Schema for Validation
const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number().positive("Must be > 0")
  ),
  unit: z.string().min(1, "Unit is required"),
});

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

const recipeFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(categoryIds),
  prepTime: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().positive("Must be > 0")
  ),
  cookTime: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().positive("Must be > 0")
  ),
  servings: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().positive("Must be > 0")
  ),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(z.object({ value: z.string().min(5, "Step must be at least 5 characters") })).min(1, "At least one step is required"),
  tags: z.array(z.object({ value: z.string() })).optional(),
  isPublic: z.boolean(),
});

// Infer TypeScript type from Zod schema
type FormValues = z.infer<typeof recipeFormSchema>;

const CreateRecipeScreen: React.FC = () => {
  const [currentTag, setCurrentTag] = useState('');
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(recipeFormSchema) as Resolver<FormValues>,
    defaultValues: {
      name: '',
      description: '',
      category: 'main-course', // Default value
      prepTime: 0,
      cookTime: 0,
      servings: 4,
      difficulty: 'medium',
      isPublic: false,
      ingredients: [{ name: '', amount: 1, unit: '' }],
      steps: [{ value: '' }],
      tags: [],
    },
  });

  const openCategoryMenu = () => setCategoryMenuVisible(true);
  const closeCategoryMenu = () => setCategoryMenuVisible(false);

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps"
  });

  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
    control,
    name: "tags"
  });

  const handleAddTag = () => {
    if (currentTag.trim()) {
      const exists = tagFields.some(tag => tag.value.toLowerCase() === currentTag.trim().toLowerCase());
      if (!exists) {
        appendTag({ value: currentTag.trim() });
        setCurrentTag('');
      } else {
        Alert.alert("Duplicate Tag", "This tag has already been added.");
      }
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const recipeData: RecipeFormData = {
        ...data,
        category: data.category as Category,
        difficulty: data.difficulty as Difficulty,
        isPublic: data.isPublic,
        steps: data.steps.map(step => step.value),
        tags: data.tags ? data.tags.map(tag => tag.value) : [],
      };

      await saveRecipe(recipeData);

      Alert.alert("Success", "Recipe saved successfully!", [
        { text: "OK", onPress: () => reset() }
      ]);

    } catch (error) {
      console.error("Failed to save recipe:", error);
      Alert.alert("Error", "Failed to save recipe. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Title style={styles.title}>Create a New Recipe</Title>

      <Controller
        name="name"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Recipe Name"
            accessibilityLabel="Recipe Name"
            mode="outlined"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
            testID="recipe-name-input"
          />
        )}
      />
      {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}

      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Description"
            accessibilityLabel="Description"
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.description}
            testID="description-input"
          />
        )}
      />
      {errors.description && <HelperText type="error">{errors.description.message}</HelperText>}

      <Paragraph style={styles.subtitle}>Category</Paragraph>
      <Controller
        name="category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={styles.categoryContainer}>
            {/* Category selection using a dropdown Menu */}
            <Menu
              visible={categoryMenuVisible}
              onDismiss={closeCategoryMenu}
              anchor={
                <TouchableRipple onPress={openCategoryMenu}>
                  <TextInput
                    label="Category"
                    accessibilityLabel="Category"
                    value={getCategoryName(value as Category)}
                    editable={false}
                    right={<TextInput.Icon icon="menu-down" />}
                    mode="outlined"
                  />
                </TouchableRipple>
              }
            >
              {CATEGORIES.map((cat) => (
                <Menu.Item
                  key={cat.id}
                  testID={`category-item-${cat.id}`}
                  onPress={() => {
                    onChange(cat.id);
                    closeCategoryMenu();
                  }}
                  title={`${cat.icon} ${cat.name}`}
                />
              ))}
            </Menu>
          </View>
        )}
      />
      {errors.category && <HelperText type="error">{errors.category.message}</HelperText>}

      <Controller
        name="isPublic"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View style={[styles.row, styles.switchRow]}>
            <TouchableRipple
              onPress={() => onChange(!value)}
              style={styles.switchLabelContainer}
              testID="is-public-switch-label"
            >
              <Paragraph style={styles.switchLabel}>Make Recipe Public</Paragraph>
            </TouchableRipple>
            <Switch
              value={value}
              onValueChange={onChange}
              testID="is-public-switch"
              accessibilityLabel="Make Recipe Public"
            />
          </View>
        )}
      />

      <Paragraph style={styles.subtitle}>Timings & Servings</Paragraph>
      <View style={styles.row}>
        <View style={styles.column}>
            <Controller name="prepTime" control={control} render={({ field: { onChange, onBlur, value } }) => (
                <TextInput label="Prep Time (min)" accessibilityLabel="Prep Time (min)" mode="outlined" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.prepTime} testID="prep-time-input" />
            )} />
            {errors.prepTime && <HelperText type="error">{errors.prepTime.message}</HelperText>}
        </View>
        <View style={styles.column}>
            <Controller name="cookTime" control={control} render={({ field: { onChange, onBlur, value } }) => (
                <TextInput label="Cook Time (min)" accessibilityLabel="Cook Time (min)" mode="outlined" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.cookTime} testID="cook-time-input" />
            )} />
            {errors.cookTime && <HelperText type="error">{errors.cookTime.message}</HelperText>}
        </View>
      </View>
       <Controller name="servings" control={control} render={({ field: { onChange, onBlur, value } }) => (
            <TextInput label="Servings" accessibilityLabel="Servings" mode="outlined" keyboardType="numeric" style={styles.input} onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.servings} testID="servings-input" />
        )} />
        {errors.servings && <HelperText type="error">{errors.servings.message}</HelperText>}

      <Paragraph style={styles.subtitle}>Difficulty</Paragraph>
      <Controller
        name="difficulty"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View testID="difficulty-selection-container">
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={DIFFICULTY_LEVELS.map((level) => ({
                value: level.id,
                label: level.name,
                testID: `difficulty-${level.id}`,
              }))}
            />
          </View>
        )}
      />

      <Paragraph style={styles.subtitle}>Ingredients</Paragraph>
      {ingredientFields.map((item, index) => (
        <View key={item.id} style={styles.fieldArrayRow}>
          <Controller name={`ingredients.${index}.amount`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Amount" accessibilityLabel="Amount" mode="outlined" style={styles.smallInput} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} testID={`ingredient-amount-${index}`} />
          )} />
          <Controller name={`ingredients.${index}.unit`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Unit" accessibilityLabel="Unit" mode="outlined" style={styles.mediumInput} onBlur={onBlur} onChangeText={onChange} value={value} testID={`ingredient-unit-${index}`} />
          )} />
          <Controller name={`ingredients.${index}.name`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Name" accessibilityLabel="Name" mode="outlined" style={styles.largeInput} onBlur={onBlur} onChangeText={onChange} value={value} testID={`ingredient-name-${index}`} />
          )} />
          <IconButton icon="delete" onPress={() => removeIngredient(index)} />
        </View>
      ))}
      {errors.ingredients && <HelperText type="error">{errors.ingredients.message}</HelperText>}
      <Button mode="outlined" style={styles.addButton} onPress={() => appendIngredient({ name: '', amount: 1, unit: '' })}>
        Add Ingredient
      </Button>

      <Paragraph style={styles.subtitle}>Instructions</Paragraph>
      {stepFields.map((item, index) => (
        <View key={item.id} style={styles.fieldArrayRow}>
          <Controller name={`steps.${index}.value`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label={`Step ${index + 1}`} accessibilityLabel={`Step ${index + 1}`} mode="outlined" multiline style={styles.fullInput} onBlur={onBlur} onChangeText={onChange} value={value} testID={`step-${index}`} />
          )} />
          <IconButton icon="delete" onPress={() => removeStep(index)} />
        </View>
      ))}
       {errors.steps && <HelperText type="error">{errors.steps.message}</HelperText>}
      <Button mode="outlined" style={styles.addButton} onPress={() => appendStep({ value: '' })}>
        Add Step
      </Button>

      <Paragraph style={styles.subtitle}>Tags</Paragraph>
      <View style={styles.tagInputContainer}>
        <TextInput
            label="Add Tag"
            accessibilityLabel="Add Tag"
            mode="outlined"
            style={styles.tagInput}
            value={currentTag}
            onChangeText={setCurrentTag}
            onSubmitEditing={handleAddTag}
            right={<TextInput.Icon icon="plus" onPress={handleAddTag} />}
        />
      </View>
      <View style={styles.tagsContainer}>
        {tagFields.map((tag, index) => (
            <Chip key={tag.id} onClose={() => removeTag(index)} style={styles.chip}>
                {tag.value}
            </Chip>
        ))}
      </View>

      <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit)} testID="save-button">
        Save Recipe
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F7F7F7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '48%' },
  fieldArrayRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, justifyContent: 'space-between' },
  smallInput: { flex: 0.2 },
  mediumInput: { flex: 0.3, marginHorizontal: 4 },
  largeInput: { flex: 0.5 },
  fullInput: { flex: 1 },
  addButton: { marginTop: 8, marginBottom: 16 },
  tagInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tagInput: { flex: 1 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { margin: 4 },
  submitButton: { marginTop: 24, paddingVertical: 8, marginBottom: 48 },
  categoryContainer: { marginBottom: 8 },
  switchRow: { alignItems: 'center', marginBottom: 8 },
  switchLabelContainer: { flex: 1, paddingVertical: 8 },
  switchLabel: { fontSize: 16 },
});

export default CreateRecipeScreen;
