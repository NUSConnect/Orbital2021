import * as React from "react";
import PostButton from "../PostButton";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<PostButton />);
    expect(tree).toMatchSnapshot();
});