import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar = ({ placeholder = 'Search', onChangeText }: SearchBarProps) => {
  const [value, setValue] = useState('');

  const handleChange = (text: string) => {
    setValue(text);
    onChangeText?.(text);
  };

  return (
    <Searchbar
      placeholder={placeholder}
      value={value}
      onChangeText={handleChange}
      style={styles.searchBar}
      inputStyle={styles.input}
      iconColor="#64748B"
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    borderRadius: 16,
    elevation: 0,
    backgroundColor: '#F1F5F9',
  },
  input: {
    fontSize: 16,
  },
});

