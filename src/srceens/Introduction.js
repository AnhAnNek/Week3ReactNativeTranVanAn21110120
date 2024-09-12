import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text, Snackbar, Button, Card, ActivityIndicator } from 'react-native-paper';
import { API_URL } from '../utils/constants';
import { getToken } from '../utils/authUtils';
import { get } from '../utils/httpRequest';

function Introduction({ route, navigation }) {
    const { username } = route.params;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchUserByToken = async () => {
        if (!username) {
            setSnackbarMessage('Please enter a username.');
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);
        try {
            const tokenStr = await getToken();
            const response = await get(`${API_URL}/auth/get-user-by-token`, {
                params: {
                    tokenStr,
                },
            });
            if (response.status === 200) {
                setUser(response.data);
            } else {
                setSnackbarMessage('User not found.');
                setSnackbarVisible(true);
            }
        } catch (error) {
            setSnackbarMessage('An error occurred while fetching user data.');
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserByToken();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <Text variant="headlineLarge" style={{ textAlign: 'center', marginBottom: 20 }}>
                User Profile
            </Text>
            {loading ? (
                <ActivityIndicator animating={true} />
            ) : (
                <Card>
                    {user ? (
                        <Card.Content>
                            <Text variant="titleLarge" style={{ marginBottom: 10 }}>Full name: {user.fullName}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Username: {user.username}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Email: {user.email}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Phone Number: {user.phoneNumber}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Date of Birth: {user.dob}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Gender: {user.gender}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Role: {user.role}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Bio: {user.bio || "No bio available"}</Text>
                            <Text variant="bodyMedium" style={{ marginBottom: 5 }}>Account Created: {new Date(user.createdAt).toLocaleDateString()}</Text>
                        </Card.Content>
                    ) : (
                        <Card.Content>
                            <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                                No user found. Please enter a username.
                            </Text>
                        </Card.Content>
                    )}
                </Card>
            )}
            <Button
                mode="contained"
                onPress={fetchUserByToken}
                loading={loading}
                style={{ marginTop: 20 }}
            >
                Fetch User
            </Button>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </SafeAreaView>
    );
}

export default Introduction;
