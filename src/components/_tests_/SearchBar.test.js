import * as React from "react";
import SearchBar from "../SearchBar";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<SearchBar />);
    expect(tree).toMatchSnapshot();
});