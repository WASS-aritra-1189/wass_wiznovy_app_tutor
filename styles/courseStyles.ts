import { StyleSheet } from 'react-native';

const baseStyles = {
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flexContainer: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  spaceBetweenRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center' },
  buttonText: { fontWeight: 'bold' },
  standardPadding: { paddingHorizontal: 20 },
};

export const courseStyles = StyleSheet.create({
  ...baseStyles,
  keyboardAvoidingView: baseStyles.flexContainer,
  header: {
    ...baseStyles.spaceBetweenRow,
    ...baseStyles.standardPadding,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: { ...baseStyles.rowContainer, padding: 4 },
  backText: { fontSize: 16, color: '#FFFFFF', marginLeft: 0 },
  headerPlaceholder: { width: 24 },
  buttonContainer: {
    ...baseStyles.spaceBetweenRow,
    ...baseStyles.standardPadding,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  cancelButton: { ...baseStyles.button, backgroundColor: '#E0E0E0', marginRight: 10 },
  cancelButtonText: { ...baseStyles.buttonText, color: '#333333' },
  submitButton: { ...baseStyles.button, backgroundColor: '#16423C', marginLeft: 10 },
  submitButtonText: { ...baseStyles.buttonText, color: '#FFFFFF' },
  submitButtonDisabled: { backgroundColor: '#999999', opacity: 0.7 },
  loadingContainer: baseStyles.centerContainer,
  loadingText: { fontSize: 16, color: '#666666' },
});

export const commonStyles = baseStyles;