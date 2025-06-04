import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  required?: boolean;
}

export default function Input({
  label,
  error,
  containerStyle,
  labelStyle,
  required = false,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, labelStyle]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      </View>
      
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          props.multiline && styles.multilineInput
        ]}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});