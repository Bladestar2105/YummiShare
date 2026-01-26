import React from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput, Title, Paragraph, HelperText, IconButton } from 'react-native-paper';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecipeFormData } from '../types';
import { saveRecipe } from '../services/localDataService';

// Zod Schema for Validation
const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).positive("Must be > 0")
  ),
  unit: z.string().min(1, "Unit is required"),
});

const recipeFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  prepTime: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number({ invalid_type_error: "Must be a number" }).positive("Must be > 0")
  ),
  cookTime: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number({ invalid_type_error: "Must be a number" }).positive("Must be > 0")
  ),
  servings: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number({ invalid_type_error: "Must be a number" }).positive("Must be > 0")
  ),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(z.object({ value: z.string().min(5, "Step must be at least 5 characters") })).min(1, "At least one step is required"),
});

// Infer TypeScript type from Zod schema
type FormValues = z.infer<typeof recipeFormSchema>;

const CreateRecipeScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: '',
      description: '',
      ingredients: [{ name: '', amount: 0, unit: '' }],
      steps: [{ value: '' }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: "ingredients"
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: "steps"
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const recipeData: RecipeFormData = {
        ...data,
        category: 'main-course', // Placeholder
        difficulty: 'medium',   // Placeholder
        isPublic: false,        // Placeholder
        tags: [],               // Placeholder
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
            mode="outlined"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.name}
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
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.description}
          />
        )}
      />
      {errors.description && <HelperText type="error">{errors.description.message}</HelperText>}


      <Paragraph style={styles.subtitle}>Timings & Servings</Paragraph>
      <View style={styles.row}>
        <View style={styles.column}>
            <Controller name="prepTime" control={control} render={({ field: { onChange, onBlur, value } }) => (
                <TextInput label="Prep Time (min)" mode="outlined" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.prepTime} />
            )} />
            {errors.prepTime && <HelperText type="error">{errors.prepTime.message}</HelperText>}
        </View>
        <View style={styles.column}>
            <Controller name="cookTime" control={control} render={({ field: { onChange, onBlur, value } }) => (
                <TextInput label="Cook Time (min)" mode="outlined" keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.cookTime} />
            )} />
            {errors.cookTime && <HelperText type="error">{errors.cookTime.message}</HelperText>}
        </View>
      </View>
       <Controller name="servings" control={control} render={({ field: { onChange, onBlur, value } }) => (
            <TextInput label="Servings" mode="outlined" keyboardType="numeric" style={styles.input} onBlur={onBlur} onChangeText={onChange} value={String(value || '')} error={!!errors.servings} />
        )} />
        {errors.servings && <HelperText type="error">{errors.servings.message}</HelperText>}

      <Paragraph style={styles.subtitle}>Ingredients</Paragraph>
      {ingredientFields.map((item, index) => (
        <View key={item.id} style={styles.fieldArrayRow}>
          <Controller name={`ingredients.${index}.amount`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Amount" mode="outlined" style={styles.smallInput} keyboardType="numeric" onBlur={onBlur} onChangeText={onChange} value={String(value || '')} />
          )} />
          <Controller name={`ingredients.${index}.unit`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Unit" mode="outlined" style={styles.mediumInput} onBlur={onBlur} onChangeText={onChange} value={value} />
          )} />
          <Controller name={`ingredients.${index}.name`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label="Name" mode="outlined" style={styles.largeInput} onBlur={onBlur} onChangeText={onChange} value={value} />
          )} />
          <IconButton icon="delete" onPress={() => removeIngredient(index)} />
        </View>
      ))}
      {errors.ingredients && <HelperText type="error">{errors.ingredients.message}</HelperText>}
      <Button mode="outlined" style={styles.addButton} onPress={() => appendIngredient({ name: '', amount: 0, unit: '' })}>
        Add Ingredient
      </Button>

      <Paragraph style={styles.subtitle}>Instructions</Paragraph>
      {stepFields.map((item, index) => (
        <View key={item.id} style={styles.fieldArrayRow}>
          <Controller name={`steps.${index}.value`} control={control} render={({ field: { onChange, onBlur, value } }) => (
              <TextInput label={`Step ${index + 1}`} mode="outlined" multiline style={styles.fullInput} onBlur={onBlur} onChangeText={onChange} value={value} />
          )} />
          <IconButton icon="delete" onPress={() => removeStep(index)} />
        </View>
      ))}
       {errors.steps && <HelperText type="error">{errors.steps.message}</HelperText>}
      <Button mode="outlined" style={styles.addButton} onPress={() => appendStep({ value: '' })}>
        Add Step
      </Button>

      <Button mode="contained" style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
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
  submitButton: { marginTop: 24, paddingVertical: 8, marginBottom: 48 },
});

export default CreateRecipeScreen;