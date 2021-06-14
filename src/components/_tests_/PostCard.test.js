import * as React from "react";
import PostCard from "../PostCard";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<PostCard />);
    expect(tree).toMatchSnapshot();
});