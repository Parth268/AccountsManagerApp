import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import Modal from 'react-native-modal';
import { useAppTheme } from '../storage/context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
    address: string;
    showAddress?: boolean;
    onClose: () => void;
};

const AddressModal = ({ address, showAddress = false, onClose }: Props) => {
    const { t } = useTranslation();
    const { themeProperties } = useAppTheme();
    const [isVisible, setIsVisible] = useState(showAddress);

    useEffect(() => {
        const backAction = () => {
            if (isVisible) {
                setIsVisible(false);
                onClose();
                return true; // Prevents app from closing
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [isVisible]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={[styles.button, { backgroundColor: themeProperties.backgroundColor }]}
            >
                <Text style={[styles.buttonText, { color: themeProperties.textColor }]}>{t('show_address')}</Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal isVisible={isVisible} onBackdropPress={onClose}>
                <View style={[styles.modalContainer, { backgroundColor: themeProperties.backgroundColor }]}>
                    {/* HEADER */}
                    <View style={styles.modalHeader}>
                        <Text style={[styles.title, { color: themeProperties.textColor }]}>{ }</Text>
                        <Text style={[styles.title, { color: themeProperties.textColor }]}>{t('address')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={themeProperties.textColor} />
                        </TouchableOpacity>
                    </View>

                    {/* ADDRESS */}
                    <Text style={[styles.address, { color: themeProperties.textColor }]}>{address}</Text>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { padding: 10, borderRadius: 5 },
    buttonText: { fontSize: 16 },
    modalContainer: { padding: 20, borderRadius: 10, alignItems: 'center' },
    modalHeader: {
        flexDirection: 'row', width: '100%',
        height: 40,
        justifyContent: 'space-between', alignItems: 'center', marginBottom: 14
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    address: { fontSize: 16, textAlign: 'left', marginBottom: 20 },
});

export default AddressModal;
