import React from 'react';
import { SearchBar as Searcher } from 'react-native-elements';

export default class SearchBar extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <Searcher
        placeholder="Find a forum..."
        onChangeText={this.updateSearch}
        value={search}
      />
    );
  }
}