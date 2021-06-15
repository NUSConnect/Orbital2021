import * as React from "react";
import PostCard from "../PostCard";
import renderer from "react-test-renderer";
import 'jest-styled-components'

it(`renders correctly`, () => {
    const tree = renderer.create(<PostCard />).toJSON();
    expect(tree).toMatchSnapshot();
});