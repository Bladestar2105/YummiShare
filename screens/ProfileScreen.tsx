import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Platform } from 'react-native';
import { Button, Title, Text, Avatar, List, Divider } from 'react-native-paper';
import { seedRecipes } from '../services/localDataService';
import { DUMMY_RECIPES } from '../utils/dummyData';
import { getUserId } from '../services/userService';

const ProfileScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLoadDemoData = async () => {
    // Direct execution for simplicity and robustness in web automation
    setLoading(true);
    try {
      const userId = await getUserId();
      const recipesWithUser = DUMMY_RECIPES.map(r => ({ ...r, userId }));
      await seedRecipes(recipesWithUser);
      // Only show alert on native, or a simple one on web that doesn't block execution flow if possible
      // But for playwright 'dialog' handler to work, we DO need an alert or we need to just NOT have one.
      // I'll skip alert on success for now to avoid hanging if handler fails.
      if (Platform.OS !== 'web') {
        Alert.alert("Success", "Demo data loaded successfully!");
      } else {
        console.log("Demo data loaded successfully!");
      }
    } catch (error) {
      console.error(error);
      if (Platform.OS !== 'web') {
        Alert.alert("Error", "Failed to load demo data.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar.Icon size={80} icon="account" />
        <Title style={styles.name}>User</Title>
        <Text style={styles.email}>user@example.com</Text>
      </View>

      <View style={styles.section}>
        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => {}}
          />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => {}}
          />
          <Divider />
          <List.Subheader>App Settings</List.Subheader>
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            onPress={() => {}}
          />
           <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <Text style={{alignSelf:'center', marginRight: 16}}>Off</Text>}
            onPress={() => {}}
          />
        </List.Section>
      </View>

      <View style={styles.footer}>
         <Button
          mode="contained"
          onPress={handleLoadDemoData}
          loading={loading}
          style={styles.demoButton}
          buttonColor="#FF6B6B"
        >
          Load Demo Data
        </Button>
        <Button mode="outlined" onPress={() => {}} style={styles.logoutButton}>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  footer: {
    padding: 16,
  },
  demoButton: {
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#FF6B6B',
    textColor: '#FF6B6B',
  },
});

export default ProfileScreen;
